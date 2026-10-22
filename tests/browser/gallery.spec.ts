import { test, expect, type Page } from '@playwright/test';
import type { GameSnapshot } from '../../src/debug';
const read = (page: Page): Promise<GameSnapshot> => page.evaluate(() => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__);
const select = async (page: Page, id: string) => {
  await page.locator(`[data-character="${id}"]`).click();
  await expect.poll(async () => (await read(page)).character.id).toBe(id);
  await expect(page.locator('.gallery')).toHaveAttribute('aria-busy', 'false');
};
test.beforeEach(async ({ page }) => {
  await page.goto('/?debug=1');
  await expect.poll(async () => (await read(page))?.frame ?? 0).toBeGreaterThan(2);
});

test('男女寫實角色與 Sophia 可切換、近看並釋放舊資源', async ({ page }, info) => {
  test.setTimeout(240000); // 四次載入（含 meshopt/WebP 的 A3）於軟體渲染約 2.5 分鐘
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.locator('#showcase').check();
  const initial = await read(page);
  expect(initial.character.id).toBe('female');
  expect(initial.character.bones).toBe(80);
  expect(initial.character.triangles).toBeGreaterThan(8000);
  expect(initial.character.swordAttachedTo).toBe('Bip01_R_Hand');
  const samples: GameSnapshot[] = [];
  // 男女共用同骨架與設定；改取 Rocketbox、Sophia、meshopt 壓縮的 Sketchfab 人物各一，再回到起點比對資源。
  for (const id of ['female', 'sophia', 'a3', 'female']) {
    await select(page, id);
    await page.getByRole('button', { name: '近看', exact: true }).click();
    await expect.poll(async () => (await read(page)).camera.distance).toBeLessThan(id === 'sophia' ? 2.6 : 1.6);
    expect((await read(page)).camera.desiredDistance).toBe(id === 'sophia' ? 2.5 : 1.5);
    await expect.poll(async () => { const c = (await read(page)).camera; return Math.abs(c.distance - c.desiredDistance); }).toBeLessThan(0.05);
    const frame = (await read(page)).frame;
    await expect.poll(async () => (await read(page)).frame).toBeGreaterThan(frame + 2);
    const current = await read(page);
    expect(current.hero.x).toBe(initial.hero.x); expect(current.hero.z).toBe(initial.hero.z);
    expect(current.character.skinnedMeshes).toBe(({ sophia: 4, a3: 1 } as Record<string, number>)[id] ?? 3);
    samples.push(current);
    if (samples.length <= 3) await page.screenshot({ path: info.outputPath(`${id}-close.png`) });
  }
  expect(samples.at(-1)!.resources).toEqual(samples[0].resources);
  expect(errors).toEqual([]);
  await info.attach('switches', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
});

test('展示暫停戰鬥、播放男女骨架動作，退出後恢復控制', async ({ page }, info) => {
  test.setTimeout(150000);
  await page.locator('#showcase').check();
  const paused = await read(page);
  const samples: GameSnapshot[] = [];
  for (const id of ['female']) { // male 與 female 骨架、設定相同，不重複
    await select(page, id);
    await page.getByRole('button', { name: '全身', exact: true }).click();
    const idle = await read(page);
    for (const [motion, label, clip] of [['walk','步行','Walk'], ['run','跑步','Run'], ['jump','跳躍','Idle'], ['attack','揮劍','Idle']]) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect.poll(async () => (await read(page)).character.animation, { intervals: [30] }).toBe(motion);
      const state = await read(page); samples.push(state);
      expect(state.character.clip).toBe(clip);
      expect(state.character.upperArm).not.toEqual(idle.character.upperArm);
      expect(state.character.swordAttachedTo).toBe('Bip01_R_Hand');
      await page.screenshot({ path: info.outputPath(`${id}-${motion}.png`) });
    }
    await page.getByRole('button', { name: '待機', exact: true }).click();
  }
  await page.keyboard.press('j'); await page.keyboard.press('Space');
  const still = await read(page);
  expect(still.time).toBe(paused.time);
  expect(still.monster).toEqual(paused.monster);
  expect(still.hero.x).toBe(paused.hero.x); expect(still.hero.z).toBe(paused.hero.z);
  expect(still.attackCooldown).toBe(0);
  await page.locator('#showcase').uncheck();
  await page.keyboard.down('d');
  await expect.poll(async () => (await read(page)).hero.x).toBeGreaterThan(paused.hero.x + 0.4);
  await page.keyboard.up('d');
  await page.keyboard.press('Space');
  await expect.poll(async () => (await read(page)).hero.y, { intervals: [30] }).toBeGreaterThan(0.3);
  await expect.poll(async () => (await read(page)).hero.y).toBe(0);
  await info.attach('motions', { body: JSON.stringify(samples,null,2), contentType: 'application/json' });
});

test('切換失敗保留原人物，快速改選以最後選擇為準', async ({ page }) => {
  await page.locator('#showcase').check();
  await page.route('**/models/rocketbox/male.glb', route => route.abort());
  await page.locator('[data-character="male"]').click();
  await expect(page.locator('.gallery-status')).toContainText('載入失敗');
  expect((await read(page)).character.id).toBe('female');
  await expect(page.locator('[data-character="female"]')).toHaveAttribute('aria-pressed','true');
  await page.unroute('**/models/rocketbox/male.glb');
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let started!: () => void;
  const requested = new Promise<void>(resolve => { started = resolve; });
  await page.route('**/models/rocketbox/male.glb', async route => { started(); await gate; await route.continue(); });
  await page.locator('[data-character="male"]').click();
  await requested;
  await select(page, 'sophia');
  const response = page.waitForResponse('**/models/rocketbox/male.glb');
  release(); await response;
  await expect(page.locator('[data-character="sophia"]')).toHaveAttribute('aria-pressed','true');
  // 下一個選取會增加序號；晚回來的男性不得覆蓋目前女性。
  await select(page, 'female');
  const frame = (await read(page)).frame;
  await expect.poll(async () => (await read(page)).frame).toBeGreaterThan(frame + 5);
  expect((await read(page)).character.id).toBe('female');
});
