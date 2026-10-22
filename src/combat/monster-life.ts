export const MONSTER_MAX_HP = 3;
export const RESPAWN_SECONDS = 3;

export interface MonsterLife {
  hp: number;
  respawnAt: number | null;
}

export function createMonsterLife(): MonsterLife {
  return { hp: MONSTER_MAX_HP, respawnAt: null };
}

// 只有活著的怪物能受擊；死亡當刻排定一次重生。
export function hitMonster(life: MonsterLife, gameTime: number): boolean {
  if (life.hp <= 0) return false;
  life.hp -= 1;
  if (life.hp === 0) life.respawnAt = gameTime + RESPAWN_SECONDS;
  return true;
}

export function updateMonsterLife(life: MonsterLife, gameTime: number): boolean {
  if (life.respawnAt === null || gameTime < life.respawnAt) return false;
  life.hp = MONSTER_MAX_HP;
  life.respawnAt = null;
  return true;
}
