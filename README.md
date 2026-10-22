# Canopy Forge Lab

這是一項自主 AI 軟體工程實驗：用小型桌面瀏覽器 3D ARPG，研究 Agent 如何規劃、實作、測試、修正及留下可追溯的證據。工作流程與遊戲同為交付成果。

**目前是研究流程母版 v0.1，主角已替換為有臉髮、服裝材質與骨架動畫的 Sophia 風格化人物；怪物與環境仍為占位模型，寫實人物與完整美術品質尚未驗收。**

## 閱讀入口

- [Agent 規則](AGENTS.md)
- [通用開發流程](docs/WORKFLOW.md)與[母版複用方式](docs/TEMPLATE_GUIDE.md)
- [本遊戲規格與階段](docs/MASTER_PLAN.md)
- [進度](docs/PROGRESS.md)、[技術決策](docs/DECISIONS.md)、[資產來源](docs/ASSETS.md)
- [研究索引](docs/research/README.md)與[任務模板](docs/research/templates/PLAN.md)

## 範圍

約 30–40 公尺的小型夜晚熱帶雨林、五棵主樹、少量植被、一位精緻骨架主角與一隻怪物。重點是人物、移動、跑步、跳躍及持刀攻擊，不製作大型地圖。

## 開發指令

使用 Node.js 24、npm、支援 WebGL2 的 Chrome 或 Edge。已提交 package-lock.json，請使用 npm ci 重現依賴。實測版本：TypeScript 5.9.3、Three.js 0.180.0、Vite 7.3.7。

```bash
npm ci
npm run check  # 型別、8 項單元測試、正式建置
npm run dev
# 如需檢查正式建置：npm run preview
```

控制：WASD／方向鍵移動、Shift 跑步、Space 跳躍、滑鼠左鍵／J 攻擊。滾輪可拉近／拉遠，右鍵拖曳環視，R 重設視角。預設鏡頭距離 7.5，最近 2.5，可近看臉部與服裝；移動方向依鏡頭方位計算。場景碰撞與玩家死亡流程仍待後續任務。

## 本機展示與 XAMPP

開發展示執行 npm ci、npm run dev，再用瀏覽器開啟終端機顯示的本機網址。
若放在 XAMPP 的 htdocs/canopy，先執行：

```bash
npm run build -- --base=/canopy/
```

將 dist 裡的所有內容（包括 assets 與 models 資料夾）放進 htdocs/canopy，再經 Apache 開啟 /canopy/。不要只複製 index.html。已以靜態 HTTP 伺服器驗證相同子目錄路徑，未在雲端直接執行 XAMPP／Apache。

## 人物與鏡頭預覽

[近距離臉部／服裝](docs/research/task-003/evidence/browser/character-close.png) · [右鍵環視](docs/research/task-003/evidence/browser/character-orbit.png) · [遊戲視角](docs/research/task-003/evidence/browser/character-default.png)

Sophia by GDQuest，CC BY-NC-SA 4.0；來源與修改見 [資產紀錄](docs/ASSETS.md)。本次為非商業研究展示。原始模型約 2.6 MB，隨專案提供，不需執行時連外下載。這版是風格化／Q 版人物；步行暫用跑步 clip 降速，攻擊為骨架疊加，後續仍需專門動作與更高品質美術評估。

## 瀏覽器回歸

```bash
# 一般開發機首次準備瀏覽器（Linux 可能需要系統依賴權限）
npx playwright install --with-deps chromium
npm run build
npm run test:browser

# 本雲端已有 Chromium，無須重複下載
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

測試自行啟動 4173 正式預覽，使用真實瀏覽器與遊戲時間；不模擬 WebGL、不快轉遊戲時鐘。冷卻壓力檢查在命中影格內派送重複鍵盤事件，其餘操作使用 Playwright 鍵盤／滑鼠輸入。
加上 ?debug=1 才會提供唯讀遊戲狀態供測試使用，沒有改位置或扣血的測試捷徑。畫面截圖與 trace 放在忽略的 test-results/，正式研究證據另外保存於任務目錄。

## 正式輸出與限制

npm run build 產生 dist/，可由支援靜態檔案的 HTTP 伺服器提供；npm run preview 用於本機驗證，非正式部署服務。預設部署網站根目錄；若使用子路徑，需設定 Vite base 後重建並驗證。尚未公開部署。
遊戲 CI 執行安裝、型別、單元測試、建置及瀏覽器回歸。目前 6 項瀏覽器回歸涵蓋原有操作、人物與鏡頭，以及載入失敗處理。詳見 [task-003 測試報告](docs/research/task-003/TEST_REPORT.md)。遠端 CI 狀態未取得時不能推定通過。

## 文件檢查

Python 3 標準函式庫即可執行，無須安裝套件：

```bash
python3 scripts/check_docs.py
```

文件 CI 只證明必要文件及本地連結有效；遊戲檢查另由遊戲 CI 執行，兩者都不自動代表人物美術品質達標。

## 取得研究歷史

GitHub Download ZIP 只有單次檔案快照。要研究 commits，請取得完整 clone；離線封存可在已取得所需分支後使用 git bundle create canopy-forge-lab.bundle --all。Issue／PR 討論與遠端 CI artifacts 不會自動包含於 clone，重要結論與證據須同步到研究目錄。
