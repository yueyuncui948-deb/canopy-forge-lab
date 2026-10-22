import { test, expect, type Page } from '@playwright/test';
import type { GameSnapshot } from '../../src/debug';

const snapshot = (page: Page): Promise<GameSnapshot> => page.evaluate(
  () => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__,
);
const distance = (a: { x: number; z: number }, b: { x: number; z: number }) => Math.hypot(a.x-b.x, a.z-b.z);
async function advance(page: Page, seconds: number) {
  const start = (await snapshot(page)).time;
  await expect.poll(async () => (await snapshot(page)).time - start).toBeGreaterThanOrEqual(seconds);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?debug=1&character=sophia');
  await expect.poll(async () => (await snapshot(page))?.frame ?? 0).toBeGreaterThan(2);
});

test('正式建置以 WebGL2 繪製場景且沒有 JavaScript 或主控台錯誤', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  // 監聽器先註冊，再重新載入以涵蓋初始化錯誤。
  await page.reload();
  await expect.poll(async () => (await snapshot(page))?.frame ?? 0).toBeGreaterThan(3);
  const gl = await page.locator('canvas').evaluate(canvas => {
    const context = (canvas as HTMLCanvasElement).getContext('webgl2');
    if (!context) throw new Error('WebGL2 context missing');
    const extension = context.getExtension('WEBGL_debug_renderer_info');
    return { version: context.getParameter(context.VERSION), renderer: extension ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER), lost: context.isContextLost() };
  });
  expect(gl.lost).toBe(false);
  await info.attach('renderer', { body: JSON.stringify(gl, null, 2), contentType: 'application/json' });
  await page.screenshot({ path: info.outputPath('scene.png') });
  expect(errors).toEqual([]);
});

test('鍵盤可移動、Shift 跑得更快、Space 跳躍後落地', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.keyboard.down('d');
  const before = await snapshot(page);
  await advance(page, 0.5);
  const walked = await snapshot(page);
  await page.keyboard.up('d');
  const walkSpeed = distance(before.hero, walked.hero)/(walked.time-before.time);
  expect(walkSpeed).toBeGreaterThan(3.5);
  expect(walkSpeed).toBeLessThan(5);
  await page.keyboard.down('Shift');
  await page.keyboard.down('a');
  const runStart = await snapshot(page);
  await advance(page, 0.5);
  const ran = await snapshot(page);
  await page.keyboard.up('a');
  await page.keyboard.up('Shift');
  const runSpeed = distance(runStart.hero, ran.hero)/(ran.time-runStart.time);
  expect(runSpeed).toBeGreaterThan(walkSpeed * 1.5);
  await page.keyboard.press('Space');
  await expect.poll(async () => (await snapshot(page)).hero.y, { intervals: [30, 50] }).toBeGreaterThan(0.5);
  await expect.poll(async () => (await snapshot(page)).hero.y).toBe(0);
  const stopped = await snapshot(page);
  await advance(page, 0.3);
  expect(distance(stopped.hero, (await snapshot(page)).hero)).toBeLessThan(0.01);
  expect(errors).toEqual([]);
});

test('鍵盤與滑鼠攻擊、冷卻、死亡及三秒重生可重複運作', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.keyboard.down('d');
  await expect.poll(async () => { const s = await snapshot(page); return distance(s.hero,s.monster); }, { intervals: [50] }).toBeLessThan(2.8);
  await page.keyboard.up('d');
  // 在瀏覽器第一個命中影格內檢查重複事件，不假設跨程序 RPC 耗時。
  const [probe] = await Promise.all([
    page.waitForFunction(() => {
      const read = () => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__;
      const before = read();
      if (before.monster.hp !== 2 || before.attackCooldown <= 0) return false;
      for (let i = 0; i < 10; i++) window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', repeat: true }));
      return { before: before.attackCooldown, after: read().attackCooldown, hp: read().monster.hp };
    }, null, { polling: 'raf' }),
    page.keyboard.press('j'),
  ]);
  const cooldown = await probe.jsonValue();
  expect(cooldown.before).toBeGreaterThan(0);
  expect(cooldown.after).toBe(cooldown.before);
  expect(cooldown.hp).toBe(2);
  await expect.poll(async () => (await snapshot(page)).attackCooldown).toBe(0);
  await page.locator('canvas').click({ position: { x: 500, y: 300 } });
  await expect.poll(async () => (await snapshot(page)).monster.hp).toBe(1);
  await expect.poll(async () => (await snapshot(page)).attackCooldown).toBe(0);
  await page.keyboard.press('j');
  await expect.poll(async () => (await snapshot(page)).monster.hp).toBe(0);
  const dead = await snapshot(page);
  expect(dead.monster.visible).toBe(false);
  expect(dead.monster.respawnAt! - dead.time).toBeGreaterThan(2.5);
  await page.screenshot({ path: info.outputPath('monster-dead.png') });
  await expect.poll(async () => (await snapshot(page)).attackCooldown).toBe(0);
  await page.keyboard.press('j');
  await advance(page, 0.3);
  const stillDead = await snapshot(page);
  expect(stillDead.monster.hp).toBe(0);
  expect(stillDead.monster.respawnAt).toBe(dead.monster.respawnAt);
  await expect.poll(async () => (await snapshot(page)).monster.visible).toBe(true);
  const revived = await snapshot(page);
  expect(revived.monster.hp).toBe(3);
  expect(revived.time).toBeGreaterThanOrEqual(dead.monster.respawnAt!);
  expect(revived.monster.respawnAt).toBe(null);
  await page.screenshot({ path: info.outputPath('monster-respawned.png') });
  await page.keyboard.press('j');
  await expect.poll(async () => (await snapshot(page)).monster.hp).toBe(2);
  expect(errors).toEqual([]);
  await info.attach('lifecycle', { body: JSON.stringify({dead,stillDead,revived},null,2), contentType:'application/json' });
});

test('人物是有材質的骨架網格，滾輪可近看且右鍵環視不觸發攻擊', async ({ page }, info) => {
  const start = await snapshot(page);
  expect(start.time).toBeGreaterThanOrEqual(0);
  expect(start.attackCooldown).toBe(0);
  expect(start.character.skinnedMeshes).toBe(4);
  expect(start.character.bones).toBeGreaterThan(50);
  expect(start.character.triangles).toBeGreaterThan(10000);
  expect(start.character.swordAttachedTo).toBe('DEF-handR');
  const modelResponse = await page.request.get('/models/sophia/sophia.glb');
  expect(modelResponse.status()).toBe(200);
  expect((await modelResponse.body()).byteLength).toBe(2635436);
  await page.screenshot({ path: info.outputPath('character-default.png') });
  await page.mouse.move(600, 250);
  await page.mouse.wheel(0, -3000);
  await expect.poll(async () => (await snapshot(page)).camera.distance).toBeLessThan(2.6);
  const close = await snapshot(page);
  expect(close.camera.desiredDistance).toBe(close.camera.minDistance);
  expect(close.camera.distance).toBeGreaterThanOrEqual(close.camera.minDistance);
  await page.screenshot({ path: info.outputPath('character-close.png') });
  await page.mouse.down({ button: 'right' });
  await page.mouse.move(780, 280, { steps: 8 });
  await page.mouse.up({ button: 'right' });
  const orbit = await snapshot(page);
  expect(Math.abs(orbit.camera.azimuth - close.camera.azimuth)).toBeGreaterThan(0.8);
  expect(orbit.attackCooldown).toBe(0);
  expect(distance(orbit.hero, close.hero)).toBeLessThan(0.001);
  await page.screenshot({ path: info.outputPath('character-orbit.png') });
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 6000);
  await expect.poll(async () => (await snapshot(page)).camera.distance).toBeGreaterThan(23.9);
  expect((await snapshot(page)).camera.desiredDistance).toBe(24);
  await page.keyboard.press('r');
  await expect.poll(async () => Math.abs((await snapshot(page)).camera.distance - 7.5)).toBeLessThan(0.1);
  await info.attach('character-and-camera', { body: JSON.stringify({start,close,orbit},null,2), contentType:'application/json' });
});

test('真實輸入驅動骨架走跑跳與手臂揮劍', async ({ page }, info) => {
  const idle = await snapshot(page);
  expect(idle.character.animation).toBe('idle');
  await page.keyboard.down('w');
  await expect.poll(async () => (await snapshot(page)).character.animation).toBe('walk');
  await advance(page, 0.2);
  const walk = await snapshot(page);
  expect(walk.character.upperArm).not.toEqual(idle.character.upperArm);
  await page.keyboard.down('Shift');
  await expect.poll(async () => (await snapshot(page)).character.animation).toBe('run');
  await page.keyboard.press('Space');
  await expect.poll(async () => (await snapshot(page)).hero.y, { intervals: [30] }).toBeGreaterThan(0.5);
  const jump = await snapshot(page);
  expect(['jump','fall']).toContain(jump.character.animation);
  await page.screenshot({ path: info.outputPath('character-jump.png') });
  await page.keyboard.up('w');
  await page.keyboard.up('Shift');
  await expect.poll(async () => (await snapshot(page)).character.animation).toBe('idle');
  await page.keyboard.press('j');
  await expect.poll(async () => (await snapshot(page)).character.animation, { intervals: [20] }).toBe('attack');
  const attack = await snapshot(page);
  expect(attack.character.upperArm).not.toEqual(idle.character.upperArm);
  expect(attack.character.swordAttachedTo).toBe('DEF-handR');
  await page.screenshot({ path: info.outputPath('character-attack.png') });
  await info.attach('animation-states', { body: JSON.stringify({idle,walk,jump,attack},null,2), contentType:'application/json' });
});

test('模型載入失敗有明確訊息，不退回積木人物', async ({ page }) => {
  await page.route('**/models/sophia/sophia.glb', route => route.abort());
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('人物載入失敗');
  expect(await page.evaluate(() => '__CANOPY_DEBUG__' in window)).toBe(false);
});
