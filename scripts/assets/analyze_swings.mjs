import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
for (const f of process.argv.slice(2)) {
  const buf = readFileSync(f);
  const obj = new FBXLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '');
  const clip = obj.animations[0];
  const mixer = new THREE.AnimationMixer(obj); mixer.clipAction(clip).play();
  let hand, hips; obj.traverse(o => { if (/RightHand$/.test(o.name)) hand = o; if (/Hips$/.test(o.name)) hips = o; });
  const fps = 30, n = Math.round(clip.duration * fps); const sp = []; let prev = null;
  for (let i = 0; i <= n; i++) { mixer.setTime(i / fps); obj.updateMatrixWorld(true); const p = hand.getWorldPosition(new THREE.Vector3()).sub(hips.getWorldPosition(new THREE.Vector3())); if (prev) sp.push(p.distanceTo(prev) * fps / 100); prev = p; }
  const sorted=[...sp].sort((a,b)=>a-b); const max = sorted[Math.floor(sorted.length*0.97)]; const peaks = [];
  for (let i = 2; i < sp.length - 2; i++) if (sp[i] > 0.45 * max && sp[i] < 4 * max && sp[i] >= sp[i-1] && sp[i] >= sp[i+1] && sp[i] >= sp[i-2] && sp[i] >= sp[i+2]) { if (!peaks.length || i - peaks.at(-1) > 8) peaks.push(i); else if (sp[i] > sp[peaks.at(-1)]) peaks[peaks.length-1] = i; }
  console.log(f.split('/').pop().padEnd(28), 'dur', clip.duration.toFixed(2), 'maxSpeed', max.toFixed(1), 'm/s', 'swings', peaks.length, 'at', peaks.map(i => (i / fps).toFixed(2) + 's').join(' '));
}
