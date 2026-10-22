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

## Rocketbox 寫實人物（task-004）

- Female_Adult_01（介面暱稱「艾琳」）、Male_Adult_01（「里昂」）：Microsoft Rocketbox Avatar Library，Microsoft / Markus Wojcik 與 Rocketbox 原始創作團隊。
- 固定版本 `0943055db6ec570bcef9f2c8b41c9e5467c808f9`；上游 README 明確聲明人物庫於 2020 年改為 MIT。保留 [授權](../public/models/rocketbox/LICENSE.txt)、[原始 README](../public/models/rocketbox/UPSTREAM-README.txt)、[來源／修改聲明](../public/models/rocketbox/NOTICE.txt)與[輸入輸出雜湊](../public/models/rocketbox/source.json)。
- 原始男女各自 Idle／Walk／Run FBX 由 Blender 轉移並烘焙到人物骨架；不使用 Sophia 動作硬套其他骨架。法線與透明材質重建，頭部底色 2048，其餘 1024，不透明底色 JPEG、法線／透明 PNG。
- 女角 6,162,756 bytes，男角 5,596,036 bytes；只載入被選中的人物。保留 80 骨架節點與平滑網格；不是換色複製。原始 FBX／TGA 不加入 Git，可用[重建流程](../scripts/assets/README.md)按雜湊取得。
- 跳躍與揮劍為本專案程序姿態，並非來源提供的完整動捕片段。服裝為現代裝束，用於比例、臉部、材質與動作研究，尚非最終 ARPG 美術。
- HVGirl 曾試載，但近看仍有明顯低面數切面；保留 task-004 淘汰證據，沒有放入交付模型清單。淘汰截圖人物由 Babylon.js Assets 提供，[固定來源](https://github.com/BabylonJS/Assets/tree/c81f5d744fe8d41acfebd89eaeb7008c6f9659e3/meshes)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，改作僅本專案渲染、尺寸與掛劍。

## Sketchfab 候選人物 A1–A4、B1、B2（task-005）

六位 CC BY 4.0 人物，完整來源、作者、署名文字、注意事項、原檔與遊戲用檔 SHA-256 統一記於 [素材總表](asset-catalog/CATALOG.md)（資料來源 [catalog.json](asset-catalog/catalog.json)）。遊戲用檔在 public/models/sketchfab/<id>/，各附 NOTICE.txt。原始下載檔不進 Git（asset-library/raw/ 已忽略）。

- 修改：重新綁定 Idle／Walk／Run、朝向 +Z、未綁骨道具掛骨或移除、WebP ≤2048、meshopt；腳本見 scripts/assets/retarget_character.mjs、process_character.mjs。
- 測試動畫來源：three.js r180 範例 Xbot.glb（Mixamo 內容），僅作測試，正式版需替換為使用者自行下載的 Mixamo 或 CC0 UAL2。
- A1、B1 本輪為 1K 貼圖版本；A3、B2 外觀參考他人設計，商業化前需確認。
