import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
const out = [];
for (const f of process.argv.slice(2)) {
  const buf = readFileSync(f);
  const obj = new FBXLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '');
  const clip = obj.animations[0];
  const hips = clip.tracks.find(t => /Hips\.position$/.test(t.name));
  let travel = 0, rise = 0;
  if (hips) { const v = hips.values, n = v.length / 3; travel = Math.hypot(v[(n-1)*3]-v[0], v[(n-1)*3+2]-v[2]); let ys=[]; for (let i=0;i<n;i++) ys.push(v[i*3+1]); rise = Math.max(...ys)-ys[0]; }
  out.push({ file: f.split('/').pop(), dur: +clip.duration.toFixed(3), frames: Math.round(clip.duration * 30) + 1, tracks: clip.tracks.length, travelCm: +travel.toFixed(1), riseCm: +rise.toFixed(1) });
}
console.log(out.map(o => JSON.stringify(o)).join('\n'));
