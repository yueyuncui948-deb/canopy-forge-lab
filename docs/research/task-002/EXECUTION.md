# task-002 執行紀錄

日期：2026-10-22（Asia/Taipei）。直接 main；事前計畫提交為 76d846c。

## 實際順序

1. 閱讀現行規則、規格、進度、原始碼與依賴；確認工作目錄乾淨。
2. npm install 安裝原始依賴並產生 lockfile。npm run build 實際失敗，保存 TS2339：monster.userData 不存在。
3. 安裝固定版本 @playwright/test 1.64.1；指定 Node 24，使用 Node 內建 test runner。
4. 抽取 src/combat/monster-life.ts，替換錯誤 userData 排程；死亡只排程一次、死後受擊無效。增加明確啟用的唯讀 debug 快照，不改場景規模。
5. 建立 5 項生命週期單元測試及 3 項正式建置瀏覽器測試。npm ci、型別、單元與正式建置通過。
6. 第一輪瀏覽器測試 1 通過、2 失敗：測量含 RPC 耗時，且重複按鍵可能在冷卻後才送達。保留原始 log、JSON 及失敗截圖。
7. 修正測試取樣：持續按鍵期間取位置／遊戲時間；同一命中影格檢查重複事件。未調低速度門檻，也未刪除冷卻斷言。第二輪 3 項全通過。
8. 使用現有 Chromium 真實 WebGL2／SwiftShader 繪製並保存場景、死亡與重生截圖。人工查看場景圖，記錄偏暗與樹冠遮擋，未宣稱視覺達標。
9. 啟動 Vite 開發服務，獨立 smoke 確認 HTTP 200、WebGL2、無 pageerror，普通頁面不提供 debug 快照。
10. 建立遊戲 CI、更新 README 與研究報告；保存雲端 install_script 與 start_skill 草稿（工具回覆 saved、requires_publish=true），未發布環境。

## 操作證據

實際命令、時間、工作目錄、退出碼、當時 HEAD 與差異雜湊見 evidence/commands.jsonl。每個步驟的原始輸出保存在同目錄。開發服務以 npm run dev -- --host 127.0.0.1 --port 5173 --strictPort 啟動。

## 限制

本輪沒有完整模組重構、修正鏡頭方向、場景碰撞、玩家死亡或美術替換。第一輪失敗是測試取樣缺陷；遊戲仍存在既有時間步進上限造成的低 FPS 慢速，已列後續工作。

## 交付補記

實作 commit 93fa36b 已推送，遠端 main SHA 與本機一致。提交前完整暫存差異的空白檢查發現 versions.log 的原始 npm 輸出帶結尾空行；先前未暫存檢查未涵蓋此新檔。此為證據輸出格式，保留原檔，不涉及程式錯誤；另檢查排除原始 evidence 的程式／設定／文件差異。
