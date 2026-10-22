# Canopy Forge Lab

這是一項自主 AI 軟體工程實驗：用小型桌面瀏覽器 3D ARPG，研究 Agent 如何規劃、實作、測試、修正及留下可追溯的證據。工作流程與遊戲同為交付成果。

**目前是研究流程母版 v0.1，可切換 Rocketbox 寫實女性、寫實男性與 Sophia 動漫人物。具備人物展示模式及臉部近看；怪物與環境仍為占位模型，最終 ARPG 美術與完整戰鬥尚未驗收。**

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

控制：WASD／方向鍵移動、Shift 跑步、Space 跳躍、滑鼠左鍵／J 攻擊；Sketchfab 人物另有 J 連按三段連擊、K 二連擊、L 三連擊、Q 施法、按住 C 蹲走，攻擊會自動面向 7 公尺內的怪物，擊中後按方向可取消收招。滾輪可拉近／拉遠，右鍵拖曳環視，R 重設視角。預設鏡頭距離 7.5，最近 1.5，可近看臉部與服裝；移動方向依鏡頭方位計算。場景碰撞與玩家死亡流程仍待後續任務。

## 本機展示與 XAMPP

開發展示執行 npm ci、npm run dev，再用瀏覽器開啟終端機顯示的本機網址。
若放在 XAMPP 的 htdocs/canopy，先執行：

```bash
npm run build -- --base=/canopy/
```

將 dist 裡的所有內容（包括 assets 與 models 資料夾）放進 htdocs/canopy，再經 Apache 開啟 /canopy/。不要只複製 index.html。已以靜態 HTTP 伺服器驗證相同子目錄路徑，未在雲端直接執行 XAMPP／Apache。

## 人物選擇與展示

右側選擇 **艾琳（寫實女性）／里昂（寫實男性）／Sophia（動漫人物）**。按「近看」查看臉部，按「全身」比較比例；右鍵環視、滾輪縮放。

[寫實女性近看](docs/research/task-004/evidence/final-preview/female-portrait.png) · [寫實男性近看](docs/research/task-004/evidence/final-preview/male-portrait.png) · [Sophia 近看](docs/research/task-004/evidence/final-preview/sophia-portrait.png)

勾選「人物展示」會暫停戰鬥，可切換待機、步行、跑步、跳躍與揮劍。取消勾選即可回到遊戲。切換失敗會保留目前人物，可再選取重試。

兩位寫實角色來自 Microsoft Rocketbox（MIT），具正常人體比例、皮膚／髮絲／服裝貼圖及獨立走跑動畫。Sophia 來自 GDQuest（CC BY-NC-SA 4.0）。全部隨專案附上，不需執行時連外下載；來源、授權與可重建轉換腳本見 [資產紀錄](docs/ASSETS.md)。

現代服裝是人物品質研究用；跳躍／揮劍仍有程序動畫限制，不能視為最終 ARPG 裝備及動畫品質達標。

## 瀏覽器回歸

分兩層：`npm run test:browser:smoke`（4 項標記 @smoke，約 3 分鐘）供開發時檢查；`npm run test:browser`（全部 9 項，雲端軟體渲染約 11 分鐘）於推送前或 CI 執行。人物資產（骨頭、動畫、朝向、步態、揮劍方向、素材總表同步）由 `npm test` 在 Node 中檢查，數秒涵蓋全部角色。

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
遊戲 CI 執行安裝、型別、單元測試、建置及瀏覽器回歸。目前 9 項瀏覽器回歸涵蓋原有操作、人物與鏡頭，以及載入失敗處理。詳見 [task-004 測試報告](docs/research/task-004/TEST_REPORT.md)。遠端 CI 狀態未取得時不能推定通過。

## 文件檢查

Python 3 標準函式庫即可執行，無須安裝套件：

```bash
python3 scripts/check_docs.py
```

文件 CI 只證明必要文件及本地連結有效；遊戲檢查另由遊戲 CI 執行，兩者都不自動代表人物美術品質達標。

## 取得研究歷史

GitHub Download ZIP 只有單次檔案快照。要研究 commits，請取得完整 clone；離線封存可在已取得所需分支後使用 git bundle create canopy-forge-lab.bundle --all。Issue／PR 討論與遠端 CI artifacts 不會自動包含於 clone，重要結論與證據須同步到研究目錄。
