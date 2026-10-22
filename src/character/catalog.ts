export interface Character {
  id: string;
  name: string;
  style: string;
  description: string;
  credit: string;
  file: string;
  notice: string;
  hand: string; arm: string; forearm: string; chest: string;
  idle: string; walk: string; run: string; jump: string; fall: string;
  /** 解剖正面判定與（Rocketbox）程序跳躍姿態用的大腿／小腿骨。 */
  legs: { thighL: string; thighR: string; calfL: string; calfR: string };
  /** 手骨本地座標中的握把位移（各骨架單位不同）。 */
  grip: number;
  /** 動畫播放倍率；Sketchfab 角色依著地腳速度與遊戲移動速度換算，減少滑步。 */
  walkScale: number; runScale: number;
  /** 遊戲移動速度（單位／秒）。既有三角色維持原手感，新角色依動畫步幅設定。 */
  walkSpeed: number; runSpeed: number;
  /** 只有 Rocketbox 的骨軸經過驗證，可疊加程序跳躍姿態。 */
  proceduralJump: boolean;
}

// Sketchfab 候選人物共用 Xbot 重新綁定動畫：高度 2.35 時著地腳速度約 Walk 1.85、Run 3.2（task-005 量測）。
export const WALK_SPEED = 2.4;
export const RUN_SPEED = 5.2;
const retargeted = { idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Idle', fall: 'Idle', grip: 0,
  walkScale: WALK_SPEED / 1.85, runScale: RUN_SPEED / 3.2, walkSpeed: WALK_SPEED, runSpeed: RUN_SPEED, proceduralJump: false } as const;
const sketchfab = (id: string, name: string, style: string, description: string, author: string) => ({
  id, name, style, description, credit: `${id.toUpperCase()} · ${author} · Sketchfab · CC BY 4.0`,
  file: `models/sketchfab/${id}/model.glb`, notice: `models/sketchfab/${id}/NOTICE.txt`, ...retargeted,
});

export const characters: readonly Character[] = [
  ...(['female', 'male'] as const).map(gender => ({
    id: gender, name: gender === 'female' ? '艾琳 · 寫實女性' : '里昂 · 寫實男性',
    style: '自然比例 · 臉部與服裝貼圖',
    description: '原生待機、步行與跑步；跳躍與揮劍為程序姿態。現代服裝用於人物品質研究。',
    credit: 'Microsoft Rocketbox · Microsoft / Rocketbox · MIT',
    file: `models/rocketbox/${gender}.glb`, notice: 'models/rocketbox/NOTICE.txt',
    hand: 'Bip01 R Hand', arm: 'Bip01 R UpperArm', forearm: 'Bip01 R Forearm', chest: 'Bip01 Spine2',
    idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Idle', fall: 'Idle',
    legs: { thighL: 'Bip01 L Thigh', thighR: 'Bip01 R Thigh', calfL: 'Bip01 L Calf', calfR: 'Bip01 R Calf' },
    grip: 5, walkScale: 1, runScale: 1, walkSpeed: 4.3, runSpeed: 8, proceduralJump: true,
  })),
  {
    id: 'sophia', name: 'Sophia · 藍髮旅人', style: 'Q 版比例 · 動漫人像',
    description: '原生待機、跑步與跳落；步行沿用減速跑步，揮劍使用程序姿態。',
    credit: 'Sophia · GDQuest · CC BY-NC-SA 4.0',
    file: 'models/sophia/sophia.glb', notice: 'models/sophia/NOTICE.txt',
    hand: 'DEF-hand.R', arm: 'DEF-upper_arm.R', forearm: 'DEF-forearm.R', chest: 'DEF-spine.003',
    idle: 'Idle', walk: 'Run', run: 'Run', jump: 'Jump', fall: 'Fall',
    legs: { thighL: 'DEF-thigh.L', thighR: 'DEF-thigh.R', calfL: 'DEF-shin.L', calfR: 'DEF-shin.R' },
    grip: 0.075, walkScale: 0.72, runScale: 1.35, walkSpeed: 4.3, runSpeed: 8, proceduralJump: false,
  },
  {
    ...sketchfab('a1', 'A1 · 詛咒騎士', '暗黑寫實 · UE5 骨架', '骷髏面甲與破損鎖甲；盾與巨劍背負。測試用重新綁定走跑動畫。', 'Blue-Spirit'),
    hand: 'hand_r_041', arm: 'upperarm_r_037', forearm: 'lowerarm_r_038', chest: 'spine_05_05',
    legs: { thighL: 'thigh_l_071', thighR: 'thigh_r_063', calfL: 'calf_l_072', calfR: 'calf_r_064' },
  },
  {
    ...sketchfab('a2', 'A2 · 中世紀騎士', '暗黑寫實 · Mixamo 骨架', '全身板甲，4K 原始貼圖壓為 2K WebP。測試用重新綁定走跑動畫。', 'by__Rx'),
    hand: 'mixamorig:RightHand_030', arm: 'mixamorig:RightArm_028', forearm: 'mixamorig:RightForeArm_029', chest: 'mixamorig:Spine2_04',
    legs: { thighL: 'mixamorig:LeftUpLeg_047', thighR: 'mixamorig:RightUpLeg_052', calfL: 'mixamorig:LeftLeg_048', calfR: 'mixamorig:RightLeg_053' },
  },
  {
    ...sketchfab('a3', 'A3 · 石碑騎士', '暗黑寫實 · Maya QuickRig', '不死騎士與斗篷；原巨劍立於地面未綁定，已移出。測試用重新綁定走跑動畫。', 'Muru'),
    hand: 'QuickRigCharacter_RightHand_019', arm: 'QuickRigCharacter_RightArm_017', forearm: 'QuickRigCharacter_RightForeArm_018', chest: 'QuickRigCharacter_Spine2_012',
    legs: { thighL: 'QuickRigCharacter_LeftUpLeg_02', thighR: 'QuickRigCharacter_RightUpLeg_06', calfL: 'QuickRigCharacter_LeftLeg_03', calfR: 'QuickRigCharacter_RightLeg_07' },
  },
  {
    ...sketchfab('a4', 'A4 · 十字騎士', '暗黑寫實 · Blender IK 骨架', '戰損板甲；手掌與腳趾原由 IK 控制，已改為跟隨烘焙。測試用重新綁定走跑動畫。', 'sanyaork'),
    hand: 'handIK.R_055', arm: 'upperarm.R_052', forearm: 'arm.R_053', chest: 'spine 3_023',
    legs: { thighL: 'leg.L_016', thighR: 'leg.R_019', calfL: 'leg2.L_017', calfR: 'leg2.R_020' },
  },
  {
    ...sketchfab('b1', 'B1 · 影焰武士', '日式暗黑 · Character Creator', '綠焰亡魂武士；腰間刀鞘隨身，原手持刀已移出。測試用重新綁定走跑動畫。', 'dark_igorek'),
    hand: 'CC_Base_R_Hand_085', arm: 'CC_Base_R_Upperarm_078', forearm: 'CC_Base_R_Forearm_081', chest: 'CC_Base_Spine02_039',
    legs: { thighL: 'CC_Base_L_Thigh_05', thighR: 'CC_Base_R_Thigh_020', calfL: 'CC_Base_L_Calf_06', calfR: 'CC_Base_R_Calf_023' },
  },
  {
    ...sketchfab('b2', 'B2 · 赤鎧武士', '日式 · 自訂骨架', '紅色大鎧與鬼面；展示底座與兩把刀已移出。測試用重新綁定走跑動畫。', 'Xiaoyuyao'),
    hand: 'R_hand_072', arm: 'R_arm_070', forearm: 'R_forarm_071', chest: 'chest_037',
    legs: { thighL: 'L_leg_027', thighR: 'R_leg_031', calfL: 'L_knee_028', calfR: 'R_knee_032' },
  },
];

export function findCharacter(id: string | null): Character {
  return characters.find(character => character.id === id) ?? characters[0];
}
