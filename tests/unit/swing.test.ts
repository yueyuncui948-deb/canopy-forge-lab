// 揮劍方向檢查：所有骨架在相同階段，手的位置應落在相同的角色方位。
// 舊版以骨頭本地軸旋轉，在 CC／UE5 等骨架上會往後甩（task-006 使用者回報）。
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { characters } from '../../src/character/catalog.ts';
import { applySwing, createPoseGuard, swingPose } from '../../src/character/swing.ts';
import { boneMap, loadCharacterGlb, normalizeHeight, sanitize } from './support/load-glb.ts';

const pub = (path: string) => new URL(`../../public/${path}`, import.meta.url).pathname;

test('姿勢還原器：程序疊加每幀還原，不會在動畫未寫入的骨頭上累加', async () => {
  const c = characters.find(c => c.id === 'a2')!;
  const gltf = await loadCharacterGlb(pub(c.file));
  const clip = gltf.animations.find(a => a.name === c.idle)!;
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(clip).play();
  // 取動畫沒有寫入的骨頭（Mixer 永遠不會重設它），這正是累加風險所在
  const animated = new Set(clip.tracks.map(t => t.name.split('.')[0]));
  let free: THREE.Object3D | undefined;
  gltf.scene.traverse(o => { if (!free && o instanceof THREE.Bone && !animated.has(o.name)) free = o; });
  assert.ok(free, '應存在未被動畫寫入的骨頭');
  mixer.setTime(0.2); const clean = free.quaternion.clone();
  for (let i = 0; i < 3; i++) { mixer.setTime(0.2); free.rotateX(0.5); }
  assert.ok(free.quaternion.angleTo(clean) > 1, '前提：沒有還原器時旋轉會累加');
  free.quaternion.copy(clean);
  const guard = createPoseGuard();
  for (let i = 0; i < 5; i++) { guard.restore(); mixer.setTime(0.2); guard.remember(free); free.rotateX(0.5); }
  guard.restore();
  assert.ok(free.quaternion.angleTo(clean) < 1e-6, '還原後應回到原姿勢');
});

test('揮劍姿勢分段連續：起點與終點回到原姿勢，蓄力過頭、劈砍向左前', () => {
  assert.deepEqual(swingPose(0), { armPitch: 0, armYaw: 0, elbow: 0, chestYaw: 0, wrist: 0 });
  const end = swingPose(1);
  for (const value of Object.values(end)) assert.ok(Math.abs(value) < 1e-9);
  assert.ok(swingPose(0.35).armPitch < -2.3);
  assert.ok(swingPose(0.65).armYaw > 0.7);
});

// 程序揮劍只用於沒有 Mixamo 動作組的角色（Rocketbox、Sophia）
for (const c of characters.filter(c => !c.moves)) {
  test(`${c.id}：揮劍蓄力時手高於肩，劈砍時手在身前並掃向左側`, async () => {
    const gltf = await loadCharacterGlb(pub(c.file));
    const root = new THREE.Group(); root.add(gltf.scene);
    normalizeHeight(gltf.scene);
    const mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations.find(a => a.name === c.idle)!).play();
    const bones = boneMap(gltf.scene);
    const bone = (name: string) => bones.get(sanitize(name))!;
    const parts = { root, chest: bone(c.chest), upperArm: bone(c.arm), forearm: bone(c.forearm), hand: bone(c.hand) };
    const guard = createPoseGuard();
    const at = (phase: number) => {
      guard.restore(); mixer.setTime(0.2); root.updateMatrixWorld(true);
      guard.remember(parts.chest, parts.upperArm, parts.forearm, parts.hand);
      applySwing(swingPose(phase), parts); root.updateMatrixWorld(true);
      return { hand: parts.hand.getWorldPosition(new THREE.Vector3()), shoulder: parts.upperArm.getWorldPosition(new THREE.Vector3()), wrist: parts.forearm.getWorldPosition(new THREE.Vector3()) };
    };
    const rest = at(0), windup = at(0.35), strike = at(0.6);
    const arm = rest.hand.distanceTo(rest.shoulder); // 門檻依手臂長度換算（Sophia 為 Q 版短手）
    assert.ok(windup.hand.y > windup.shoulder.y + 0.15 * arm, `${c.id} 蓄力時手（y=${windup.hand.y.toFixed(2)}）未高於肩（${windup.shoulder.y.toFixed(2)}）`);
    assert.ok(strike.hand.z > strike.shoulder.z + 0.4 * arm, `${c.id} 劈砍時手不在身前（z=${strike.hand.z.toFixed(2)}，肩 ${strike.shoulder.z.toFixed(2)}）`);
    assert.ok(strike.hand.x > rest.hand.x + 0.25 * arm, `${c.id} 劈砍未掃向左側（x ${rest.hand.x.toFixed(2)} → ${strike.hand.x.toFixed(2)}）`);
    // 手掌必須跟著前臂（IK 骨架的手掌原本不在前臂子樹）
    const wristGap = strike.hand.distanceTo(strike.wrist), restGap = rest.hand.distanceTo(rest.wrist);
    assert.ok(Math.abs(wristGap - restGap) < 0.05, `${c.id} 揮劍時手掌與前臂脫節（${restGap.toFixed(2)} → ${wristGap.toFixed(2)}）`);
  });
}
