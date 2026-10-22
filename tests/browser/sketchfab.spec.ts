import { test, expect, type Page } from '@playwright/test';
import type { GameSnapshot } from '../../src/debug';

// task-005／006：Sketchfab 人物在遊戲中的整合檢查。
// 逐角色的朝向、步態、骨頭、揮劍方向改由 tests/unit/characters.test.ts 與 swing.test.ts 在 Node 中檢查（數秒涵蓋全部人物），
// 這裡只保留一位最輕的人物（A3，3 MB）驗證 meshopt 載入、移動速度設定與正面對齊移動方向。
const snapshot = (page: Page): Promise<GameSnapshot> => page.evaluate(
  () => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__,
);
async function advance(page: Page, seconds: number) {
  const start = (await snapshot(page)).time;
  await expect.poll(async () => (await snapshot(page)).time - start, { timeout: 60_000 }).toBeGreaterThanOrEqual(seconds);
}

test('Sketchfab 人物（A3）前後移動朝向正確、跑步、Mixamo 下劈鎖定移動、蹲走、施法 @smoke', async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/?debug=1&character=a3');
  await expect.poll(async () => (await snapshot(page))?.frame ?? 0, { timeout: 60_000 }).toBeGreaterThan(3);
  expect((await snapshot(page)).character.id).toBe('a3');
  await page.locator('canvas').focus();
  for (const key of ['w', 's']) {
    await page.keyboard.down(key);
    await advance(page, 0.2);
    const before = await snapshot(page);
    await advance(page, 0.3);
    const after = await snapshot(page);
    await page.keyboard.up(key);
    const dx = after.hero.x - before.hero.x, dz = after.hero.z - before.hero.z, length = Math.hypot(dx, dz);
    const speed = length / (after.time - before.time);
    expect(speed, `${key} 移動速度應為新角色設定 2.4`).toBeGreaterThan(2.0);
    expect(speed).toBeLessThan(2.8);
    const cos = (dx * after.character.forward.x + dz * after.character.forward.z) / length;
    expect(cos, `${key}：正面與移動方向夾角須小於 30°`).toBeGreaterThan(Math.cos(Math.PI / 6));
    expect(after.character.clip).toBe('Walk');
  }
  await page.keyboard.down('Shift'); await page.keyboard.down('w');
  await expect.poll(async () => (await snapshot(page)).character.clip).toBe('Run');
  await page.keyboard.up('w'); await page.keyboard.up('Shift');
  // task-007／008：J 播放真實下劈。出招到擊中前，方向鍵不能改變面向（輸入不能操控攻擊）；
  // 擊中後按住方向會提早取消收招（不必等完整動作 1.25 秒）。
  await expect.poll(async () => (await snapshot(page)).character.clip).toBe('Idle');
  await page.keyboard.press('j');
  await expect.poll(async () => (await snapshot(page)).character.clip, { intervals: [30] }).toBe('SlashDown');
  await advance(page, 0.15); // 讓自動轉向（若怪物在範圍內）完成
  const attackStart = await snapshot(page);
  expect(attackStart.heroAction).toBe('attack');
  await page.keyboard.down('d');
  let lastAttack = attackStart;
  await expect.poll(async () => {
    const s = await snapshot(page);
    if (s.heroAction === 'attack') {
      if (s.time - attackStart.time < 0.3) expect(Math.abs(s.character.rootYaw - attackStart.character.rootYaw), '擊中前方向鍵不應改變面向').toBeLessThan(0.05);
      lastAttack = s;
    }
    return s.heroAction;
  }, { intervals: [30], timeout: 30_000 }).toBe(null);
  await page.keyboard.up('d');
  expect(lastAttack.time - attackStart.time + 0.15, '按住方向應在完整動作（1.25 秒）前取消收招').toBeLessThan(1.15);
  // C 蹲走：速度約 1.5、播放蹲走動畫
  await page.keyboard.down('c'); await page.keyboard.down('w');
  await advance(page, 0.2);
  const crouchStart = await snapshot(page);
  await advance(page, 0.3);
  const crouched = await snapshot(page);
  await page.keyboard.up('w'); await page.keyboard.up('c');
  expect(crouched.character.clip).toBe('CrouchWalk');
  const crouchSpeed = Math.hypot(crouched.hero.x - crouchStart.hero.x, crouched.hero.z - crouchStart.hero.z) / (crouched.time - crouchStart.time);
  expect(crouchSpeed).toBeGreaterThan(1.2); expect(crouchSpeed).toBeLessThan(1.8);
  // Q 施法
  await expect.poll(async () => (await snapshot(page)).heroAction).toBe(null);
  await page.keyboard.press('q');
  await expect.poll(async () => (await snapshot(page)).character.clip, { intervals: [30] }).toBe('CastForward');
  expect(errors).toEqual([]);
});
