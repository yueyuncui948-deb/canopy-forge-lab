// 在 Node 以與遊戲相同的 GLTFLoader 解析人物 GLB（幾何、骨架、動畫、名稱清理規則一致），
// 但先移除貼圖與影像，因 Node 沒有影像解碼；只檢查資料與動作，不做渲染。
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

type Json = Record<string, unknown>;

function stripImages(glb: Buffer): ArrayBuffer {
  const jsonLength = glb.readUInt32LE(12);
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8')) as Json;
  const binChunk = glb.subarray(20 + jsonLength);
  delete json.images; delete json.textures; delete json.samplers;
  json.materials = ((json.materials as Json[] | undefined) ?? []).map(material => ({ name: material.name }));
  const keep = (list: unknown) => (list as string[] | undefined)?.filter(name => !/texture|KHR_materials/.test(name));
  json.extensionsUsed = keep(json.extensionsUsed);
  json.extensionsRequired = keep(json.extensionsRequired);
  let text = Buffer.from(JSON.stringify(json), 'utf8');
  if (text.length % 4) text = Buffer.concat([text, Buffer.alloc(4 - (text.length % 4), 0x20)]);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4);
  header.writeUInt32LE(20 + text.length + binChunk.length, 8);
  header.writeUInt32LE(text.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
  const out = Buffer.concat([header, text, binChunk]);
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}

export async function loadCharacterGlb(path: string): Promise<GLTF> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  return loader.parseAsync(stripImages(readFileSync(path)), '');
}

/** 依 hero.ts 規則把模型縮放到 2.35 單位高。 */
export function normalizeHeight(model: THREE.Object3D): number {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const scale = 2.35 / bounds.getSize(new THREE.Vector3()).y;
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);
  return scale;
}

export function boneMap(model: THREE.Object3D): Map<string, THREE.Bone> {
  const bones = new Map<string, THREE.Bone>();
  model.traverse(object => { if (object instanceof THREE.Bone) bones.set(object.name, object); });
  return bones;
}

export const sanitize = (name: string) => THREE.PropertyBinding.sanitizeNodeName(name);

/** 解剖正面：左大腿 − 右大腿，與上方向外積，取水平分量。 */
export function anatomicalForward(thighL: THREE.Object3D, thighR: THREE.Object3D) {
  const l = thighL.getWorldPosition(new THREE.Vector3()), r = thighR.getWorldPosition(new THREE.Vector3());
  return l.sub(r).cross(new THREE.Vector3(0, 1, 0)).setY(0).normalize();
}

/** 著地腳（最低 15% 高度時）在模型空間的平均 Z 速度與步態資訊。 */
export function footContact(model: THREE.Object3D, clip: THREE.AnimationClip, foot: THREE.Object3D, samples = 90) {
  const mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(clip).play();
  const dt = clip.duration / samples;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    mixer.setTime(i * dt); model.updateMatrixWorld(true);
    points.push(foot.getWorldPosition(new THREE.Vector3()));
  }
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  const ys = points.map(p => p.y), minY = Math.min(...ys), maxY = Math.max(...ys);
  let vz = 0, n = 0;
  for (let i = 1; i < points.length; i++) if (points[i].y < minY + (maxY - minY) * 0.15) { vz += (points[i].z - points[i - 1].z) / dt; n++; }
  return { contactVz: vz / Math.max(n, 1), lift: maxY - minY };
}

export function footOf(calf: THREE.Object3D): THREE.Object3D {
  const bones = calf.children.filter(child => child instanceof THREE.Bone);
  return bones.find(child => /foot|ankle/i.test(child.name)) ?? bones[0];
}
