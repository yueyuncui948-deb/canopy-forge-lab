import * as THREE from 'three';
import { createSword } from './sword';
import { findCharacter, type Character } from './catalog';
import { applySwing, createPoseGuard, swingPose } from './swing';

export type HeroMotion = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'attack';

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
  for (const name of [config.idle, config.walk, config.run, config.jump, config.fall]) if (!actions.has(name)) throw new Error(`人物缺少 ${name} 動畫`);
  let active = actions.get(config.idle)!;
  active.play();
  mixer.update(0);
  root.updateMatrixWorld(true);
  const sword = createSword();
  sword.position.set(0, config.grip, 0);
  // 武器用世界尺寸，避免公分制骨架把劍放大百倍。
  sword.scale.setScalar(1 / hand.getWorldScale(new THREE.Vector3()).x);
  const worldGrip = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.55, 0.85).normalize());
  sword.quaternion.copy(hand.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldGrip));
  hand.add(sword);
  const handPosition = new THREE.Vector3();
  const thighL = bone(config.legs.thighL), thighR = bone(config.legs.thighR);
  const calfL = bone(config.legs.calfL), calfR = bone(config.legs.calfR);
  const leftHip = new THREE.Vector3(), rightHip = new THREE.Vector3(), forward = new THREE.Vector3();
  let motion: HeroMotion = 'idle';
  const poseGuard = createPoseGuard();
  const fingers = config.id === 'sophia' ? ['index', 'middle', 'ring', 'pinky'].flatMap(d => [bone(`DEF-f_${d}.01.R`), bone(`DEF-f_${d}.02.R`)]) : [];

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
    update(dt: number, moving: boolean, running: boolean, jumpHeight: number, jumpVelocity: number, attackTime: number) {
      motion = attackTime > 0 ? 'attack' : jumpHeight > 0.02 ? (jumpVelocity > 0 ? 'jump' : 'fall') : moving ? (running ? 'run' : 'walk') : 'idle';
      if (jumpHeight > 0.02) setAction(jumpVelocity > 0 ? config.jump : config.fall);
      else if (moving) setAction(running ? config.run : config.walk, running ? config.runScale : config.walkScale);
      else setAction(config.idle);
      poseGuard.restore(); // 先還原上一幀的程序疊加，再讓 Mixer 寫入本幀姿勢
      mixer.update(dt);
      poseGuard.remember(chest, upperArm, forearm, hand, thighL, thighR, calfL, calfR, ...fingers);
      if (config.proceduralJump && jumpHeight > 0.02) {
        thighL.rotateX(-0.35);
        thighR.rotateX(-0.5);
        calfL.rotateX(0.65);
        calfR.rotateX(0.8);
      }
      // 揮劍以角色座標定義、換算到各骨頭，不依賴骨架本地軸向（task-006）。
      if (attackTime > 0) applySwing(swingPose(1 - attackTime / 0.32), { root, chest, upperArm, forearm, hand });
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
