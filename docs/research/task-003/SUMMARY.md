# task-003 摘要

完成：以 GDQuest Sophia 骨架人物替換積木主角，加入材質／骨架動畫／手骨武器、近距離滾輪縮放、右鍵環視及 R 重設。維持原本小型場景。此版為風格化／Q 版改善，不宣稱最終寫實目標完成。

驗證：型別、正式建置、8 項單元與 6 項瀏覽器測試通過；/canopy/ 子路徑靜態服務 smoke 通過。保存原始觀察、修正、測試、截圖與資產來源。遠端 CI、實體 GPU 效能與實際 Apache 未驗證。

Git：直接 main，事前計畫 d0dffb7；實作提交可透過 git log --oneline -- docs/research/task-003 查閱，無任務分支或 PR。

展示：npm ci 後 npm run dev；滾輪拉近／拉遠，右鍵拖曳環視，R 重設。XAMPP 使用 npm run build -- --base=/canopy/，複製完整 dist（含 models）至 htdocs/canopy。

後續依使用者觀感精修人物風格與步態／揮劍，繼續完成碰撞與戰鬥。來源與授權見 docs/ASSETS.md 及 public/models/sophia，不把研究用途下的資產當作任意用途的無限制母版。
