import * as THREE from 'three';
import { createSword } from './sword';

export type HeroMotion = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'attack';

export async function loadHero() {
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/sophia/sophia.glb`);
  const root = new THREE.Group();
  root.name = 'Hero';
  const model = gltf.scene;
  root.add(model);
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const scale = 2.35 / bounds.getSize(new THREE.Vector3()).y;
  model.scale.setScalar(scale);
  model.position.y = -bounds.min.y * scale;
  const bones = new Map<string, THREE.Bone>();
  let skinnedMeshes = 0;
  let triangles = 0;
  model.traverse(object => {
    if (object instanceof THREE.Bone) bones.set(object.name, object);
    if (object instanceof THREE.SkinnedMesh) {
      skinnedMeshes++;
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = false;
      triangles += (object.geometry.index?.count ?? object.geometry.getAttribute('position').count) / 3;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 0.65;
          material.map && (material.map.anisotropy = 4);
        }
      }
    }
  });
  if (!skinnedMeshes) throw new Error('人物檔案沒有骨架網格');
  const bone = (name: string) => {
    const result = bones.get(THREE.PropertyBinding.sanitizeNodeName(name));
    if (!result) throw new Error(`人物骨架缺少 ${name}`);
    return result;
  };
  const hand = bone('DEF-hand.R');
  const upperArm = bone('DEF-upper_arm.R');
  const forearm = bone('DEF-forearm.R');
  const chest = bone('DEF-spine.003');
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();
  for (const clip of gltf.animations) actions.set(clip.name, mixer.clipAction(clip));
  for (const name of ['Idle', 'Run', 'Jump', 'Fall']) if (!actions.has(name)) throw new Error(`人物缺少 ${name} 動畫`);
  let active = actions.get('Idle')!;
  active.play();
  mixer.update(0);
  root.updateMatrixWorld(true);
  const sword = createSword();
  sword.position.set(0, 0.075, 0);
  const worldGrip = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.55, 0.85).normalize());
  sword.quaternion.copy(hand.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldGrip));
  hand.add(sword);
  const handPosition = new THREE.Vector3();
  let motion: HeroMotion = 'idle';

  function setAction(name: string, timeScale = 1) {
    const next = actions.get(name)!;
    if (active !== next) {
      const previous = active;
      next.reset().setEffectiveTimeScale(timeScale).setEffectiveWeight(1).play();
      previous.crossFadeTo(next, 0.16, false);
      active = next;
    }
    active.setEffectiveTimeScale(timeScale);
  }

  return {
    root,
    update(dt: number, moving: boolean, running: boolean, jumpHeight: number, jumpVelocity: number, attackTime: number) {
      motion = attackTime > 0 ? 'attack' : jumpHeight > 0.02 ? (jumpVelocity > 0 ? 'jump' : 'fall') : moving ? (running ? 'run' : 'walk') : 'idle';
      if (jumpHeight > 0.02) setAction(jumpVelocity > 0 ? 'Jump' : 'Fall');
      else if (moving) setAction('Run', running ? 1.35 : 0.72);
      else setAction('Idle');
      mixer.update(dt);
      // 在原始骨架姿態上疊加揮劍，不再旋轉獨立於手臂的武器。
      if (attackTime > 0) {
        const phase = 1 - attackTime / 0.32;
        const swing = Math.sin(phase * Math.PI);
        upperArm.rotateX(-1.5 * swing);
        upperArm.rotateZ(0.85 * Math.sin(phase * Math.PI * 2));
        forearm.rotateX(-0.6 * swing);
        chest.rotateY(-0.35 * Math.sin(phase * Math.PI * 2));
      }
      // 握劍手指採輕度彎曲，基礎姿態每幀由 Mixer 還原，不累加。
      for (const digit of ['index', 'middle', 'ring', 'pinky']) {
        bone(`DEF-f_${digit}.01.R`).rotateX(0.6);
        bone(`DEF-f_${digit}.02.R`).rotateX(0.7);
      }
      root.updateMatrixWorld(true);
    },
    snapshot() {
      hand.getWorldPosition(handPosition);
      return {
        loaded: true, skinnedMeshes, bones: bones.size, triangles,
        animation: motion, clip: active.getClip().name, animationTime: active.time,
        swordAttachedTo: sword.parent?.name ?? '',
        hand: { x: handPosition.x, y: handPosition.y, z: handPosition.z },
        upperArm: upperArm.quaternion.toArray(),
      };
    },
  };
}
