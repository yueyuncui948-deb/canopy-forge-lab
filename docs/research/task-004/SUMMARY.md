# task-004 摘要

## 交付

新增 Rocketbox 自然比例男女，與既有 Sophia 共三個不同角色，可從中文介面切換。臉部、頭髮與服裝材質隨模型本地提供；按角色比例近看、全身、右鍵環視與滾輪縮放。展示模式暫停戰鬥，提供待機、走、跑、跳、揮劍比較，退出後回到遊戲控制。

切換成功才替換，失敗保留原人物，快速改選以最後請求為準；卸載釋放舊資源。保持原小型場景。新增約 11.8 MB 模型，按選取載入；保留固定來源、授權、輸入輸出雜湊與 Blender／影像轉換腳本。

## 驗證與研究價值

8 項單元／型別／建置通過，完整瀏覽器基線 9 項通過。補測抓到退出展示後 Space 被核取方塊攔截，修正聚焦 canvas 並重跑通過；真實截圖又抓到 Sophia 共用近看設定會裁臉，依比例修正並重跑切換通過。最終 /canopy/ 靜態子路徑三角色與來源連結均成功載入，無 JS／主控台錯誤（未直接執行 Apache）。完整過程、失敗證據與重現 patch 保存，沒有只保留成功結論。詳見 [TEST_REPORT](TEST_REPORT.md) 與 [EXECUTION](EXECUTION.md)。

[寫實女性](evidence/final-preview/female-portrait.png) · [寫實男性](evidence/final-preview/male-portrait.png) · [Sophia](evidence/final-preview/sophia-portrait.png)

## 未完成與後續

現代服裝先用於人物研究；ARPG 裝備、握劍手指、步幅匹配與專門跳躍／攻擊動畫仍需精修。未以本任務完成宣稱整個 P3 或遊戲完成。怪物、碰撞、玩家死亡等既有問題保留。硬體 GPU 效能、獨立審查、遠端 CI、直接 Apache 執行未驗證。

## Git 交付

直接在 main，沒有分支或 PR。功能提交 [f7e7301](https://github.com/yueyuncui948-deb/canopy-forge-lab/commit/f7e730137cbe567248ba2636cfe542f1e1dbe02a) 已推送 origin/main，git ls-remote 核對一致。後續僅追加本交付紀錄；遠端 Actions 未取得結果，不宣稱 CI 通過。
