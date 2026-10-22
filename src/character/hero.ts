import * as THREE from 'three';
import { createSword } from './sword';
import { findCharacter, type Character, type ClipAction, type HeroAction } from './catalog';
import { applySwing, createPoseGuard, swingPose } from './swing';

export type HeroMotion = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'attack' | 'crouch' | HeroAction;
export type PreviewMotion = HeroAction | 'crouch';

export async function loadHero(config: Character = findCharacter(null)) {
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
  ]);
  // Sketchfab 候選人物以 meshopt 壓縮幾何；未壓縮的舊模型不受影響。
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(`${import.meta.env.BASE_URL}${config.file}`);
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
  const hand = bone(config.hand);
  const upperArm = bone(config.arm);
  const forearm = bone(config.forearm);
  const chest = bone(config.chest);
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();
  for (const clip of gltf.animations) actions.set(clip.name, mixer.clipAction(clip));
  for (const name of [config.idle, config.walk, config.run, config.jump, config.fall, ...Object.values(config.moves?.clips ?? {})]) if (!actions.has(name)) throw new Error(`人物缺少 ${name} 動畫`);
  let active = actions.get(config.idle)!;
  active.play();
  mixer.update(0);
  root.updateMatrixWorld(true);
  const sword = createSword();
  // 有 SwordGrip（重新綁定時依 X Bot 手部解剖換算的握法）就掛在那裡：刀身沿虎口伸出、刃口朝指關節，
  // 與 Mixamo 動作設計時的持劍角度一致（task-009）。舊角色沿用載入姿勢的世界方向。
  const swordGrip = model.getObjectByName('SwordGrip');
  if (swordGrip) {
    const gripScale = swordGrip.getWorldScale(new THREE.Vector3()).x;
    sword.scale.setScalar(1 / gripScale);
    sword.position.set(0, 0.03 / gripScale, 0); // 握柄中心（劍模型 y≈-0.03）對準握點
    swordGrip.add(sword);
  } else {
    sword.position.set(0, config.grip, 0);
    // 武器用世界尺寸，避免公分制骨架把劍放大百倍。
    sword.scale.setScalar(1 / hand.getWorldScale(new THREE.Vector3()).x);
    const worldGrip = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.55, 0.85).normalize());
    sword.quaternion.copy(hand.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldGrip));
    hand.add(sword);
  }
  const handPosition = new THREE.Vector3();
  const thighL = bone(config.legs.thighL), thighR = bone(config.legs.thighR);
  const calfL = bone(config.legs.calfL), calfR = bone(config.legs.calfR);
  const leftHip = new THREE.Vector3(), rightHip = new THREE.Vector3(), forward = new THREE.Vector3();
  let motion: HeroMotion = 'idle';
  const poseGuard = createPoseGuard();
  const fingers = config.id === 'sophia' ? ['index', 'middle', 'ring', 'pinky'].flatMap(d => [bone(`DEF-f_${d}.01.R`), bone(`DEF-f_${d}.02.R`)]) : [];

  // 下一次切換的淡入時間；收勢與待機姿勢差異較大的動作（施法）結束時拉長，避免跳動
  let nextFade = 0.16;
  function setAction(name: string, timeScale = 1, once = false, startAt = 0) {
    const next = actions.get(name)!;
    if (active !== next || once) {
      const previous = active;
      next.reset().setEffectiveTimeScale(timeScale).setEffectiveWeight(1);
      next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
      next.clampWhenFinished = once;
      next.time = startAt;
      next.play();
      if (previous !== next) previous.crossFadeTo(next, once ? 0.1 : nextFade, false);
      nextFade = 0.16;
      active = next;
    }
    active.setEffectiveTimeScale(timeScale);
  }

  // 動作層（Mixamo 角色）：攻擊、施法、受擊、倒地播放一次，期間暫停移動動畫。
  const moves = config.moves;
  let performing: { kind: HeroAction; elapsed: number; duration: number; rootPrev: THREE.Vector3 | null } | null = null;
  // 一次性動作的水平根位移（重新綁定時存於 RootMotion 節點，角色座標 +Z 為前）
  const rootMotion = model.getObjectByName('RootMotion') ?? null;
  let preview: PreviewMotion | null = null;
  // 展示模式中依序循環播放的連段（二連擊）
  let previewSeq: { stages: number[]; index: number; left: number } | null = null;
  let airborne = false;
  function startOnce(kind: HeroAction, segment?: { clip: string; from: number; to: number; hits: number[] }) {
    const name = segment?.clip ?? moves!.clips[kind as ClipAction];
    const clip = actions.get(name)!.getClip();
    const range = segment ? [segment.from, segment.to] : moves!.ranges[kind as ClipAction] ?? [0, clip.duration];
    const from = range[0], to = Math.min(range[1], clip.duration);
    const scale = kind === 'death' || kind === 'hit' ? 1 : moves!.actionScale;
    setAction(name, scale, true, from);
    performing = { kind, elapsed: 0, duration: (to - from) / scale, rootPrev: null };
    return { duration: performing.duration, hits: (segment?.hits ?? moves!.hits[kind as ClipAction]).map(t => (t - from) / scale) };
  }

  return {
    root,
    config,
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      const textures = new Set<THREE.Texture>();
      const materials = new Set<THREE.Material>();
      root.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose();
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      for (const material of materials) {
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
        material.dispose();
      }
      for (const texture of textures) {
        texture.dispose();
        if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close();
      }
      root.removeFromParent();
    },
    /** 是否支援 Mixamo 動作（攻擊連段、施法、受擊、倒地、蹲走）。 */
    supports() { return !!moves; },
    /** 開始一次性動作；回傳持續時間與擊中時刻（秒，已套倍率）。不支援時回傳 null。 */
    perform(kind: HeroAction) {
      if (!moves || kind === 'combo2') return null; // 二連擊由 main 以 chain 段落組成
      if (performing?.kind === 'death' && kind !== 'death') return null;
      return startOnce(kind);
    },
    get performing() { return performing?.kind ?? null; },
    /** J 連段第 stage 段（0 起算）；回傳 null 表示沒有該段。 */
    performChain(stage: number) {
      const segment = moves?.chain[stage];
      if (!segment || performing?.kind === 'death') return null;
      return startOnce('attack', segment);
    },
    /** 提早結束目前動作（收招時移動取消），交回移動狀態機淡出。 */
    cancel() { if (performing?.kind !== 'death') performing = null; },
    /** 展示模式循環預覽；null 回到一般狀態機。 */
    preview(kind: PreviewMotion | null) {
      preview = moves ? kind : null; performing = null; previewSeq = null;
      if (preview === 'crouch') setAction(moves!.clips.crouch, config.crouchScale ?? 1);
      else if (preview === 'combo2') { previewSeq = { stages: moves!.sequences.combo2, index: 0, left: 0 }; }
      else if (preview) setAction(moves!.clips[preview], preview === 'death' || preview === 'hit' ? 1 : moves!.actionScale, preview === 'death');
    },
    revive() { performing = null; setAction(config.idle); },
    update(dt: number, moving: boolean, running: boolean, jumpHeight: number, jumpVelocity: number, attackTime: number, crouching = false) {
      if (previewSeq) {
        previewSeq.left -= dt;
        if (previewSeq.left <= 0) {
          const stage = previewSeq.stages[previewSeq.index % previewSeq.stages.length];
          previewSeq.left = startOnce('attack', moves!.chain[stage]).duration + (previewSeq.index % previewSeq.stages.length === previewSeq.stages.length - 1 ? 0.6 : 0);
          previewSeq.index++;
          performing = null; // 展示不套根位移
        }
      }
      if (preview) {
        motion = preview;
        if (preview === 'death' && !active.isRunning()) { active.reset().play(); }
      } else if (performing) {
        motion = performing.kind;
        performing.elapsed += dt;
        if (performing.elapsed >= performing.duration && performing.kind !== 'death') {
          if (performing.kind === 'cast') nextFade = 0.35;
          performing = null;
        }
      }
      if (!preview && !performing) {
        motion = attackTime > 0 ? 'attack' : jumpHeight > 0.02 ? (jumpVelocity > 0 ? 'jump' : 'fall') : crouching && moves ? 'crouch' : moving ? (running ? 'run' : 'walk') : 'idle';
        if (moves && jumpHeight > 0.02) {
          // 起跳瞬間播一次真實跳躍；原地跳略過蹲伏預備，跑跳全段播放
          if (!airborne) setAction(moving ? moves.clips.jumpRun : moves.clips.jumpStand, 1, true, moving ? 0 : moves.jumpStandOffset);
        } else if (jumpHeight > 0.02) setAction(jumpVelocity > 0 ? config.jump : config.fall);
        else if (moves && crouching) setAction(moves.clips.crouch, moving ? config.crouchScale ?? 1 : 0);
        else if (moving) setAction(running ? config.run : config.walk, running ? config.runScale : config.walkScale);
        else setAction(config.idle);
      }
      airborne = jumpHeight > 0.02;
      poseGuard.restore(); // 先還原上一幀的程序疊加，再讓 Mixer 寫入本幀姿勢
      mixer.update(dt);
      // 根位移：只在一次性動作期間把 RootMotion 的變化量套到角色位置（淡出時不套，避免往回拉）
      if (performing && rootMotion && !preview) {
        const now = rootMotion.position.clone().multiplyScalar(model.scale.x);
        if (performing.rootPrev) root.position.add(now.clone().sub(performing.rootPrev).setY(0).applyQuaternion(root.quaternion));
        performing.rootPrev = now;
      }
      poseGuard.remember(chest, upperArm, forearm, hand, thighL, thighR, calfL, calfR, ...fingers);
      if (config.proceduralJump && jumpHeight > 0.02) {
        thighL.rotateX(-0.35);
        thighR.rotateX(-0.5);
        calfL.rotateX(0.65);
        calfR.rotateX(0.8);
      }
      // 揮劍以角色座標定義、換算到各骨頭，不依賴骨架本地軸向（task-006）。
      if (attackTime > 0 && !moves) applySwing(swingPose(1 - attackTime / 0.32), { root, chest, upperArm, forearm, hand });
      // 握劍手指採輕度彎曲，基礎姿態每幀由 Mixer 還原，不累加。
      for (let i = 0; i < fingers.length; i++) fingers[i].rotateX(i % 2 ? 0.7 : 0.6);
      root.updateMatrixWorld(true);
    },
    snapshot() {
      hand.getWorldPosition(handPosition);
      // 解剖正面：左大腿減右大腿再與上方向外積；用來驗證模型正面與移動方向一致。
      thighL.getWorldPosition(leftHip); thighR.getWorldPosition(rightHip);
      forward.subVectors(leftHip, rightHip).cross(THREE.Object3D.DEFAULT_UP).setY(0).normalize();
      return {
        id: config.id, loaded: true, skinnedMeshes, bones: bones.size, triangles,
        animation: motion, clip: active.getClip().name, animationTime: active.time,
        swordAttachedTo: sword.parent?.name ?? '',
        hand: { x: handPosition.x, y: handPosition.y, z: handPosition.z },
        upperArm: upperArm.quaternion.toArray(),
        forward: { x: forward.x, z: forward.z },
        rootYaw: root.rotation.y,
      };
    },
  };
}
