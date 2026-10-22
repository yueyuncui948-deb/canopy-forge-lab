import { test, expect, type Page } from '@playwright/test';
import type { GameSnapshot } from '../../src/debug';

// task-005：六位 Sketchfab 候選人物的移動方向回歸。
// 模型「解剖正面」（由左右大腿推得）必須與實際移動方向一致，前進、後退、左右皆檢查。
const snapshot = (page: Page): Promise<GameSnapshot> => page.evaluate(
  () => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__,
);
async function advance(page: Page, seconds: number) {
  const start = (await snapshot(page)).time;
  await expect.poll(async () => (await snapshot(page)).time - start, { timeout: 120_000 }).toBeGreaterThanOrEqual(seconds);
}

for (const id of ['a1', 'a2', 'a3', 'a4', 'b1', 'b2']) {
  test(`${id.toUpperCase()} 載入並在 W／S／A／D 移動時正面朝向移動方向`, async ({ page }, info) => {
    // 雲端 SwiftShader 軟體渲染下高面數人物幀率低、遊戲時間推進慢；放寬時限而非縮短檢查。
    test.setTimeout(360_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`/?debug=1&character=${id}`);
    await expect.poll(async () => (await snapshot(page))?.frame ?? 0, { timeout: 60_000 }).toBeGreaterThan(3);
    const loaded = await snapshot(page);
    expect(loaded.character.id).toBe(id);
    expect(loaded.character.skinnedMeshes).toBeGreaterThan(0);
    await page.locator('canvas').focus();
    const results: Record<string, unknown> = {};
    for (const key of ['w', 's', 'a', 'd']) {
      await page.keyboard.down(key);
      await advance(page, 0.25); // 先讓轉向與步態穩定
      const before = await snapshot(page);
      await advance(page, 0.45);
      const after = await snapshot(page);
      await page.keyboard.up(key);
      const dx = after.hero.x - before.hero.x, dz = after.hero.z - before.hero.z;
      const length = Math.hypot(dx, dz);
      const facing = after.character.forward;
      const cos = (dx * facing.x + dz * facing.z) / length;
      results[key] = { moved: +length.toFixed(2), cos: +cos.toFixed(3), clip: after.character.clip };
      expect(length, `${key} 應該移動`).toBeGreaterThan(0.5);
      expect(cos, `${key}：正面與移動方向夾角須小於 30°`).toBeGreaterThan(Math.cos(Math.PI / 6));
      expect(after.character.clip).toBe('Walk');
      await advance(page, 0.2);
    }
    await page.keyboard.down('Shift'); await page.keyboard.down('w');
    await advance(page, 0.4);
    expect((await snapshot(page)).character.clip).toBe('Run');
    await page.keyboard.up('w'); await page.keyboard.up('Shift');
    const end = await snapshot(page);
    results.fps = +(end.frame / Math.max(end.time, 0.001)).toFixed(1);
    await info.attach('direction', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    await page.screenshot({ path: info.outputPath(`${id}.png`) });
    expect(errors).toEqual([]);
  });
}
