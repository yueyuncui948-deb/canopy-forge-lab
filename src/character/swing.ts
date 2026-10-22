import * as THREE from 'three';

// 程序揮劍：在「角色座標」（+Z 前、+Y 上、+X 為角色左側）定義動作，再換算到各骨頭。
// 不依賴骨頭本地軸向，因此 Rocketbox、Mixamo、UE5、CC 等不同骨架揮出的方向一致。
// 這是正式攻擊動畫到位前的暫代方案。

export interface SwingPose {
  /** 上臂繞角色左右軸：負值為向前上舉（-π/2 前平舉，約 -2.4 過頭）。 */
  armPitch: number;
  /** 上臂繞上方向：負值偏右側，正值掃向左前方。 */
  armYaw: number;
  /** 前臂相對上臂的屈肘（繞角色左右軸）。 */
  elbow: number;
  /** 胸椎扭轉：負值右肩後拉蓄力，正值隨劈砍轉向左。 */
  chestYaw: number;
  /** 手腕繞角色左右軸：正值讓刀尖往前下方壓（劈砍），負值往後倒（蓄力）。 */
  wrist: number;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const REST: SwingPose = { armPitch: 0, armYaw: 0, elbow: 0, chestYaw: 0, wrist: 0 };
const WINDUP: SwingPose = { armPitch: -2.5, armYaw: -0.45, elbow: -1.0, chestYaw: -0.35, wrist: -0.3 };
const STRIKE: SwingPose = { armPitch: -0.55, armYaw: 0.75, elbow: -0.1, chestYaw: 0.4, wrist: 1.0 };

const mix = (a: SwingPose, b: SwingPose, t: number): SwingPose => ({
  armPitch: lerp(a.armPitch, b.armPitch, t), armYaw: lerp(a.armYaw, b.armYaw, t),
  elbow: lerp(a.elbow, b.elbow, t), chestYaw: lerp(a.chestYaw, b.chestYaw, t), wrist: lerp(a.wrist, b.wrist, t),
});

/** phase 0→1：舉刀蓄力（0–0.35）→ 斜劈（0.35–0.65）→ 收刀（0.65–1）。 */
export function swingPose(phase: number): SwingPose {
  const p = THREE.MathUtils.clamp(phase, 0, 1);
  if (p < 0.35) return mix(REST, WINDUP, smooth(p / 0.35));
  if (p < 0.65) return mix(WINDUP, STRIKE, smooth((p - 0.35) / 0.3));
  return mix(STRIKE, REST, smooth((p - 0.65) / 0.35));
}

const tmpQ = new THREE.Quaternion(), parentQ = new THREE.Quaternion(), worldQ = new THREE.Quaternion();
const axisWorld = new THREE.Vector3();

/** 讓骨頭在世界空間繞「角色座標軸」旋轉 angle，換算回本地旋轉。 */
export function rotateInCharacterSpace(bone: THREE.Object3D, root: THREE.Object3D, axis: THREE.Vector3, angle: number) {
  if (!angle) return;
  axisWorld.copy(axis).applyQuaternion(root.getWorldQuaternion(tmpQ)).normalize();
  const delta = new THREE.Quaternion().setFromAxisAngle(axisWorld, angle);
  bone.getWorldQuaternion(worldQ);
  bone.parent!.getWorldQuaternion(parentQ);
  bone.quaternion.copy(parentQ.invert().multiply(delta.multiply(worldQ)));
  bone.updateMatrixWorld(true);
}

/**
 * 程序疊加姿勢的還原器。AnimationMixer 在數值未變時不會重寫骨頭，
 * 若不還原，上一幀疊加的旋轉會累加，手臂越轉越歪。
 */
export function createPoseGuard() {
  const saved = new Map<THREE.Object3D, { q: THREE.Quaternion; p: THREE.Vector3 }>();
  return {
    remember(...bones: THREE.Object3D[]) {
      for (const bone of bones) if (!saved.has(bone)) saved.set(bone, { q: bone.quaternion.clone(), p: bone.position.clone() });
    },
    restore() {
      for (const [bone, pose] of saved) { bone.quaternion.copy(pose.q); bone.position.copy(pose.p); }
      saved.clear();
    },
  };
}

export const AXIS_SIDE = new THREE.Vector3(1, 0, 0);
export const AXIS_UP = new THREE.Vector3(0, 1, 0);

/**
 * 套用揮劍姿勢。hand 若不在前臂子樹下（例如 IK 骨架匯出），以前臂的世界變化量帶動手掌。
 */
export function applySwing(pose: SwingPose, bones: { root: THREE.Object3D; chest: THREE.Object3D; upperArm: THREE.Object3D; forearm: THREE.Object3D; hand: THREE.Object3D }) {
  const { root, chest, upperArm, forearm, hand } = bones;
  root.updateMatrixWorld(true);
  let handDetached = true;
  for (let node: THREE.Object3D | null = hand.parent; node; node = node.parent) if (node === forearm) { handDetached = false; break; }
  const forearmBefore = forearm.matrixWorld.clone();
  rotateInCharacterSpace(chest, root, AXIS_UP, pose.chestYaw);
  // 先上舉、再水平掃：垂下的手臂繞垂直軸轉不會產生橫向位移。
  rotateInCharacterSpace(upperArm, root, AXIS_SIDE, pose.armPitch);
  rotateInCharacterSpace(upperArm, root, AXIS_UP, pose.armYaw);
  rotateInCharacterSpace(forearm, root, AXIS_SIDE, pose.elbow);
  if (handDetached) {
    const change = forearm.matrixWorld.clone().multiply(forearmBefore.invert());
    const handWorld = change.multiply(hand.matrixWorld);
    const local = hand.parent!.matrixWorld.clone().invert().multiply(handWorld);
    local.decompose(hand.position, hand.quaternion, new THREE.Vector3());
    hand.updateMatrixWorld(true);
  }
  rotateInCharacterSpace(hand, root, AXIS_SIDE, pose.wrist);
}
