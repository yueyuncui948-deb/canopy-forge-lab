// 道具整理 + 網頁最佳化：未綁骨架的盔甲件掛到骨頭上、移除散落武器與底座，再壓縮貼圖與幾何。
// 用法：node process.mjs <id> <in.glb> <out.glb>
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, resample, textureCompress, meshopt, weld } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import * as THREE from 'three';

const PLAN = {
  A1: { attach: { 'L Hand Armor': 'hand_l', 'Body_Armor': 'spine_04', 'Pants': 'pelvis', 'Dagger': 'spine_01',
    'Heavy Sword': 'spine_05', 'Shield': 'spine_05', 'Sword': 'pelvis', 'Scabbared': 'pelvis' } },
  A2: {},
  A3: { removeMesh: ['Object_7'] },               // 立在地上的巨劍（獨立 2 骨架）
  A4: { remove: ['sword'] },                      // 腰前垂掛、會穿過雙腿的長劍
  B1: { remove: ['katana'] },                     // 浮在左側、未綁定的武士刀
  B2: { remove: ['pCylinder21', 'pCylinder21_2', 'plane'] }, // 兩把刀與展示底座
};
const [id, input, output] = process.argv.slice(2);
const plan = PLAN[id];
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(input);
const root = doc.getRoot();
const strip = (s) => s.replace(/_\d+$/, '');
const byStripped = (name) => root.listNodes().find((n) => n.getName() === name) ?? root.listNodes().find((n) => strip(n.getName()) === name);
const parent = new Map(); for (const n of root.listNodes()) for (const c of n.listChildren()) parent.set(c, n);
const log = [];

for (const [nodeName, boneName] of Object.entries(plan.attach ?? {})) {
  const node = byStripped(nodeName), bone = byStripped(boneName);
  if (!node || !bone) throw new Error(`找不到 ${nodeName} 或 ${boneName}`);
  const world = new THREE.Matrix4().fromArray(node.getWorldMatrix());
  const boneWorld = new THREE.Matrix4().fromArray(bone.getWorldMatrix());
  const local = boneWorld.invert().multiply(world);
  const t = new THREE.Vector3(), r = new THREE.Quaternion(), s = new THREE.Vector3();
  local.decompose(t, r, s);
  (parent.get(node) ?? root.listScenes()[0]).removeChild(node);
  for (const sc of root.listScenes()) sc.removeChild(node);
  bone.addChild(node.setTranslation(t.toArray()).setRotation(r.toArray()).setScale(s.toArray()));
  log.push(`掛載 ${nodeName} → ${boneName}`);
}
for (const name of plan.remove ?? []) {
  const node = byStripped(name); if (!node) throw new Error(`找不到 ${name}`);
  node.traverse((n) => { n.getMesh()?.dispose(); });
  node.dispose(); log.push(`移除 ${name}`);
}
for (const name of plan.removeMesh ?? []) {
  const node = byStripped(name); if (!node) throw new Error(`找不到 ${name}`);
  node.getMesh()?.dispose(); node.setSkin(null); node.dispose(); log.push(`移除 ${name}`);
}

await doc.transform(
  prune({ keepLeaves: true, keepExtras: true }),
  dedup(),
  resample(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048], quality: 82 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(output, doc);
let tris = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) tris += (p.getIndices()?.getCount() ?? 0) / 3;
console.log(JSON.stringify({ id, log, tris, textures: root.listTextures().length }));
