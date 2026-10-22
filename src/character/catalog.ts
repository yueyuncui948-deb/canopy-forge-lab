export const characters = [
  ...(['female', 'male'] as const).map(gender => ({
    id: gender, name: gender === 'female' ? '艾琳 · 寫實女性' : '里昂 · 寫實男性',
    style: '自然比例 · 臉部與服裝貼圖',
    description: '原生待機、步行與跑步；跳躍與揮劍為程序姿態。現代服裝用於人物品質研究。',
    credit: 'Microsoft Rocketbox · Microsoft / Rocketbox · MIT',
    file: `models/rocketbox/${gender}.glb`, notice: 'models/rocketbox/NOTICE.txt',
    hand: 'Bip01 R Hand', arm: 'Bip01 R UpperArm', forearm: 'Bip01 R Forearm', chest: 'Bip01 Spine2',
    idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Idle', fall: 'Idle',
  })),
  {
    id: 'sophia', name: 'Sophia · 藍髮旅人', style: 'Q 版比例 · 動漫人像',
    description: '原生待機、跑步與跳落；步行沿用減速跑步，揮劍使用程序姿態。',
    credit: 'Sophia · GDQuest · CC BY-NC-SA 4.0',
    file: 'models/sophia/sophia.glb', notice: 'models/sophia/NOTICE.txt',
    hand: 'DEF-hand.R', arm: 'DEF-upper_arm.R', forearm: 'DEF-forearm.R', chest: 'DEF-spine.003',
    idle: 'Idle', walk: 'Run', run: 'Run', jump: 'Jump', fall: 'Fall',
  },
] as const;
export type Character = typeof characters[number];
export function findCharacter(id: string | null): Character {
  return characters.find(character => character.id === id) ?? characters[0];
}
