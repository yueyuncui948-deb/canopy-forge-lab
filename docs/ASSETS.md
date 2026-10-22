# 資產來源與授權

主角已使用 GDQuest Sophia 骨架人物。怪物、樹木與石頭仍為程序式占位圖形；持劍幾何由本專案建立。人物第一版屬風格化／Q 版，不代表最終寫實目標達標。

每個下載資產必須追加以下資訊：

| 欄位 | 要求 |
|---|---|
| 名稱／用途 | 人物、怪物、動畫、貼圖、音效等 |
| 來源與作者 | 原始 URL、創作者、取得日期 |
| 授權 | 授權名稱、可保存的依據、商業／再散布限制、署名要求 |
| 檔案 | 相對路徑、原始與最佳化 bytes、SHA-256 |
| 技術資料 | 三角形數、貼圖尺寸、骨架與動畫名稱 |
| 修改 | 轉檔、壓縮、重綁骨架等操作與工具版本 |
| 任務 | task 編號與相關 commit |

不提交未知授權或未取得散布權的資產。不得把套件授權推論為任意模型的授權。

## Sophia 主角（task-003）

- 作者／來源：GDQuest and contributors，https://github.com/gdquest-demos/godot-4-3D-Characters 。
- 固定來源版本：43e578402131fd4a5624bbfdc9e9b86a7b081bbf。
- 原始路徑：src/addons/gdquest_sophia/model/sophia.glb。
- 取得日期：2026-10-22；[來源 URL 與版本](../public/models/sophia/source.json)。
- 授權：CC BY-NC-SA 4.0；[上游完整授權](../public/models/sophia/LICENSE.txt)、[署名與整合修改](../public/models/sophia/NOTICE.txt)。非商業、署名、相同方式分享；使用者已確認本次為非商業研究。
- 檔案：public/models/sophia/sophia.glb，2,635,436 bytes，保持來源原檔不變，無另行壓縮。
- SHA-256：0f46e5b6621ee0c9889d8caa9a010264575f4bdf5800b10d89023b40ce9b95d2。
- 19,086 三角形、11,903 頂點（分材質 primitive 合計）、93 關節、4 個 skinned mesh primitive。
- 貼圖：2048² diffuse、1024² normal／roughness，另有眼睛與嘴部貼圖，全部內嵌於 GLB，無執行時外部 CDN。
- 原始動畫：Idle、Run、Jump、Fall、EdgeGrab、WallSlide、RunTiltL、RunTiltR。本版使用前四種；步行以 Run 降速，尚無專門 Walk clip。
- 修改：執行時調整尺寸至約 2.35 單位、動畫交叉淡入淡出、手骨掛劍、握姿與揮劍骨架疊加、材質環境光。人物衍生視覺／姿態依原 CC BY-NC-SA 4.0 條款提供。
- 武器：本專案自製細劍形狀、金屬／皮革材質，未匯入其他第三方模型。
- [完整資產數據](research/task-003/evidence/asset-metadata.json)。

Sophia 的形象不代表 GDQuest 背書本專案。未來複用流程母版時，資產授權須分開處理，不能因為程式可複用就視人物為無限制授權。
