# task-005 摘要

## 交付

六位 Sketchfab CC BY 候選人物（暗黑寫實 A1–A4、日式 B1–B2）加入人物選單。六種不同骨架重新綁定同一組 Idle／Walk／Run 測試動畫，正面統一朝 +Z；未綁骨盔甲件掛骨、散落武器與底座移出；349MB 原檔壓為 42MB（WebP、meshopt）。來源、授權、原檔與輸出雜湊見 [素材總表](../../asset-catalog/CATALOG.md)，可重現腳本在 scripts/assets/。

## 驗證

離線步態檢查與遊戲內 W／S／A／D 方向測試六位全部通過：人物正面與移動方向夾角約 9°，走跑時著地腳向後推，無倒走。型別、單元、建置通過。**既有 9 項瀏覽器回歸未重跑**（被中斷），詳見 [TEST_REPORT](TEST_REPORT.md)。

[離線四格截圖](evidence/offline/) · [遊戲內截圖](evidence/browser/)

## 未完成與後續

專門攻擊／跳躍動作、武器握持對位、正式動畫來源替換（Mixamo／UAL2）、A1 剛性褲片、A4 揮劍時手掌跟隨、高解析度貼圖版本（A1、B1 目前 1K）。

## Git 交付

直接提交 main。
