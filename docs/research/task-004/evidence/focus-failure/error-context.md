# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gallery.spec.ts >> 展示暫停戰鬥、播放男女骨架動作，退出後恢復控制
- Location: tests/browser/gallery.spec.ts:43:1

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0.3
Received:   0

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic:
    - generic: CANOPY FORGE · CHARACTER STUDY
    - strong: 夜林行者
    - paragraph: WASD 移動 · Shift 跑步 · Space 跳躍左鍵 / J 揮劍
    - status: 人物已就緒
  - generic: 滾輪 拉近 / 拉遠 · 右鍵拖曳 環視 · R 重設
  - generic [ref=e4]:
    - text: Microsoft Rocketbox · Microsoft / Rocketbox · MIT ·
    - link "角色來源" [ref=e5] [cursor=pointer]:
      - /url: /models/rocketbox/NOTICE.txt
  - region "人物選擇與展示" [ref=e6]:
    - generic [ref=e7]: CHARACTER COLLECTION
    - heading "選擇你的行者" [level=2] [ref=e8]
    - generic [ref=e9]:
      - button "艾琳 · 寫實女性 自然比例 · 臉部與服裝貼圖" [ref=e10] [cursor=pointer]:
        - strong [ref=e11]: 艾琳 · 寫實女性
        - generic [ref=e12]: 自然比例 · 臉部與服裝貼圖
      - button "里昂 · 寫實男性 自然比例 · 臉部與服裝貼圖" [pressed] [ref=e13] [cursor=pointer]:
        - strong [ref=e14]: 里昂 · 寫實男性
        - generic [ref=e15]: 自然比例 · 臉部與服裝貼圖
      - button "Sophia · 藍髮旅人 Q 版比例 · 動漫人像" [ref=e16] [cursor=pointer]:
        - strong [ref=e17]: Sophia · 藍髮旅人
        - generic [ref=e18]: Q 版比例 · 動漫人像
    - paragraph [ref=e19]: 原生待機、步行與跑步；跳躍與揮劍為程序姿態。現代服裝用於人物品質研究。
    - status [ref=e20]: 人物已切換
    - generic [ref=e21] [cursor=pointer]:
      - checkbox "人物展示 暫停戰鬥" [checked] [active] [ref=e22]
      - text: 人物展示
      - generic [ref=e23]: 暫停戰鬥
    - generic [ref=e24]:
      - button "待機" [pressed] [ref=e25] [cursor=pointer]
      - button "步行" [ref=e26] [cursor=pointer]
      - button "跑步" [ref=e27] [cursor=pointer]
      - button "跳躍" [ref=e28] [cursor=pointer]
      - button "揮劍" [ref=e29] [cursor=pointer]
    - generic [ref=e30]:
      - button "全身" [ref=e31] [cursor=pointer]
      - button "近看" [ref=e32] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import type { GameSnapshot } from '../../src/debug';
  3   | const read = (page: Page): Promise<GameSnapshot> => page.evaluate(() => (window as Window & { __CANOPY_DEBUG__: GameSnapshot }).__CANOPY_DEBUG__);
  4   | const select = async (page: Page, id: string) => {
  5   |   await page.locator(`[data-character="${id}"]`).click();
  6   |   await expect.poll(async () => (await read(page)).character.id).toBe(id);
  7   |   await expect(page.locator('.gallery')).toHaveAttribute('aria-busy', 'false');
  8   | };
  9   | test.beforeEach(async ({ page }) => {
  10  |   await page.goto('/?debug=1');
  11  |   await expect.poll(async () => (await read(page))?.frame ?? 0).toBeGreaterThan(2);
  12  | });
  13  | 
  14  | test('男女寫實角色與 Sophia 可切換、近看並釋放舊資源', async ({ page }, info) => {
  15  |   test.setTimeout(150000);
  16  |   const errors: string[] = [];
  17  |   page.on('pageerror', e => errors.push(e.message));
  18  |   await page.locator('#showcase').check();
  19  |   const initial = await read(page);
  20  |   expect(initial.character.id).toBe('female');
  21  |   expect(initial.character.bones).toBe(80);
  22  |   expect(initial.character.triangles).toBeGreaterThan(8000);
  23  |   expect(initial.character.swordAttachedTo).toBe('Bip01_R_Hand');
  24  |   const samples: GameSnapshot[] = [];
  25  |   for (const id of ['female', 'male', 'sophia', 'female', 'male', 'female']) {
  26  |     await select(page, id);
  27  |     await page.getByRole('button', { name: '近看', exact: true }).click();
  28  |     await expect.poll(async () => (await read(page)).camera.distance).toBeLessThan(1.6);
  29  |     const frame = (await read(page)).frame;
  30  |     await expect.poll(async () => (await read(page)).frame).toBeGreaterThan(frame + 2);
  31  |     const current = await read(page);
  32  |     expect(current.hero.x).toBe(initial.hero.x); expect(current.hero.z).toBe(initial.hero.z);
  33  |     expect(current.character.skinnedMeshes).toBe(id === 'sophia' ? 4 : 3);
  34  |     samples.push(current);
  35  |     if (samples.length <= 3) await page.screenshot({ path: info.outputPath(`${id}-close.png`) });
  36  |   }
  37  |   expect(samples.at(-1)!.resources).toEqual(samples[0].resources);
  38  |   expect(samples[4].resources).toEqual(samples[1].resources);
  39  |   expect(errors).toEqual([]);
  40  |   await info.attach('switches', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
  41  | });
  42  | 
  43  | test('展示暫停戰鬥、播放男女骨架動作，退出後恢復控制', async ({ page }, info) => {
  44  |   test.setTimeout(150000);
  45  |   await page.locator('#showcase').check();
  46  |   const paused = await read(page);
  47  |   const samples: GameSnapshot[] = [];
  48  |   for (const id of ['female', 'male']) {
  49  |     await select(page, id);
  50  |     await page.getByRole('button', { name: '全身', exact: true }).click();
  51  |     const idle = await read(page);
  52  |     for (const [motion, label, clip] of [['walk','步行','Walk'], ['run','跑步','Run'], ['jump','跳躍','Idle'], ['attack','揮劍','Idle']]) {
  53  |       await page.getByRole('button', { name: label, exact: true }).click();
  54  |       await expect.poll(async () => (await read(page)).character.animation, { intervals: [30] }).toBe(motion);
  55  |       const state = await read(page); samples.push(state);
  56  |       expect(state.character.clip).toBe(clip);
  57  |       expect(state.character.upperArm).not.toEqual(idle.character.upperArm);
  58  |       expect(state.character.swordAttachedTo).toBe('Bip01_R_Hand');
  59  |       await page.screenshot({ path: info.outputPath(`${id}-${motion}.png`) });
  60  |     }
  61  |     await page.getByRole('button', { name: '待機', exact: true }).click();
  62  |   }
  63  |   await page.keyboard.press('j'); await page.keyboard.press('Space');
  64  |   const still = await read(page);
  65  |   expect(still.time).toBe(paused.time);
  66  |   expect(still.monster).toEqual(paused.monster);
  67  |   expect(still.hero.x).toBe(paused.hero.x); expect(still.hero.z).toBe(paused.hero.z);
  68  |   expect(still.attackCooldown).toBe(0);
  69  |   await page.locator('#showcase').uncheck();
  70  |   await page.keyboard.down('d');
  71  |   await expect.poll(async () => (await read(page)).hero.x).toBeGreaterThan(paused.hero.x + 0.4);
  72  |   await page.keyboard.up('d');
  73  |   await page.keyboard.press('Space');
> 74  |   await expect.poll(async () => (await read(page)).hero.y, { intervals: [30] }).toBeGreaterThan(0.3);
      |                                                                                 ^ Error: expect(received).toBeGreaterThan(expected)
  75  |   await expect.poll(async () => (await read(page)).hero.y).toBe(0);
  76  |   await info.attach('motions', { body: JSON.stringify(samples,null,2), contentType: 'application/json' });
  77  | });
  78  | 
  79  | test('切換失敗保留原人物，快速改選以最後選擇為準', async ({ page }) => {
  80  |   await page.locator('#showcase').check();
  81  |   await page.route('**/models/rocketbox/male.glb', route => route.abort());
  82  |   await page.locator('[data-character="male"]').click();
  83  |   await expect(page.locator('.gallery-status')).toContainText('載入失敗');
  84  |   expect((await read(page)).character.id).toBe('female');
  85  |   await expect(page.locator('[data-character="female"]')).toHaveAttribute('aria-pressed','true');
  86  |   await page.unroute('**/models/rocketbox/male.glb');
  87  |   let release!: () => void;
  88  |   const gate = new Promise<void>(resolve => { release = resolve; });
  89  |   let started!: () => void;
  90  |   const requested = new Promise<void>(resolve => { started = resolve; });
  91  |   await page.route('**/models/rocketbox/male.glb', async route => { started(); await gate; await route.continue(); });
  92  |   await page.locator('[data-character="male"]').click();
  93  |   await requested;
  94  |   await select(page, 'sophia');
  95  |   const response = page.waitForResponse('**/models/rocketbox/male.glb');
  96  |   release(); await response;
  97  |   await expect(page.locator('[data-character="sophia"]')).toHaveAttribute('aria-pressed','true');
  98  |   // 下一個選取會增加序號；晚回來的男性不得覆蓋目前女性。
  99  |   await select(page, 'female');
  100 |   const frame = (await read(page)).frame;
  101 |   await expect.poll(async () => (await read(page)).frame).toBeGreaterThan(frame + 5);
  102 |   expect((await read(page)).character.id).toBe('female');
  103 | });
  104 | 
```