# Canopy Forge Lab

這是一項自主 AI 軟體工程實驗：用小型桌面瀏覽器 3D ARPG，研究 Agent 如何規劃、實作、測試、修正及留下可追溯的證據。工作流程與遊戲同為交付成果。

**目前是研究流程母版 v0.1，遊戲角色仍為幾何占位模型，遊戲建置與互動尚未驗收。**

## 閱讀入口

- [Agent 規則](AGENTS.md)
- [通用開發流程](docs/WORKFLOW.md)與[母版複用方式](docs/TEMPLATE_GUIDE.md)
- [本遊戲規格與階段](docs/MASTER_PLAN.md)
- [進度](docs/PROGRESS.md)、[技術決策](docs/DECISIONS.md)、[資產來源](docs/ASSETS.md)
- [研究索引](docs/research/README.md)與[任務模板](docs/research/templates/PLAN.md)

## 範圍

約 30–40 公尺的小型夜晚熱帶雨林、五棵主樹、少量植被、一位精緻骨架主角與一隻怪物。重點是人物、移動、跑步、跳躍及持刀攻擊，不製作大型地圖。

## 開發指令（待 task-002 實測）

需要近期 Node.js LTS、npm、支援 WebGL2 的 Chrome 或 Edge。目前宣告 TypeScript ~5.9.3、Three.js ^0.180.0、Vite ^7.1.0。
目前尚無 lockfile；首次依賴準備使用 npm install 並檢視產生的 lockfile，之後使用 npm ci。不要把以下指令當成已通過的測試紀錄。

```bash
npm install
npm run typecheck
npm run build
npm run dev
# 如需檢查正式建置：npm run preview
```

控制規格：WASD／方向鍵移動、Shift 跑步、Space 跳躍、滑鼠左鍵／J 攻擊。實際遊戲行為尚待瀏覽器驗證。

## 文件檢查

Python 3 標準函式庫即可執行，無須安裝套件：

```bash
python3 scripts/check_docs.py
```

文件 CI 只證明必要文件及本地連結有效，不證明遊戲可建置或視覺品質達標。

## 取得研究歷史

GitHub Download ZIP 只有單次檔案快照。要研究 commits，請取得完整 clone；離線封存可在已取得所需分支後使用 git bundle create canopy-forge-lab.bundle --all。Issue／PR 討論與遠端 CI artifacts 不會自動包含於 clone，重要結論與證據須同步到研究目錄。
