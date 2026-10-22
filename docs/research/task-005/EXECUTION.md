# task-005 執行紀錄

## 環境

claude.ai 雲端容器；Node 22.22、npm 依賴以 `npm ci` 安裝；Chromium 1194（/opt/pw-browsers）+ SwiftShader 軟體 WebGL。Blender 未安裝。素材工具在專案外的暫存目錄安裝：@gltf-transform/cli@4.5.1、core／extensions／functions@4、meshoptimizer、sharp、three@0.180.0、playwright-core@1.56.0。

## 步驟

1. 使用者於 Sketchfab 登入後，由 Claude 操作使用者 Brave 點選下載；A1、B1 原始最高解析度過大（449MB／162MB），本輪取 1K 貼圖 GLB，其餘取原始解析度。使用者上傳六檔至對話，放入 asset-library/raw/<ID>/，`catalog.py verify` 記錄 SHA-256。
2. 檢查骨架（scripts/assets/inspect_glb.mjs）：A1 UE5、A2 Mixamo、A3 Maya QuickRig、A4 Blender IK（手掌在 clavicleFK→handIK 下、腳趾在根骨下，匯出後脫離 IK）、B1 Character Creator、B2 自訂骨架。六檔除 A2（Mixamo idle）、A3（3 秒展示動畫）外無動畫。
3. 動畫來源：shell 可連 GitHub raw，取 three.js r180 examples/models/gltf/Xbot.glb（idle／walk／run，Mixamo 骨架）。
4. scripts/assets/retarget_character.mjs：世界旋轉差量 + 子骨方向對齊 + 全域朝向；A4 加跟隨規則（handIK 位置跟前臂、toe 剛性跟腳）。
   - 第一次以雙臂判定左右，A3 偏 14°、B2 偏 36°（兩者 rest 姿勢持刀、雙臂不對稱）。改以大腿判定後全部在 5° 內並旋轉至 +Z。
5. 離線驗證頁 scripts/assets/verify_motion.html：正面待機／正面走／側面走／遊戲視角跑四格截圖，並量測著地腳模型空間速度。六位 Walk、Run 皆 contactVz < 0（向前走）。
6. 截圖發現未綁骨道具：A1 護手浮空、盔甲件與武器不隨身體；A3 巨劍立地、A4 長劍垂於兩腿間、B1 刀浮於左側、B2 兩刀與展示底座。scripts/assets/process_character.mjs 依計畫掛骨或移除，接著 prune／dedup／resample／weld、WebP（≤2048、q82）、meshopt。
   - B2 首次失敗：名稱後綴剝除使 `pCylinder21` 誤中 `pCylinder21_2`；改為先精確比對後通過。
7. 349MB 原檔 → 遊戲用 42MB（A1 7.7、A2 5.9、A3 3.0、A4 8.8、B1 5.2、B2 12.8 MB），壓縮後重跑離線驗證數值不變。
8. 遊戲整合：catalog.ts 改為介面型別並新增六角色；hero.ts 加 MeshoptDecoder、握把位移／播放倍率／程序跳躍改由設定提供，debug 快照新增依大腿推得的解剖正面 `forward`；main.ts 移動速度改讀角色設定。新增 tests/browser/sketchfab.spec.ts。
   - 首次瀏覽器測試六項皆逾時（90 秒）：SwiftShader 下約 22 FPS 而 frameDelta 上限 0.045，遊戲時間推進慢，非方向錯誤。改為單項 360 秒時限後通過。

## 計畫外變更

- 新角色移動速度：Walk 2.4、Run 5.2（原 4.3／8），使動畫步幅與位移一致；既有三角色維持原值（改為逐角色設定）。
- 新角色跳躍沿用 Idle 靜態姿勢；程序跳躍姿態僅保留於骨軸已驗證的 Rocketbox。
