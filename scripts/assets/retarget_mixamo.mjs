// 把 Mixamo 來源動畫重新綁定到不同骨架，烘焙成目標 GLB 內的 Idle / Walk / Run。
// 方法：世界空間旋轉差量 + 骨骼方向對齊（消除 T-pose / A-pose 差異）+ 全域朝向修正。
// 用法：node retarget.mjs <rig> <target.glb|gltf> <out.glb>
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const [rigName, targetPath, outPath, ...clipArgs] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const FPS = 30;
const CLIPS = clipArgs.map((a) => { const [name, file] = a.split('='); return [file, name]; });

// 正規骨骼 → 來源（Mixamo）名稱
const SRC = {
  hips: 'Hips', spine: 'Spine', spine1: 'Spine1', spine2: 'Spine2', neck: 'Neck', head: 'Head',
  ...Object.fromEntries(['L', 'R'].flatMap((s) => {
    const side = s === 'L' ? 'Left' : 'Right';
    return [[`shoulder${s}`, `${side}Shoulder`], [`arm${s}`, `${side}Arm`], [`forearm${s}`, `${side}ForeArm`],
      [`hand${s}`, `${side}Hand`], [`upleg${s}`, `${side}UpLeg`], [`leg${s}`, `${side}Leg`],
      [`foot${s}`, `${side}Foot`], [`toe${s}`, `${side}ToeBase`]];
  })),
};
// 方向對齊用的子骨（正規名稱）
const CHILD = {
  hips: 'spine1', spine: 'spine1', spine1: 'spine2', spine2: 'neck', neck: 'head',
  ...Object.fromEntries(['L', 'R'].flatMap((s) => [[`shoulder${s}`, `arm${s}`], [`arm${s}`, `forearm${s}`],
    [`forearm${s}`, `hand${s}`], [`upleg${s}`, `leg${s}`], [`leg${s}`, `foot${s}`], [`foot${s}`, `toe${s}`]])),
};
const sides = (fn) => Object.fromEntries(['L', 'R'].flatMap((s) => fn(s, s.toLowerCase())));
// 每個目標骨架的對應表（名稱已去除 Sketchfab 加上的 _數字 後綴）
const RIGS = {
  mixamo: { prefix: 'mixamorig:', map: { ...Object.fromEntries(Object.entries(SRC).map(([k, v]) => [k, `mixamorig:${v}`])) } },
  quickrig: { map: { ...Object.fromEntries(Object.entries(SRC).map(([k, v]) => [k, `QuickRigCharacter_${v}`])) } },
  ue5: {
    map: {
      hips: 'pelvis', spine: 'spine_01', spine1: 'spine_03', spine2: 'spine_05', neck: 'neck_01', head: 'head',
      ...sides((S, s) => [[`shoulder${S}`, `clavicle_${s}`], [`arm${S}`, `upperarm_${s}`], [`forearm${S}`, `lowerarm_${s}`],
        [`hand${S}`, `hand_${s}`], [`upleg${S}`, `thigh_${s}`], [`leg${S}`, `calf_${s}`], [`foot${S}`, `foot_${s}`], [`toe${S}`, `ball_${s}`]]),
    },
  },
  cc: {
    map: {
      hips: 'CC_Base_Hip', spine: 'CC_Base_Waist', spine1: 'CC_Base_Spine01', spine2: 'CC_Base_Spine02', neck: 'CC_Base_NeckTwist01', head: 'CC_Base_Head',
      ...sides((S) => [[`shoulder${S}`, `CC_Base_${S}_Clavicle`], [`arm${S}`, `CC_Base_${S}_Upperarm`], [`forearm${S}`, `CC_Base_${S}_Forearm`],
        [`hand${S}`, `CC_Base_${S}_Hand`], [`upleg${S}`, `CC_Base_${S}_Thigh`], [`leg${S}`, `CC_Base_${S}_Calf`], [`foot${S}`, `CC_Base_${S}_Foot`], [`toe${S}`, `CC_Base_${S}_ToeBase`]]),
    },
  },
  wushi: {
    map: {
      hips: 'HIP', spine: 'spine', spine2: 'chest', neck: 'neck', head: 'head',
      ...sides((S) => [[`shoulder${S}`, `${S}_shoulder`], [`arm${S}`, `${S}_arm`], [`forearm${S}`, `${S}_forarm`],
        [`hand${S}`, `${S}_hand`], [`upleg${S}`, `${S}_leg`], [`leg${S}`, `${S}_knee`], [`foot${S}`, `${S}_ankle`], [`toe${S}`, `${S}_foot`]]),
    },
  },
  // A4：Blender IK 骨架。手掌掛在 IK 控制骨下、腳趾掛在根骨下，匯出後不再受 IK 帶動，需要「跟隨」規則。
  blenderik: {
    map: {
      hips: 'spine0', spine1: 'coreIK', spine2: 'spine 3', neck: 'spine 4', head: 'head',
      ...sides((S) => [[`shoulder${S}`, `clavicle.${S}`], [`arm${S}`, `upperarm.${S}`], [`forearm${S}`, `arm.${S}`],
        [`hand${S}`, `handIK.${S}`], [`upleg${S}`, `leg.${S}`], [`leg${S}`, `leg2.${S}`], [`foot${S}`, `foot.${S}`], [`toe${S}`, `toe.${S}`]]),
    },
    // follow: 目標骨 → 跟隨的骨；position 只跟位置（旋轉仍來自動畫），rigid 整個剛性跟隨
    follow: { ...sides((S) => [[`handIK.${S}`, { to: `arm.${S}`, mode: 'position' }], [`toe.${S}`, { to: `foot.${S}`, mode: 'rigid' }]]) },
  },
};
const rig = RIGS[rigName];
if (!rig) throw new Error(`未知骨架 ${rigName}`);

const strip = (name) => name.replace(/_\d+$/, '');

// ---------- 場景樹工具 ----------
function sceneGraph(doc) {
  const parent = new Map();
  for (const n of doc.getRoot().listNodes()) for (const c of n.listChildren()) parent.set(c, n);
  const order = [];
  const visit = (n) => { order.push(n); for (const c of n.listChildren()) visit(c); };
  for (const s of doc.getRoot().listScenes()) for (const n of s.listChildren()) visit(n);
  return { parent, order };
}
const restLocal = (n) => ({
  t: new THREE.Vector3().fromArray(n.getTranslation()),
  r: new THREE.Quaternion().fromArray(n.getRotation()),
  s: new THREE.Vector3().fromArray(n.getScale()),
});
const compose = ({ t, r, s }) => new THREE.Matrix4().compose(t, r, s);
function worldRest(graph) {
  const world = new Map();
  for (const n of graph.order) {
    const local = compose(restLocal(n));
    const p = graph.parent.get(n);
    world.set(n, p ? world.get(p).clone().multiply(local) : local);
  }
  return world;
}
const decompose = (m) => { const t = new THREE.Vector3(), r = new THREE.Quaternion(), s = new THREE.Vector3(); m.decompose(t, r, s); return { t, r, s }; };

// ---------- 來源動畫取樣 ----------
function sampler(s) {
  const input = s.getInput().getArray(), out = s.getOutput().getArray(), n = s.getOutput().getElementSize();
  const interp = s.getInterpolation();
  return (time) => {
    let i = 0;
    while (i < input.length - 2 && input[i + 1] <= time) i++;
    const a = input[i], b = input[Math.min(i + 1, input.length - 1)];
    const k = interp === 'STEP' || b === a ? 0 : THREE.MathUtils.clamp((time - a) / (b - a), 0, 1);
    const va = out.slice(i * n, i * n + n), vb = out.slice(Math.min(i + 1, input.length - 1) * n, Math.min(i + 1, input.length - 1) * n + n);
    if (n === 4) return new THREE.Quaternion().fromArray(va).slerp(new THREE.Quaternion().fromArray(vb), k);
    return new THREE.Vector3().fromArray(va).lerp(new THREE.Vector3().fromArray(vb), k);
  };
}

// 來源：Mixamo FBX（Without Skin，X Bot 骨架，T-pose rest，Y-up，正面 +Z，公分）
const loadFbx = (file) => { const b = readFileSync(file); return new FBXLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), ''); };
const srcBone = (obj, canon) => { let found; obj.traverse((o) => { if (o.name === 'mixamorig' + SRC[canon]) found = o; }); return found; };
const restObj = loadFbx(CLIPS[0][0]); restObj.updateMatrixWorld(true);
// srcRest / srcPose 以正規名稱為鍵（Map<canon, Matrix4>），下方以 srcNode(canon)=canon 取用
const worldOf = (obj) => new Map(Object.keys(SRC).map((c) => [c, srcBone(obj, c).matrixWorld.clone()]));
const srcRest = worldOf(restObj);
const srcNode = (canon) => canon;
const sources = new Map();
function srcPose(file, time) {
  if (!sources.has(file)) { const obj = loadFbx(file); const mixer = new THREE.AnimationMixer(obj); mixer.clipAction(obj.animations[0]).play(); sources.set(file, { obj, mixer, clip: obj.animations[0] }); }
  // 取樣終點時夾在片尾前一點：循環模式在 t = duration 會繞回第 0 格，造成一次性動作最後一格跳回起始姿勢
  const { obj, mixer, clip } = sources.get(file); mixer.setTime(Math.min(time, clip.duration - 1e-4)); obj.updateMatrixWorld(true); return worldOf(obj);
}
const duration = (file) => { srcPose(file, 0); return sources.get(file).clip.duration; };

// ---------- 目標 ----------
const doc = await io.read(targetPath);
const graph = sceneGraph(doc);
const rest = worldRest(graph);
const skinJoints = new Set(doc.getRoot().listSkins().flatMap((s) => s.listJoints()));
const byName = new Map();
for (const n of doc.getRoot().listNodes()) if (skinJoints.has(n)) byName.set(strip(n.getName()), n);
const tgt = {};
for (const [canon, name] of Object.entries(rig.map)) {
  const n = byName.get(name);
  if (!n) throw new Error(`目標骨架缺少 ${name}（${canon}）`);
  tgt[canon] = n;
}
const follow = new Map(Object.entries(rig.follow ?? {}).map(([k, v]) => [byName.get(k), { to: byName.get(v.to), mode: v.mode }]));

const pos = (world, n) => new THREE.Vector3().setFromMatrixPosition(world.get(n));
const rot = (world, n) => decompose(world.get(n)).r;
const up = new THREE.Vector3(0, 1, 0);
function facing(world, node) {
  // 以大腿根部判斷左右（持武器的預設姿勢常讓手臂不對稱，大腿較可靠）
  const across = pos(world, node('uplegL')).sub(pos(world, node('uplegR')));
  const f = across.cross(up).setY(0).normalize();
  return f;
}
const fSrc = facing(srcRest, srcNode);
const fTgt = facing(rest, (c) => tgt[c]);
const yawTo = (from, to) => new THREE.Quaternion().setFromUnitVectors(from, to);
const Ry = yawTo(fSrc, fTgt), RyInv = Ry.clone().invert();

// 每根對應骨的參考姿態：先把目標骨方向轉到來源 rest 的方向
const ref = new Map();
for (const [canon, n] of Object.entries(tgt)) {
  let align = new THREE.Quaternion();
  const child = CHILD[canon];
  if (child && tgt[child] && srcNode(child) && srcNode(canon)) {
    const dT = pos(rest, tgt[child]).sub(pos(rest, n)).normalize();
    const dS = pos(srcRest, srcNode(child)).sub(pos(srcRest, srcNode(canon))).normalize().applyQuaternion(Ry);
    if (dT.lengthSq() > 0 && dS.lengthSq() > 0) align = new THREE.Quaternion().setFromUnitVectors(dT, dS);
  }
  ref.set(n, align.multiply(rot(rest, n)));
}
const canonOf = new Map(Object.entries(tgt).map(([c, n]) => [n, c]));

// 髖部高度比例（用於上下起伏）
const hipH = (world, hips, foot) => pos(world, hips).y - pos(world, foot).y;
const heightRatio = hipH(rest, tgt.hips, tgt.footL) / hipH(srcRest, srcNode('hips'), srcNode('footL'));

// 跟隨骨與其子孫延後處理，確保被跟隨的骨已算好
const deferred = new Set();
for (const n of follow.keys()) { const mark = (x) => { deferred.add(x); x.listChildren().forEach(mark); }; mark(n); }
const order = [...graph.order.filter((n) => !deferred.has(n)), ...graph.order.filter((n) => deferred.has(n))];

for (const a of doc.getRoot().listAnimations()) a.dispose(); // 移除原本的展示動畫
// 根位移：攻擊、施法、受擊、倒地保留水平位移，存到獨立節點 RootMotion（角色座標，+Z 為前），骨盆仍原地。
const ROOT_MOTION = /^(Slash|Combo|Cast|Hit|Death)/;
const rootMotionNode = doc.createNode('RootMotion');
for (const sc of doc.getRoot().listScenes()) sc.addChild(rootMotionNode);
const toCharacter = new THREE.Quaternion().setFromUnitVectors(fTgt, new THREE.Vector3(0, 0, 1));
const buffer = doc.getRoot().listBuffers()[0];

for (const [srcClip, outName] of CLIPS) {
  const dur = duration(srcClip);
  const frames = Math.max(2, Math.round(dur * FPS) + 1);
  const times = new Float32Array(frames);
  const tracks = new Map(); // node -> {r:[], t:[]}
  const srcHipRest = pos(srcRest, srcNode('hips'));
  const rootTrack = [];
  for (let f = 0; f < frames; f++) {
    const time = (f / (frames - 1)) * dur;
    times[f] = time;
    const sw = srcPose(srcClip, time);
    if (ROOT_MOTION.test(outName)) {
      const d = pos(sw, srcNode('hips')).sub(srcHipRest).setY(0).applyQuaternion(Ry).multiplyScalar(heightRatio).applyQuaternion(toCharacter);
      rootTrack.push(d.x, 0, d.z);
    }
    const world = new Map();
    for (const n of order) {
      const p = graph.parent.get(n);
      const parentWorld = p ? world.get(p) : new THREE.Matrix4();
      const localRest = restLocal(n);
      let m = parentWorld.clone().multiply(compose(localRest));
      const canon = canonOf.get(n);
      const fol = follow.get(n);
      if (canon || fol) {
        let { t, r, s } = decompose(m);
        if (canon) {
          const sn = srcNode(canon);
          const delta = rot(sw, sn).multiply(rot(srcRest, sn).invert());
          r = Ry.clone().multiply(delta).multiply(RyInv).multiply(ref.get(n));
        }
        if (canon === 'hips') {
          const dy = (pos(sw, srcNode('hips')).y - srcHipRest.y) * heightRatio;
          t = pos(rest, n).add(new THREE.Vector3(0, dy, 0));
        }
        if (fol) {
          const rel = rest.get(fol.to).clone().invert().multiply(rest.get(n));
          const followed = decompose(world.get(fol.to).clone().multiply(rel));
          t = followed.t;
          if (fol.mode === 'rigid') r = followed.r;
        }
        m = new THREE.Matrix4().compose(t, r, s);
        const local = decompose(parentWorld.clone().invert().multiply(m));
        if (!tracks.has(n)) tracks.set(n, { r: [], t: [] });
        tracks.get(n).r.push(...local.r.normalize().toArray());
        tracks.get(n).t.push(...local.t.toArray());
      }
      world.set(n, m);
    }
  }
  const anim = doc.createAnimation(outName);
  const input = doc.createAccessor().setType('SCALAR').setArray(times).setBuffer(buffer);
  for (const [n, tr] of tracks) {
    const addChannel = (path, arr, type) => {
      const s = doc.createAnimationSampler().setInput(input).setInterpolation('LINEAR')
        .setOutput(doc.createAccessor().setType(type).setArray(new Float32Array(arr)).setBuffer(buffer));
      anim.addSampler(s).addChannel(doc.createAnimationChannel().setTargetNode(n).setTargetPath(path).setSampler(s));
    };
    addChannel('rotation', tr.r, 'VEC4');
    if (canonOf.get(n) === 'hips' || follow.has(n)) addChannel('translation', tr.t, 'VEC3');
  }
  if (rootTrack.length) {
    const s2 = doc.createAnimationSampler().setInput(input).setInterpolation('LINEAR')
      .setOutput(doc.createAccessor().setType('VEC3').setArray(new Float32Array(rootTrack)).setBuffer(buffer));
    anim.addSampler(s2).addChannel(doc.createAnimationChannel().setTargetNode(rootMotionNode).setTargetPath('translation').setSampler(s2));
  }
}

// 全域朝向：讓角色正面朝 +Z（遊戲用 atan2(vx, vz) 轉向）
const toPlusZ = yawTo(fTgt, new THREE.Vector3(0, 0, 1));
for (const s of doc.getRoot().listScenes()) for (const n of s.listChildren()) { if (n === rootMotionNode) continue;
  n.setRotation(toPlusZ.clone().multiply(new THREE.Quaternion().fromArray(n.getRotation())).toArray());
  n.setTranslation(new THREE.Vector3().fromArray(n.getTranslation()).applyQuaternion(toPlusZ).toArray());
}

await io.write(outPath, doc);
const deg = (q) => (2 * Math.acos(Math.min(1, Math.abs(q.w))) * 180 / Math.PI).toFixed(0);
console.log(JSON.stringify({ rig: rigName, mapped: Object.keys(tgt).length, follow: follow.size,
  facingBefore: fTgt.toArray().map((v) => +v.toFixed(2)), yawFix: deg(toPlusZ) + '°', heightRatio: +heightRatio.toFixed(3),
  clips: CLIPS.map(([, o]) => o) }));
