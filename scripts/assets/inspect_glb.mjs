// 列出 GLB 的骨架、動畫、網格、貼圖與根節點變換
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const file = process.argv[2];
const doc = await io.read(file);
const root = doc.getRoot();

const chain = (node) => {
  const out = [];
  for (let n = node; n; n = n.getParentNode?.() ?? null) out.unshift(n);
  return out;
};
// gltf-transform 沒有 parent 指標，自己建
const parent = new Map();
for (const n of root.listNodes()) for (const c of n.listChildren()) parent.set(c, n);
const path = (n) => { const p = []; for (let x = n; x; x = parent.get(x)) p.unshift(x.getName() || '?'); return p; };

console.log('== scenes');
for (const s of root.listScenes()) {
  const walk = (n, d) => {
    if (d > 4) return;
    const t = n.getTranslation(), r = n.getRotation(), sc = n.getScale();
    const fmt = (a) => a.map((v) => +v.toFixed(3)).join(',');
    console.log(`${'  '.repeat(d)}${n.getName()} T[${fmt(t)}] R[${fmt(r)}] S[${fmt(sc)}]${n.getMesh() ? ' mesh' : ''}${n.getSkin() ? ' skin' : ''}`);
    for (const c of n.listChildren()) walk(c, d + 1);
  };
  for (const n of s.listChildren()) walk(n, 0);
}

console.log('== skins');
for (const skin of root.listSkins()) {
  const j = skin.listJoints();
  console.log(`joints=${j.length} rootPath=${path(j[0]).join('/')}`);
  console.log(j.map((x) => x.getName()).join(' | '));
}

console.log('== animations');
for (const a of root.listAnimations()) {
  let max = 0;
  for (const s of a.listSamplers()) { const arr = s.getInput().getArray(); max = Math.max(max, arr[arr.length - 1]); }
  console.log(`${a.getName()} channels=${a.listChannels().length} dur=${max.toFixed(2)}s`);
}

console.log('== meshes');
let tris = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const idx = p.getIndices();
  tris += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3;
}
console.log(`meshes=${root.listMeshes().length} prims=${root.listMeshes().reduce((s, m) => s + m.listPrimitives().length, 0)} tris=${Math.round(tris)} materials=${root.listMaterials().length}`);

console.log('== textures');
for (const t of root.listTextures()) {
  const size = t.getSize();
  console.log(`${t.getName() || t.getURI()} ${t.getMimeType()} ${size?.join('x')} ${Math.round(t.getImage().byteLength / 1024)}KB`);
}
