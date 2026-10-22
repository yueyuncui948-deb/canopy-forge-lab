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
  // task-007：Mixamo 動作。J 單擊播放真實下劈，動作期間鎖定移動
  await expect.poll(async () => (await snapshot(page)).character.clip).toBe('Idle');
  await page.keyboard.press('j');
  await expect.poll(async () => (await snapshot(page)).character.clip, { intervals: [30] }).toBe('SlashDown');
  const swingStart = await snapshot(page);
  expect(swingStart.heroAction).toBe('attack');
  await page.keyboard.down('d'); await advance(page, 0.3); await page.keyboard.up('d');
  const swinging = await snapshot(page);
  expect(Math.hypot(swinging.hero.x - swingStart.hero.x, swinging.hero.z - swingStart.hero.z), '攻擊中不應移動').toBeLessThan(0.01);
  await expect.poll(async () => (await snapshot(page)).heroAction).toBe(null);
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
