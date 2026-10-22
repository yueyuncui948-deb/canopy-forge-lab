import test from 'node:test';
import assert from 'node:assert/strict';
import { createMonsterLife, hitMonster, updateMonsterLife } from '../../src/combat/monster-life.ts';

test('新怪物三點 HP，活著時不會重生', () => {
  const life = createMonsterLife();
  assert.deepEqual(life, { hp: 3, respawnAt: null });
  assert.equal(updateMonsterLife(life, 100), false);
});

test('每次有效命中只扣一點，第三次命中排定重生', () => {
  const life = createMonsterLife();
  assert.equal(hitMonster(life, 1), true);
  assert.equal(life.hp, 2);
  assert.equal(life.respawnAt, null);
  hitMonster(life, 2);
  hitMonster(life, 4);
  assert.deepEqual(life, { hp: 0, respawnAt: 7 });
});

test('死後連續攻擊不會扣成負血或推遲重生', () => {
  const life = createMonsterLife();
  for (let i = 0; i < 3; i++) hitMonster(life, 10);
  for (let i = 0; i < 20; i++) assert.equal(hitMonster(life, 11 + i / 20), false);
  assert.deepEqual(life, { hp: 0, respawnAt: 13 });
});

test('三秒之前不重生，到期恢復 HP 並清除排程', () => {
  const life = createMonsterLife();
  for (let i = 0; i < 3; i++) hitMonster(life, 0);
  assert.equal(updateMonsterLife(life, 2.999), false);
  assert.equal(life.hp, 0);
  assert.equal(updateMonsterLife(life, 3), true);
  assert.deepEqual(life, { hp: 3, respawnAt: null });
  assert.equal(updateMonsterLife(life, 3.1), false);
});

test('跨越到期時間仍可重生，第二次生命可再次死亡重生', () => {
  const life = createMonsterLife();
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let hit = 0; hit < 3; hit++) hitMonster(life, cycle * 10);
    assert.equal(updateMonsterLife(life, cycle * 10 + 4), true);
    assert.equal(life.hp, 3);
  }
});
