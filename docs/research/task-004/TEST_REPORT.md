# 測試報告

## 環境與版本

2026-10-22；commands.jsonl 使用 Asia/Taipei，Playwright JSON 使用 UTC。Node 24.19.0、npm 11.9.0、TypeScript 5.9.3、Three.js 0.180.0、Vite 7.3.7、Playwright 1.64.1、Chromium 154.0.8037.57。WebGL2 實際 renderer 為 SwiftShader 軟體渲染，不代表實體 GPU 效能。

受測基底 commit 為 fb95e8582c3591ae75b78f3a3c0afb25509da08c，包含本任務尚未提交變更。各次指令的起始 diff SHA-256、時間、退出碼在 [commands.jsonl](evidence/commands.jsonl)。最終程式檔案雜湊與原始碼 patch 另存 evidence；正式 commit 收錄相同受測程式，後續報告追加不冒稱當時已存在。

## 實際結果

| 檢查 | 結果與證據 |
|---|---|
| 最終 npm run check | 型別通過、8 passed／0 failed／0 skipped、正式建置通過；check-portrait-fix.log |
| 完整瀏覽器基線 | 9 passed／0 failed／0 skipped，465.9 秒；browser-01.log／browser-01.json。含三角色、6 次切換後資源計數、動作、展示暫停、載入失敗／競態、原有戰鬥與 Sophia 回歸 |
| UI 焦點補測 | 原有移動／戰鬥 2 passed，展示退出 1 failed；browser-final.log／browser-focus-failure.json。移除測試手動 blur 後 Space 被核取方塊攔截，真實問題已保留 |
| 焦點修正後受影響回歸 | 1 passed／0 failed／0 skipped，展示男女全部動作、暫停、退出後 WASD／Space 落地；browser-focus-fix.log／browser-focus-fix.json。未無意義重跑未受影響的整套 9 項 |
| 比例近看修正後回歸 | 1 passed／0 failed／0 skipped，三角色、不同近看距離、6 次切換與資源計數通過；browser-portrait-fix.log／browser-portrait-fix.json |
| 來源完整性 | 固定版本 20 個來源檔 SHA-256 全部符合；source-verification.log。GLB 大小、骨架、三角形、材質編碼見 asset-metadata.json |
| 子路徑建置 | /canopy/ 正式輸出成功；依比例近看後重新建置，見 subpath-build-portrait.log |
| 子路徑真實瀏覽器 | 最終三角色與來源連結全部 HTTP 200，無主控台或 JS 錯誤；subpath-smoke-portrait.log。1280×800 最終截圖在 final-preview，三種人物臉部均完整可見 |
| 文件／diff | 34 項必要文件、37 份 Markdown 本地連結通過；docs-final.log。程式／自撰文件 diff 檢查通過；原始 logs／上游 README 保留原樣空白，不重寫證據；diff-final.log |

## 失敗與證據限制

- check-02.log 保存舊單元測試 MIN_DISTANCE > 2 與新 1.5 近看需求不一致的失敗。修正為明確的新距離契約；check-03 及後續 check 通過。數值檢查不宣稱證明所有動畫／方位不穿模。
- focus-failure 保留失敗畫面、錯誤上下文、原始 trace 事件及可重現 patch。完整 trace 約 29 MB 包含重複模型與連續 screencast；Git 留事件／網路／stack／測試原始碼的 trace-events.zip，不冒稱可完整離線重播。trace-manifest.json 記錄原 archive 雜湊與保留範圍。
- 子路徑功能通過仍發現 Sophia 大頭比例裁臉，保留 sophia-portrait-crop-before-fix.png；近看依角色設定距離與焦點，修正後已檢視回歸截圖確認整張臉可見，不以 HTTP 200 當作視覺通過。
- 上一輪 9 項全過後又修改焦點與短視窗 UI，因此將基線與補測分開記錄，不將舊結果寫成最終版本重新全跑。
- 子路徑第一次 smoke 在 APIRequestContext 直接讀相對 href 時失敗（測試缺 baseURL）；改讀瀏覽器解析後的絕對 href 再驗證相同 HTTP 200 斷言，原始失敗 log 保留。
- 建置保留主 JS 約 599 KB 的分塊警告，沒有抑制。

## 視覺驗收

評估者為實作 Agent，使用真實瀏覽器截圖：Rocketbox 男女近看具自然人體比例、平滑面部、皮膚、頭髮透明邊緣、服裝底色與法線；與 Sophia 可實際切換。曾淘汰 HVGirl 的明顯低面數切面，保留 rejected-hvgirl.png。

走跑使用不同真實 clip，測試亦比較骨架姿態。揮劍與跳躍為程序姿態，部分截圖恰在循環結束；應以動作狀態與連續操作共同判讀，不能以單圖證明完整動作。握姿、步幅與戰鬥動作仍需精修，使用者最終美術認可未取得。

遠端 GitHub Actions、獨立 Code Review、實體 GPU FPS／1% low、直接 XAMPP／Apache、公開部署：未驗證。沒有以模擬 WebGL 或預錄畫面替代渲染證據。
