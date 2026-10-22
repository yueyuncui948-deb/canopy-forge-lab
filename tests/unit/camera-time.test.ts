import test from 'node:test';
import assert from 'node:assert/strict';
import { zoomDistance, MIN_DISTANCE, MAX_DISTANCE, DEFAULT_DISTANCE } from '../../src/camera/zoom.ts';
import { frameDelta } from '../../src/time.ts';

test('滾輪負值拉近、正值拉遠，零輸入保持距離', () => {
  assert.ok(zoomDistance(DEFAULT_DISTANCE, -200) < DEFAULT_DISTANCE);
  assert.ok(zoomDistance(DEFAULT_DISTANCE, 200) > DEFAULT_DISTANCE);
  assert.equal(zoomDistance(DEFAULT_DISTANCE, 0), DEFAULT_DISTANCE);
});
test('大量滾動仍限制在可看清角色又不穿入人物的範圍', () => {
  assert.equal(zoomDistance(DEFAULT_DISTANCE, -100000), MIN_DISTANCE);
  assert.equal(zoomDistance(DEFAULT_DISTANCE, 100000), MAX_DISTANCE);
  assert.ok(MIN_DISTANCE > 2);
});
test('非同步載入後首影格與早於初始化的 RAF timestamp 不倒退遊戲時間', () => {
  assert.equal(frameDelta(100, null), 0);
  assert.equal(frameDelta(100, 150), 0);
  assert.equal(frameDelta(116, 100), 0.016);
  assert.equal(frameDelta(1000, 100), 0.045);
});
