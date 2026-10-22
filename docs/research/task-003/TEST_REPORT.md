# task-003 測試報告

## 受測版本與環境

起點 d0dffb7 加本任務變更；日期 2026-10-22（Asia/Taipei）。每次命令的 HEAD／dirty／diff SHA-256 見 evidence/commands.jsonl；最終程式、測試、設定與資產的雜湊見 evidence/source-sha256.json，涵蓋當時未追蹤的新檔。
Node 24.19.0、TypeScript 5.9.3、Three.js 0.180.0、Vite 7.3.7、Playwright 1.64.1、Chromium 154.0.8037.57。瀏覽器測試 960×540、DPR 1、單一 worker、零 retries，SwiftShader 真實軟體 WebGL2，未快轉時鐘。

## 結果

| 檢查 | 結果 | 證據 |
|---|---|---|
| 初次建置 | 通過，另有 JS chunk 大小提示 | [first-build.log](evidence/first-build.log) |
| 初次開發畫面檢查 | 人物可見，但觀察到首影格負時間；後續修正 | [first-preview.log](evidence/first-preview.log) |
| npm run check | 型別、8 項單元、正式建置通過；0 失敗／跳過 | [checks.log](evidence/checks.log) |
| npm run test:browser | 6 通過、0 失敗／跳過／flaky，約 3.4 分鐘 | [browser-first.log](evidence/browser-first.log)、[JSON](evidence/browser/results.json) |
| /canopy/ base 建置 | 通過 | [xampp-build.log](evidence/xampp-build.log) |
| 靜態子路徑瀏覽器 smoke | 本地模型／材質載入、無 pageerror | [xampp-smoke.log](evidence/xampp-smoke.log) |

瀏覽器測試指令帶 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium；工作目錄均為 /workspace/canopy-forge-lab。XAMPP smoke 使用 Python 靜態 HTTP server 模擬路徑，未在此機安裝 Apache。

## 驗證內容

- 原有走跑跳、鍵盤／滑鼠攻擊、冷卻與怪物死亡重生回歸均通過。
- 確認人物 GLB 2,635,436 bytes、4 個骨架網格、93 骨架關節、19,086 三角形；持劍父節點為 DEF-handR。
- 真實輸入驅動 Idle／Run／Jump／Fall 及攻擊骨架疊加；手臂姿態有變化，武器保持掛在手骨。
- 滾輪能從預設 7.5 拉近到 2.5，拉遠到 24；右鍵環視不觸發攻擊、不移動人物；R 回到預設。
- 模型載入失敗時顯示明確訊息，不悄悄退回積木人物。
- 初次非同步載入時觀察到負 dt，修正後單元測試涵蓋首影格、倒退 timestamp、正常與超長影格；瀏覽器初始遊戲時間非負且攻擊冷卻為零。

## 視覺證據

[遊戲視角](evidence/browser/character-default.png) · [近看](evidence/browser/character-close.png) · [環視](evidence/browser/character-orbit.png) · [跳躍](evidence/browser/character-jump.png)
主 Agent 實際查看以上畫面，確認連續表面、眼睛／嘴部／髮型、衣服細節與材質陰影，已移除積木主角。近看圖能清楚顯示頭臉與上半身。attack 截圖為操作後截取，非保證攻擊峰值的精確同步影格；動作狀態另由 [animation-states.json](evidence/browser/animation-states.json) 記錄。

## 尚未達標／未驗證

- 最終寫實人物、美術風格的使用者批准、專門 Walk／Attack 動畫與步幅精修尚未完成；步行目前是 Run clip 降速，攻擊為骨架疊加。
- 任意場景位置的鏡頭防遮擋、地形碰撞、玩家死亡、怪物美術仍未完成。
- 實體 GPU／1080p FPS 未測；3.4 分鐘是測試時間，不是遊戲效能數據。
- 主要 JS 仍約 593.48 kB（Vite gzip 估算 154.94 kB），有 chunk 大小提示；不是建置失敗，也不是實際網路傳輸報告。
- GitHub 遠端 CI 未確認，既有 API 存取限制仍適用；本地通過不代替遠端結果。
