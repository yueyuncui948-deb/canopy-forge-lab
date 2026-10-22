# task-002 測試報告

## 版本與環境

日期：2026-10-22（Asia/Taipei）。Linux x86_64；Node 24.19.0、npm 11.9.0、TypeScript 5.9.3、Three.js 0.180.0、Vite 7.3.7、@playwright/test 1.64.1、Chromium 154.0.8037.57。
受測起點 76d846c 加本任務變更；各命令執行時的 HEAD、dirty 與差異雜湊見 evidence/commands.jsonl。最終原始碼、鎖檔、測試及設定雜湊見 evidence/source-sha256.json，涵蓋測試時尚未追蹤的新檔案。後續只追加報告，不修改已通過的遊戲與測試程式。
瀏覽器 960×540、DPR 1、單一 worker、零自動 retries；使用真實時間與 WebGL2，renderer 為 SwiftShader。此結果不代表實體 GPU 1080p 效能。

## 實際結果

所有命令工作目錄為 /workspace/canopy-forge-lab。原始輸出與退出碼見 evidence。

| 檢查 | 結果 | 證據 |
|---|---|---|
| 原始 npm run build | 失敗，退出碼 2，TS2339 | [baseline-build.log](evidence/baseline-build.log) |
| npm ci --cache /tmp/canopy-npm-cache | 通過，退出碼 0 | [reproducible-install.log](evidence/reproducible-install.log) |
| npm run check | 型別、5 項單元、正式建置通過；0 失敗／跳過 | [checks.log](evidence/checks.log) |
| 第一次 npm run test:browser | 1 通過、2 失敗、0 跳過，退出碼 1 | [browser-first.log](evidence/browser-first.log) |
| 修正後 npm run test:browser | 3 通過、0 失敗／跳過，退出碼 0 | [browser-second.log](evidence/browser-second.log) |
| 開發服務 smoke | HTTP 200、WebGL2、無 pageerror、debug 預設關閉 | [dev-smoke.log](evidence/dev-smoke.log) |

瀏覽器指令加上 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium；正式預覽服務由測試自行啟動與關閉。

## 驗收證據與失敗修正

單元涵蓋新怪物、逐次扣血、死後連擊、到期前／到期重生、跨時間步與第二次生命。瀏覽器驗證畫面、走跑速度、跳躍落地、停止移動、鍵盤及滑鼠攻擊、冷卻、死亡與重生後再次受擊。
首次速度算得 3.225，因樣本包含送出按鍵與放開之間的程序通訊空窗；改為持續按鍵期間取兩個樣本，保留原本 >3.5 且 <5 的步行斷言。冷卻失敗時連續 RPC 已跨過冷卻窗口；改在第一個命中影格內派送 10 次重複鍵盤事件，驗證冷卻不重置且 HP 保持 2。不是放寬遊戲要求。
[重生狀態](evidence/browser-passed/lifecycle.json) 顯示死亡排程 6.129 秒，死後攻擊仍為相同時間；後續取樣於 6.864 秒確認 HP 3、可見且排程清除。精確三秒邊界由單元測試驗證；瀏覽器取樣不能推論實際重生恰在 6.864 秒。

## 畫面與分層結論

- [場景](evidence/browser-passed/scene.png)、[死亡](evidence/browser-passed/monster-dead.png)、[重生](evidence/browser-passed/monster-respawned.png)。主 Agent 查看場景截圖，確認真實幾何畫面，也發現偏暗與前景遮擋。
- 程式與本任務瀏覽器功能：通過。完整鏡頭方向、碰撞、玩家死亡：未完成。
- 精緻人物與美術品質：未達標，仍為占位模型。
- 實體 GPU 效能：未執行，沒有 FPS 宣稱。
- 建置產物 JS 約 489.33 kB、Vite 估算 gzip 125.00 kB；這不是實際網路傳輸報告。
- 遠端 GitHub Actions：未確認。CI 已新增對應命令，不能以本地通過宣稱雲端 CI 通過。

遠端檢查限制：實際使用 gh api 查詢 Actions 回覆 Forbidden（見 evidence/remote-ci.log），因此沒有宣稱遠端 CI 通過，也未要求額外 token；原生 Git 與 API 權限分開判定。
