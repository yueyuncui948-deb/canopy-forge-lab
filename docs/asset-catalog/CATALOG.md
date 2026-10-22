# 素材總表

> 由 `scripts/assets/catalog.py render` 自 `catalog.json` 產生，請勿手改本檔。
> 最後更新：2026-10-22

| ID | 名稱 | 類型 | 風格 | 狀態 | 作者 | 授權 | 面數 | 骨架 |
|---|---|---|---|---|---|---|---|---|
| A1 | [Cursed Knight - UE5 Character (Game Ready)](https://sketchfab.com/3d-models/f204e0ad3af645bcb0ecffd9e9ae9a15) | character | 暗黑寫實 | 已測試 | Blue-Spirit | CC BY 4.0 | 130,898 | 作者聲明以 UE5 骨架完整綁定與刷權重 |
| A2 | [Medieval Knight \| Sculpture \| Game ready](https://sketchfab.com/3d-models/6cdd055b4afa41eb9360dbbfe75c7f10) | character | 暗黑寫實 | 已測試 | by__Rx | CC BY 4.0 | 41,654 | Mixamo（作者說明 idle 動畫來自 Mixamo） |
| A3 | [Stelae knight](https://sketchfab.com/3d-models/0a795ae613f2496e955974ca37bf1e94) | character | 暗黑寫實 | 已測試 | Muru (muru) | CC BY 4.0 | 20,060 | 有骨架與 1 段動畫 |
| A4 | [Knight](https://sketchfab.com/3d-models/5a8eb53bbdee49b3906bf5decadb6c2b) | character | 暗黑寫實 | 已測試 | sanyaork | CC BY 4.0 | 52,492 | 標籤標示 rigged，未說明骨架類型 |
| B1 | [Shadowflame Samurai](https://sketchfab.com/3d-models/03def921ed814b3a9de5c5962b86a45c) | character | 日式／東方 | 已測試 | dark_igorek | CC BY 4.0 | 74,032 | Blender 製作並綁骨架（標籤 rig / rigged-character） |
| B2 | [samurai](https://sketchfab.com/3d-models/3876ba2ad649407a9fcdc30f9484c2aa) | character | 日式／東方 | 已測試 | Xiaoyuyao | CC BY 4.0 | 63,331 | 搜尋結果標示 rigged，未說明骨架類型 |
| B3 | [Spirit Realm Slayer](https://sketchfab.com/3d-models/28d4526546bc43c6b8cacb40c71739c0) | character | 日式／東方 | 暫緩 | Blue-Spirit | CC BY 4.0 | 237,915 | Sketchfab 版本無 |
| B4 | [Death Samurai Character](https://sketchfab.com/3d-models/6e0a7667723747e0972488085f877bd6) | character | 日式／東方 | 暫緩 | Alexandru Jardan | CC BY 4.0 | 194,259 | 無；T-pose 可交 Mixamo 自動綁定 |
| M1 | [Mixamo 刀劍動作包（待選定）](https://www.mixamo.com) | animation | 通用 | 暫緩 | Adobe | Mixamo / Adobe 使用條款 |  |  |
| M2 | [Universal Animation Library 2（Standard）](https://quaternius.itch.io/universal-animation-library-2) | animation | 通用 | 暫緩 | Quaternius | CC0 1.0 |  | Quaternius 通用人形骨架，可重新綁定 |
| M0 | [Xbot.glb（three.js r180 範例，Mixamo 骨架 idle/walk/run）](https://github.com/mrdoob/three.js/blob/r180/examples/models/gltf/Xbot.glb) | animation | 通用 | 採用 | three.js 範例（動作源自 Adobe Mixamo） | three.js 範例素材（Mixamo 內容） |  | Mixamo |

## 逐項明細

### A1 · Cursed Knight - UE5 Character (Game Ready)

- 來源：Sketchfab — https://sketchfab.com/3d-models/f204e0ad3af645bcb0ecffd9e9ae9a15
- 作者：[Blue-Spirit](https://sketchfab.com/Blue-Spirit)，發布 2024-02-02
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Cursed Knight - UE5 Character (Game Ready)" (https://sketchfab.com/3d-models/f204e0ad3af645bcb0ecffd9e9ae9a15) by Blue-Spirit, licensed under CC BY 4.0
- 注意：原創設計；標籤提及 darksouls/bloodborne 僅為風格參考。作者另售付費變體，不在本授權內。
- 下載選項：GLB（Sketchfab 轉檔）1K 貼圖，49MB，檔名 `cursed_knight_-_ue5_character_game_ready.glb`（2026-10-22）；另有 FBX 原檔 501MB、GLB 4K 449MB；採用後再取 4K 版本
- 備註：暗黑寫實首選；面數偏高，預計減面至約 5 萬。
- 檔案：
  - `A1/cursed_knight_-_ue5_character_game_ready.glb` — 52,177,624 bytes，下載 2026-10-22，SHA-256 `dc6a643a02e3f5fcb2799507fcf15a65ac77eee7eef5fc0899903590f9d2ccd1`
- 實測骨架：UE5 Mannequin（89 骨）；道具處理：護手、胸甲、褲、短劍、背負巨劍、盾、腰劍、劍鞘原未綁骨，已掛至 hand_l／spine／pelvis；處理後三角形 129,554
- 遊戲用檔：`public/models/sketchfab/a1/model.glb` — 7,696,824 bytes，SHA-256 `2ea3d8ea01afbb828f0e3435976b75b28ef3b65f367538e03857820270e9af09`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### A2 · Medieval Knight | Sculpture | Game ready

- 來源：Sketchfab — https://sketchfab.com/3d-models/6cdd055b4afa41eb9360dbbfe75c7f10
- 作者：[by__Rx](https://sketchfab.com/by__Rx)，發布 2023-12-22
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Medieval Knight | Sculpture | Game ready" (https://sketchfab.com/3d-models/6cdd055b4afa41eb9360dbbfe75c7f10) by by__Rx, licensed under CC BY 4.0
- 下載選項：glTF（Sketchfab 轉檔，zip），46MB，檔名 `medieval_knight__sculpture__game_ready.zip`（2026-10-22）；另有 FBX 原檔 70MB
- 備註：面數最輕；最可能直接相容 Mixamo 動畫。
- 檔案：
  - `A2/medieval_knight__sculpture__game_ready.zip` — 48,722,376 bytes，下載 2026-10-22，SHA-256 `6086c10d3949c19ff7a8406c8c28feefff2cbc46026ffbc496c7e544a0107310`
- 實測骨架：Mixamo（58 骨）；道具處理：無；處理後三角形 41,654
- 遊戲用檔：`public/models/sketchfab/a2/model.glb` — 5,895,716 bytes，SHA-256 `0fb42ccd61ad09f8645c1208af9c3c3ac1b1854d74753b51054a8c3dc289d050`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### A3 · Stelae knight

- 來源：Sketchfab — https://sketchfab.com/3d-models/0a795ae613f2496e955974ca37bf1e94
- 作者：[Muru (muru)](https://sketchfab.com/muru)，發布 2021-10-08
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Stelae knight" (https://sketchfab.com/3d-models/0a795ae613f2496e955974ca37bf1e94) by Muru, licensed under CC BY 4.0. Concept art by Shuohan (https://www.artstation.com/artwork/KE3Yr)
- 注意：外觀依 Shuohan 概念圖製作；模型為 CC BY，但商業使用前宜確認概念設計權利。
- 下載選項：GLB 2K 貼圖（原始最高解析度），34MB，檔名 `stelae_knight.glb（預期檔名）`（2026-10-22）；另有 FBX 原檔 64MB
- 備註：不死騎士與巨劍，輪廓強烈。
- 檔案：
  - `A3/stelae_knight.glb` — 36,121,400 bytes，下載 2026-10-22，SHA-256 `6ca6c6d2eb619fe36fdc718c191ecbef10b42a9a72c3269bac6af51515e8bc61`
- 實測骨架：Maya QuickRig／HumanIK（23 骨，無手指）；道具處理：立地巨劍（獨立 2 骨架）已移出；處理後三角形 18,826
- 遊戲用檔：`public/models/sketchfab/a3/model.glb` — 3,042,680 bytes，SHA-256 `034186c02a2dbb98c85dd5d017df62ef72e1832d1c5baa74a943fdddde8100cc`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### A4 · Knight

- 來源：Sketchfab — https://sketchfab.com/3d-models/5a8eb53bbdee49b3906bf5decadb6c2b
- 作者：[sanyaork](https://sketchfab.com/sanyaork)，發布 2021-07-19
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Knight" (https://sketchfab.com/3d-models/5a8eb53bbdee49b3906bf5decadb6c2b) by sanyaork, licensed under CC BY 4.0
- 下載選項：GLB 4K 貼圖，98MB，檔名 `knight.glb（預期檔名）`（2026-10-22）；另有 FBX 原檔 71MB、GLB 1K 23MB
- 備註：盔甲有髒污與血跡。
- 檔案：
  - `A4/knight.glb` — 103,368,052 bytes，下載 2026-10-22，SHA-256 `d97677713e61eaac444836bdd7a185a211f80c76e2cdd5370ae2b15cc4a5b808`
- 實測骨架：Blender IK 骨架（100 骨；手掌、腳趾由 IK 控制，已改跟隨烘焙）；道具處理：腰前長劍未綁骨，已移出；處理後三角形 43,998
- 遊戲用檔：`public/models/sketchfab/a4/model.glb` — 8,805,776 bytes，SHA-256 `d6eba1374989c665a7e4430817d383875cb19676fc3e8ec1ddc3f2ba71bdf75a`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### B1 · Shadowflame Samurai

- 來源：Sketchfab — https://sketchfab.com/3d-models/03def921ed814b3a9de5c5962b86a45c
- 作者：[dark_igorek](https://sketchfab.com/dark_igorek)，發布 2026-04-07
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Shadowflame Samurai" (https://sketchfab.com/3d-models/03def921ed814b3a9de5c5962b86a45c) by dark_igorek, licensed under CC BY 4.0
- 下載選項：GLB 1K 貼圖，27MB，檔名 `shadowflame_samurai.glb`（2026-10-22）；另有 FBX 原檔 163MB、GLB 4K 162MB；採用後再取 4K 版本
- 備註：使用者指定參考角色。
- 檔案：
  - `B1/shadowflame_samurai.glb` — 29,006,916 bytes，下載 2026-10-22，SHA-256 `eeb6e04ec7f7abfdd5043ff134464ab377612fdb4a2b7fce93495dbf40be5e9a`
- 實測骨架：Reallusion Character Creator（147 骨）；道具處理：手持武士刀未綁骨，已移出；腰間刀鞘為綁骨網格保留；處理後三角形 72,759
- 遊戲用檔：`public/models/sketchfab/b1/model.glb` — 5,215,844 bytes，SHA-256 `e376a620eae92797c273f72bc6adbef574f90381b1befefe610bc8d46e9fbaf3`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### B2 · samurai

- 來源：Sketchfab — https://sketchfab.com/3d-models/3876ba2ad649407a9fcdc30f9484c2aa
- 作者：[Xiaoyuyao](https://sketchfab.com/Xiaoyuyao)，發布 2018-09-01
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："samurai" (https://sketchfab.com/3d-models/3876ba2ad649407a9fcdc30f9484c2aa) by Xiaoyuyao, licensed under CC BY 4.0
- 注意：作者註明參考 @bookoflor 的設計、武士刀使用 @Glennosaurus 模型；商業使用前宜確認。
- 下載選項：GLB 2K 貼圖（原始最高解析度），92MB，檔名 `samurai.glb`（2026-10-22）；另有 FBX 原檔 89MB、GLB 1K 28MB
- 備註：紅色武士鎧甲，介面暱稱暫定 Red Samurai。
- 檔案：
  - `B2/samurai.glb` — 96,769,644 bytes，下載 2026-10-22，SHA-256 `fa5d3fba1780a859e0618ad468fb6af6047baaeada8bad4c68e4b21519551082`
- 實測骨架：自訂（96 骨，含甲冑與繩結骨）；道具處理：兩把刀與展示底座已移出；處理後三角形 54,741
- 遊戲用檔：`public/models/sketchfab/b2/model.glb` — 12,832,012 bytes，SHA-256 `66d97ec79cc1cc7fde4dad938457b68a0e556690a07a25a546b2c0c15e7cbf5a`（Idle/Walk/Run 測試動畫、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染

### B3 · Spirit Realm Slayer

- 來源：Sketchfab — https://sketchfab.com/3d-models/28d4526546bc43c6b8cacb40c71739c0
- 作者：[Blue-Spirit](https://sketchfab.com/Blue-Spirit)，發布 2023-08-17
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Spirit Realm Slayer" (https://sketchfab.com/3d-models/28d4526546bc43c6b8cacb40c71739c0) by Blue-Spirit, licensed under CC BY 4.0
- 注意：Sketchfab 版本無骨架；作者 ArtStation 另有免費綁骨架版（https://artstn.co/m/Jpern），其授權需另外確認。
- 備註：暫緩；本輪未下載。

### B4 · Death Samurai Character

- 來源：Sketchfab — https://sketchfab.com/3d-models/6e0a7667723747e0972488085f877bd6
- 作者：[Alexandru Jardan](https://sketchfab.com/AlexandruJardan)，發布 2023-08-24
- 授權：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，商用：可
- 署名文字："Death Samurai Character" (https://sketchfab.com/3d-models/6e0a7667723747e0972488085f877bd6) by Alexandru Jardan, licensed under CC BY 4.0
- 備註：暫緩；本輪未下載。

### M1 · Mixamo 刀劍動作包（待選定）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe](https://www.mixamo.com)
- 授權：[Mixamo / Adobe 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 注意：一般理解為可用於個人與商業專案、但不得單獨再散布動畫原檔；下載前須核對 Adobe 條款原文並記錄於此。下載需 Adobe 帳號。
- 備註：待使用者登入 Adobe 後下載 FBX Without Skin。

### M2 · Universal Animation Library 2（Standard）

- 來源：itch.io — https://quaternius.itch.io/universal-animation-library-2
- 作者：[Quaternius](https://quaternius.com)
- 授權：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)，商用：可
- 署名文字：Universal Animation Library 2 by Quaternius (CC0)
- 備註：免費版 42 段，含 3/4 段近戰連擊。

### M0 · Xbot.glb（three.js r180 範例，Mixamo 骨架 idle/walk/run）

- 來源：GitHub — https://github.com/mrdoob/three.js/blob/r180/examples/models/gltf/Xbot.glb
- 作者：[three.js 範例（動作源自 Adobe Mixamo）](https://github.com/mrdoob/three.js)
- 授權：[three.js 範例素材（Mixamo 內容）](https://github.com/mrdoob/three.js/blob/r180/LICENSE)，商用：否／待確認
- 注意：僅作 task-005 測試用重新綁定來源；Mixamo 內容不宜視為一般 MIT 授權。正式版改用使用者自行下載的 Mixamo（M1）或 CC0 UAL2（M2）。
- 備註：已烘焙進 A1–A4、B1、B2 測試版 GLB；不單獨提交原檔。
