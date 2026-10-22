# task-005 測試報告

## 已執行

| 項目 | 結果 | 證據 |
|---|---|---|
| `npm run check`（型別、單元、正式建置） | 通過 | 本機輸出；建置 chunk >500 kB 警告為既有 |
| 離線步態：六位 Walk／Run 著地腳 contactVz | 全部為負（Walk 約 −1.4～−2.1、Run 約 −1.6～−3.7）；A4 左腳 Walk −0.63 偏小但方向正確 | [offline/](evidence/offline/) 四格截圖 |
| 壓縮後重跑離線步態 | 數值與壓縮前一致 | 同上 |
| tests/browser/sketchfab.spec.ts（6 項） | 6/6 通過；每位 W／S／A／D 位移 1.94、cos 0.988（門檻 0.866）、clip Walk，Shift+W 為 Run，無主控台錯誤 | [browser/](evidence/browser/) |
| `python3 scripts/check_docs.py` | 通過 | — |

首次執行 6 項皆因 90 秒逾時失敗（軟體渲染約 22 FPS，遊戲時間推進慢）；放寬時限後重跑通過，斷言未降低。

## 未執行

- **既有 9 項瀏覽器回歸（game.spec.ts、gallery.spec.ts）未重跑**：執行中被使用者中斷（使用者詢問是否卡住）。本任務修改了 hero.ts、main.ts、catalog.ts，既有三角色的設定值維持原值，但未經實跑確認，不能宣稱無回歸。
- 實體 GPU 效能、遠端 CI、/canopy/ 子路徑部署。
- 揮劍：程序姿態沿用，新骨架軸向未個別調校；A4 揮劍時 handIK 不隨程序疊加的手臂旋轉（已知）。
