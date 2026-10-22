# task-005 計畫：Sketchfab ARPG 候選人物導入與移動方向校正

## 任務資料

2026-10-22（Asia/Taipei），main 起始 e9d20b3478e0008f02302c0e5ed24200b098059c。執行者：Claude（claude.ai 雲端工作階段）。授權範圍：使用者要求取得 A1–A4、B1、B2 六位候選人物並測試，素材需完整登記來源；並「務必確認人物往前走跟往後走、移動方向正確」。

## 目標與範圍

1. 六位人物原始檔登記於 docs/asset-catalog（來源、作者、授權、SHA-256）；原檔不進 Git。
2. 各骨架（UE5、Mixamo、Maya QuickRig、Blender IK、Character Creator、自訂）重新綁定同一組 Idle／Walk／Run。
3. 校正朝向：模型正面朝 +Z，符合 main.ts `rotation.y = atan2(vx, vz)`；走跑時著地腳須向後推（不倒走、不反向）。
4. 處理未綁骨架道具：盔甲件掛骨、散落武器與底座移除；網頁最佳化（WebP、meshopt）。
5. 加入遊戲人物選單；保留既有三角色與測試。

不在範圍：專門攻擊／跳躍動作、武器握姿對位、怪物與場景。

## 方案比較與選擇理由

- 動畫來源：使用者 Mixamo 帳號尚未下載；本輪用 three.js r180 範例 Xbot.glb（Mixamo 骨架 idle/walk/run）作測試動畫。正式版改用使用者自行下載的 Mixamo 或 CC0 UAL2，替換流程相同。
- 重新綁定：Blender 未安裝；改以 Node + three.js 數學離線烘焙。世界空間旋轉差量 + 骨骼方向對齊（消除 T/A pose 差異）+ 依大腿左右判定的全域朝向修正。可重現腳本放 scripts/assets/。
- 執行時 vs 離線：離線烘焙讓遊戲端只需普通 AnimationMixer，與現行 hero.ts 相容。

## 驗收標準與操作順序

1. 離線檢查：每位人物 Walk／Run 著地腳模型空間速度 contactVz < 0（向後推＝向前走），朝向修正後正面 +Z。
2. 遊戲內：debug 快照提供依大腿計算的「解剖正面」，瀏覽器測試按 W／S／A／D 時，人物正面與移動方向夾角 < 30°。
3. 型別、單元、建置、既有瀏覽器回歸通過；新增人物回歸。
4. 更新 ASSETS、PROGRESS、DECISIONS 與素材總表。

## 計畫變更（追加）

2026-10-22：新角色移動速度改為 Walk 2.4／Run 5.2 以配合動畫步幅（既有角色不變）；加入未綁骨道具處理步驟（截圖發現）。既有 9 項瀏覽器回歸因使用者中斷未重跑。詳見 EXECUTION、TEST_REPORT。
