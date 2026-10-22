// 人物資產資料檢查：不開瀏覽器、不渲染，數秒內涵蓋全部角色。
// 取代逐角色在 SwiftShader 中實際走路的瀏覽器測試（每位 2–4 分鐘）。
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { characters } from '../../src/character/catalog.ts';
import { anatomicalForward, boneMap, footContact, footOf, loadCharacterGlb, normalizeHeight, sanitize } from './support/load-glb.ts';

const pub = (path: string) => new URL(`../../public/${path}`, import.meta.url).pathname;
const MAX_MODEL_BYTES = 15 * 1024 * 1024; // MASTER_PLAN 首次傳輸 < 25 MB，單一人物取 15 MB 上限
const assetCatalog = JSON.parse(readFileSync(new URL('../../docs/asset-catalog/catalog.json', import.meta.url), 'utf8')) as {
  assets: { id: string; status: string; source: { author: string }; license: { name: string }; outputs?: { path: string; sha256: string }[] }[];
};

test('人物 id 唯一，每位都有模型、來源聲明且模型不超過 15 MB', () => {
  assert.equal(new Set(characters.map(c => c.id)).size, characters.length);
  for (const c of characters) {
    assert.ok(existsSync(pub(c.file)), `${c.id} 缺模型 ${c.file}`);
    assert.ok(existsSync(pub(c.notice)), `${c.id} 缺來源聲明 ${c.notice}`);
    assert.ok(statSync(pub(c.file)).size <= MAX_MODEL_BYTES, `${c.id} 模型 ${statSync(pub(c.file)).size} bytes 超過上限`);
  }
});

test('Sketchfab 人物在素材總表有紀錄，遊戲用檔雜湊與總表一致，聲明含作者與授權', () => {
  for (const c of characters.filter(c => c.file.startsWith('models/sketchfab/'))) {
    const entry = assetCatalog.assets.find(a => a.id === c.id.toUpperCase());
    assert.ok(entry, `${c.id} 未登記於 docs/asset-catalog/catalog.json`);
    assert.ok(['tested', 'adopted'].includes(entry.status), `${c.id} 狀態為 ${entry.status}`);
    const output = entry.outputs?.find(o => o.path === `public/${c.file}`);
    assert.ok(output, `${c.id} 總表缺遊戲用檔紀錄`);
    const sha = createHash('sha256').update(readFileSync(pub(c.file))).digest('hex');
    assert.equal(sha, output.sha256, `${c.id} 模型已變更但素材總表未更新`);
    const notice = readFileSync(pub(c.notice), 'utf8');
    assert.ok(notice.includes(entry.source.author.split(' ')[0]) && notice.includes(entry.license.name), `${c.id} NOTICE 缺作者或授權`);
  }
});

for (const c of characters) {
  test(`${c.id}：骨頭與動畫齊全、正面朝 +Z、走跑時腳步向前`, async () => {
    const gltf = await loadCharacterGlb(pub(c.file));
    const model = gltf.scene;
    normalizeHeight(model);
    const bones = boneMap(model);
    for (const name of [c.hand, c.arm, c.forearm, c.chest, ...Object.values(c.legs)]) {
      assert.ok(bones.has(sanitize(name)), `${c.id} 缺骨頭 ${name}（hero.ts 會在載入時丟錯）`);
    }
    const clips = new Map(gltf.animations.map(clip => [clip.name, clip]));
    for (const name of [c.idle, c.walk, c.run, c.jump, c.fall, ...Object.values(c.moves?.clips ?? {})]) assert.ok(clips.has(name), `${c.id} 缺動畫 ${name}`);

    const bone = (name: string) => bones.get(sanitize(name))!;
    const forward = anatomicalForward(bone(c.legs.thighL), bone(c.legs.thighR));
    assert.ok(forward.z > Math.cos(Math.PI / 12), `${c.id} 靜止正面偏離 +Z：${forward.toArray().map(v => v.toFixed(2))}`);

    for (const clipName of new Set([c.walk, c.run, ...(c.moves ? [c.moves.clips.crouch] : [])])) {
      for (const calf of [c.legs.calfL, c.legs.calfR]) {
        const { contactVz, lift } = footContact(model, clips.get(clipName)!, footOf(bone(calf)));
        assert.ok(lift > 0.05, `${c.id} ${clipName} 腳沒有抬起`);
        assert.ok(contactVz < 0, `${c.id} ${clipName} ${calf} 著地腳向前滑（${contactVz.toFixed(2)}），會像倒退走`);
      }
    }
  });
}

test('重新綁定角色的走、跑、蹲走播放倍率與移動速度一致（著地腳速度誤差 < 20%，避免滑步）', async () => {
  for (const c of characters.filter(c => c.file.startsWith('models/sketchfab/'))) {
    const gltf = await loadCharacterGlb(pub(c.file));
    normalizeHeight(gltf.scene);
    const bones = boneMap(gltf.scene);
    const clips = new Map(gltf.animations.map(clip => [clip.name, clip]));
    const rows: [string, number, number][] = [[c.walk, c.walkScale, c.walkSpeed], [c.run, c.runScale, c.runSpeed]];
    if (c.moves) rows.push([c.moves.clips.crouch, c.crouchScale!, c.crouchSpeed!]);
    for (const [clip, scale, speed] of rows) {
      const feet = [c.legs.calfL, c.legs.calfR].map(n => footContact(gltf.scene, clips.get(clip)!, footOf(bones.get(sanitize(n))!)).contactVz);
      const groundSpeed = -Math.max(...feet) * scale; // 取較慢的一腳，偏保守
      const fastest = -Math.min(...feet) * scale;
      const best = Math.abs(groundSpeed - speed) < Math.abs(fastest - speed) ? groundSpeed : fastest;
      assert.ok(Math.abs(best - speed) / speed < 0.2, `${c.id} ${clip}：腳速 ${best.toFixed(2)} vs 移動 ${speed}`);
    }
  }
});

test('素材總表：ID 唯一、必填欄位齊全、CATALOG.md 與 catalog.json 同步', async () => {
  const { execFileSync } = await import('node:child_process');
  const script = new URL('../../scripts/assets/catalog.py', import.meta.url).pathname;
  const output = execFileSync('python3', [script, 'check'], { encoding: 'utf8' });
  assert.match(output, /通過/);
});

test('攻擊擊中時刻落在刀尖揮砍高峰（刀尖速度 ≥ 該區段峰值 55%），且在播放區間內', async () => {
  const THREE = await import('three');
  for (const c of characters.filter(c => c.moves)) {
    const gltf = await loadCharacterGlb(pub(c.file));
    normalizeHeight(gltf.scene);
    const grip = gltf.scene.getObjectByName('SwordGrip')!;
    const tip = () => { const s = grip.getWorldScale(new THREE.Vector3()).x; return grip.localToWorld(new THREE.Vector3(0, 1 / s, 0)); };
    const cases = [
      ...(['attack', 'combo2', 'combo3'] as const).map(kind => ({ label: kind, clip: c.moves!.clips[kind], range: c.moves!.ranges[kind] ?? [0, Infinity], hits: c.moves!.hits[kind] })),
      ...c.moves!.chain.map((seg, i) => ({ label: `J 連段第 ${i + 1} 段`, clip: seg.clip, range: [seg.from, seg.to], hits: seg.hits })),
    ];
    for (const { label, clip: clipName, range, hits } of cases) {
      const clip = gltf.animations.find(a => a.name === clipName)!;
      const mixer = new THREE.AnimationMixer(gltf.scene); mixer.clipAction(clip).play();
      const at = (t: number) => { mixer.setTime(Math.min(Math.max(t, 0), clip.duration - 1e-4)); gltf.scene.updateMatrixWorld(true); return tip(); };
      const speed = (t: number) => at(t + 1 / 60).distanceTo(at(t - 1 / 60)) * 30;
      const end = Math.min(range[1], clip.duration);
      const samples = Array.from({ length: Math.floor((end - range[0]) * 30) - 2 }, (_, i) => speed(range[0] + (i + 1) / 30)).sort((a, b) => a - b);
      const peak = samples[Math.floor(samples.length * 0.95)];
      for (const t of hits) {
        assert.ok(t > range[0] && t < end, `${c.id} ${label} 擊中時刻 ${t} 不在播放區間 ${range[0]}–${end.toFixed(2)}`);
        const best = Math.max(...[-0.05, -0.025, 0, 0.025, 0.05].map(d => speed(t + d)));
        assert.ok(best >= 0.55 * peak, `${c.id} ${label} 在 ${t}s 刀尖未在揮砍（${best.toFixed(1)} / 峰值 ${peak.toFixed(1)}）`);
      }
      mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene);
    }
  }
});

test('倒地動畫最後停在倒下的姿勢（不會在最後一格跳回站姿），根位移與倒向一致', async () => {
  const THREE = await import('three');
  for (const c of characters.filter(c => c.moves)) {
    const gltf = await loadCharacterGlb(pub(c.file));
    normalizeHeight(gltf.scene);
    const bones = boneMap(gltf.scene);
    const hips = bones.get(sanitize(c.legs.thighL))!.parent!;
    const root = gltf.scene.getObjectByName('RootMotion');
    for (const [name, direction] of [[c.moves!.clips.death, 1], ['DeathBack', -1]] as const) {
      const clip = gltf.animations.find(a => a.name === name)!;
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(clip); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
      mixer.setTime(0); gltf.scene.updateMatrixWorld(true);
      const standing = hips.getWorldPosition(new THREE.Vector3()).y;
      mixer.setTime(clip.duration); gltf.scene.updateMatrixWorld(true);
      const lying = hips.getWorldPosition(new THREE.Vector3()).y;
      assert.ok(lying < standing * 0.5, `${c.id} ${name} 最後一格骨盆高度 ${lying.toFixed(2)}（站姿 ${standing.toFixed(2)}），未倒下`);
      assert.ok(root, `${c.id} 缺 RootMotion 節點`);
      assert.ok(root!.position.z * direction > 0.3, `${c.id} ${name} 根位移方向不對（z=${root!.position.z.toFixed(2)}）`);
      mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene);
    }
  }
});

test('握劍角度：待機時刀尖朝上，擊中瞬間刀尖掃過速度明顯大於手（刀身順著弧線揮，不是被拖著走）', async () => {
  const THREE = await import('three');
  for (const c of characters.filter(c => c.moves)) {
    const gltf = await loadCharacterGlb(pub(c.file));
    normalizeHeight(gltf.scene);
    const grip = gltf.scene.getObjectByName('SwordGrip');
    assert.ok(grip, `${c.id} 缺 SwordGrip 握點`);
    const bones = boneMap(gltf.scene);
    const hand = bones.get(sanitize(c.hand))!;
    const tipOf = () => { const s = grip!.getWorldScale(new THREE.Vector3()).x; return grip!.localToWorld(new THREE.Vector3(0, 1.0 / s, 0)); };
    const gripPos = () => grip!.getWorldPosition(new THREE.Vector3());
    const play = (name: string) => { const m = new THREE.AnimationMixer(gltf.scene); m.clipAction(gltf.animations.find(a => a.name === name)!).play(); return m; };
    const idle = play(c.idle); idle.setTime(0.5); gltf.scene.updateMatrixWorld(true);
    const up = tipOf().sub(gripPos()).normalize().y;
    assert.ok(up > 0.5, `${c.id} 待機時刀尖未朝上（y=${up.toFixed(2)}）`);
    idle.stopAllAction(); idle.uncacheRoot(gltf.scene);
    for (const kind of ['attack', 'combo2', 'combo3'] as const) {
      const m = play(c.moves!.clips[kind]);
      // 檢查各動作的擊中瞬間
      const at = (t: number) => { m.setTime(t); gltf.scene.updateMatrixWorld(true); return { tip: tipOf(), hand: hand.getWorldPosition(new THREE.Vector3()) }; };
      for (const t of c.moves!.hits[kind]) {
        const a = at(t - 1 / 30), b = at(t + 1 / 30);
        const ratio = a.tip.distanceTo(b.tip) / Math.max(a.hand.distanceTo(b.hand), 1e-4);
        assert.ok(ratio > 1.3, `${c.id} ${kind} @${t}s 刀尖／手速度比 ${ratio.toFixed(2)}，刀身未順著揮砍弧線`);
      }
      m.stopAllAction(); m.uncacheRoot(gltf.scene);
    }
  }
});
