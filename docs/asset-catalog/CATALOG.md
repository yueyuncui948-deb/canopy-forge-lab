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
| M1 | [Mixamo 刀劍動作包（占位）](https://www.mixamo.com) | animation | 通用 | 淘汰 | Adobe | Adobe Mixamo 使用條款 |  |  |
| M2 | [Universal Animation Library 2（Standard）](https://quaternius.itch.io/universal-animation-library-2) | animation | 通用 | 暫緩 | Quaternius | CC0 1.0 |  | Quaternius 通用人形骨架，可重新綁定 |
| M0 | [Xbot.glb（three.js r180 範例，Mixamo 骨架 idle/walk/run）](https://github.com/mrdoob/three.js/blob/r180/examples/models/gltf/Xbot.glb) | animation | 通用 | 淘汰 | three.js 範例（動作源自 Adobe Mixamo） | three.js 範例素材（Mixamo 內容） |  | Mixamo |

## 動畫庫（依類別）

檔名規則：`mx-<類別>-<動作>.fbx`（Mixamo）。原始下載檔名保留於「原始檔名」欄，原檔不進 Git。

| ID | 類別 | 動作 | 整理後檔名 | 原始檔名 | 影格 | 原地 | 根位移 | 狀態 |
|---|---|---|---|---|---|---|---|---|
| MX01 | 移動 | 持劍待機（Sword And Shield Idle） | `mx-move-idle.fbx` | Sword And Shield Idle.fbx | 77 | 否 | — | 採用 |
| MX02 | 移動 | 持劍走路（Sword And Shield Walk） | `mx-move-walk.fbx` | Sword And Shield Walk.fbx | 34 | 是 | — | 採用 |
| MX03 | 移動 | 持劍跑步（Sword And Shield Run） | `mx-move-run.fbx` | Sword And Shield Run.fbx | 22 | 是 | — | 採用 |
| MX04 | 移動 | 蹲下慢走（Walking Forward While Crouched） | `mx-move-crouch-walk.fbx` | Crouch Walk Forward.fbx | 35 | 是 | — | 採用 |
| MX05 | 跳躍 | 原地起跳（Sword And Shield Jump From Idle） | `mx-jump-stand.fbx` | Sword And Shield Jump.fbx | 30 | 否 | — | 採用 |
| MX06 | 跳躍 | 跑步跳（Sword And Shield Running Jump） | `mx-jump-run.fbx` | Sword And Shield Jump (1).fbx | 26 | 是 | — | 採用 |
| MX07 | 攻擊 | 單擊：下劈（Sword And Shield Downward Slash） | `mx-attack-slash-down.fbx` | Sword And Shield Slash.fbx | 46 | 否 | — | 採用 |
| MX08 | 攻擊 | 單擊：橫斬（Sword And Shield Cross Slash） | `mx-attack-slash-cross.fbx` | Sword And Shield Slash (1).fbx | 51 | 否 | — | 採用 |
| MX09 | 攻擊 | 連擊（劍盾）（Sword And Shield Slash Combo） | `mx-attack-combo-slash.fbx` | Sword And Shield Slash (2).fbx | 107 | 否 | 245 cm | 採用 |
| MX10 | 攻擊 | 單手劍連擊（One Handed Sword Combo Attack） | `mx-attack-combo-1h.fbx` | One Hand Sword Combo.fbx | 137 | 否 | 116 cm | 採用 |
| MX11 | 攻擊 | 雙手劍連擊（Two Handed Sword Combo Attack） | `mx-attack-combo-2h.fbx` | Two Hand Sword Combo.fbx | 99 | 否 | 188 cm | 採用 |
| MX12 | 施法 | 持劍短施法（Sword And Shield Spell Casting） | `mx-cast-quick.fbx` | Sword And Shield Casting.fbx | 32 | 否 | — | 採用 |
| MX13 | 施法 | 單手向前施法（Standing 1H Magic Attack 01） | `mx-cast-forward.fbx` | Standing 1H Magic Attack 01.fbx | 70 | 否 | — | 採用 |
| MX14 | 受擊 | 身體受擊（Sword And Shield Unblocked Impact） | `mx-hit-body.fbx` | Sword And Shield Impact.fbx | 30 | 否 | — | 採用 |
| MX15 | 受擊 | 頭部受擊（Sword And Shield Head Impact） | `mx-hit-head.fbx` | Sword And Shield Impact (1).fbx | 22 | 否 | — | 採用 |
| MX16 | 死亡 | 往前倒地（Sword And Shield Falling Forward Death） | `mx-death-forward.fbx` | Sword And Shield Death.fbx | 118 | 否 | 104 cm | 採用 |
| MX17 | 死亡 | 往後倒地（Sword And Shield Falling Back Death） | `mx-death-back.fbx` | Sword And Shield Death (1).fbx | 70 | 否 | 126 cm | 採用 |

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
- 遊戲用檔：`public/models/sketchfab/a1/model.glb` — 8,048,272 bytes，SHA-256 `6601f80855fbcbff699e1d15701e2613ed19b24ddf4e0d3fcaf2edbe044c9176`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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
- 遊戲用檔：`public/models/sketchfab/a2/model.glb` — 6,246,960 bytes，SHA-256 `e631786a916b195591ab36a3e96bc1d953b87d8cfda176b957c3979efda6d89a`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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
- 遊戲用檔：`public/models/sketchfab/a3/model.glb` — 3,412,812 bytes，SHA-256 `f48b8cb976c344bc030402253511e4e5669e3c8d6ea5b60122f9130079fec720`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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
- 遊戲用檔：`public/models/sketchfab/a4/model.glb` — 9,184,284 bytes，SHA-256 `3dd04cc8a5d82cab574e71675b0a74df1ad2a290972e1f764598631c6c66eb9f`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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
- 遊戲用檔：`public/models/sketchfab/b1/model.glb` — 5,562,824 bytes，SHA-256 `6a52d1c617f1b5b7ca9d44e927c6162ca58403ee04de05d8f906afcbd9889e05`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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
- 遊戲用檔：`public/models/sketchfab/b2/model.glb` — 13,159,992 bytes，SHA-256 `9728fcf475509449debd3eeb1f58926a9ec8a24dcd3d48303b6d5abf5dc25a8d`（Mixamo MX01–MX17、RootMotion、SwordGrip 解剖握點（task-009）、朝向 +Z、WebP≤2048、meshopt）
- 測試：
  - 2026-10-22 task-005：離線步態檢查 Walk/Run 著地腳 contactVz<0（向前走）
  - 2026-10-22 task-005：遊戲內 W/S/A/D 正面與移動方向 cos 0.988（>0.866 門檻）通過；SwiftShader 軟體渲染
  - 2026-10-22 task-007：改烘焙 Mixamo 17 段動作；走跑蹲步態、方向、擊中時刻於單元測試通過

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

### M1 · Mixamo 刀劍動作包（占位）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 備註：占位紀錄；2026-10-22 由實際下載的 MX01–MX17 取代。

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
- 備註：task-005 測試用；task-007 起由 Mixamo MX01–MX17 取代，已不再烘焙進遊戲模型。

### MX01 · 持劍待機（Sword And Shield Idle）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-move-idle.fbx` — 536,016 bytes，下載 2026-10-22，SHA-256 `7084c39e3155a233856080faa4b2c5a764618b50f0ad0edc12b2d19f68b4876b`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX02 · 持劍走路（Sword And Shield Walk）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-move-walk.fbx` — 383,600 bytes，下載 2026-10-22，SHA-256 `8fa46df23ca6d8bb969d5d53f01fcb79a03e0b3136faa0236d31d087b27a4b5f`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX03 · 持劍跑步（Sword And Shield Run）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-move-run.fbx` — 319,120 bytes，下載 2026-10-22，SHA-256 `469c976bc6eab8b0ff08ef05df09f3a5161e93938a9b9d3213bf8b9b687aa583`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX04 · 蹲下慢走（Walking Forward While Crouched）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-move-crouch-walk.fbx` — 390,944 bytes，下載 2026-10-22，SHA-256 `a46a438fc9ff1381abfc04b0cc991880149a65814984a8b05d472dd4e3d9a3f7`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX05 · 原地起跳（Sword And Shield Jump From Idle）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-jump-stand.fbx` — 357,424 bytes，下載 2026-10-22，SHA-256 `229b752d68b3cb4dc5cbf63b0e14bbc8a24f149eebe08b66d9f596d80ce2f86f`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX06 · 跑步跳（Sword And Shield Running Jump）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-jump-run.fbx` — 329,920 bytes，下載 2026-10-22，SHA-256 `30c8c8db7b298d4036909cb8ab4d423134e755958b330f8d83b2ccbe22ae86ea`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX07 · 單擊：下劈（Sword And Shield Downward Slash）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-attack-slash-down.fbx` — 387,664 bytes，下載 2026-10-22，SHA-256 `66d43d78a98a9d36850cbd7a6b9e196768fe4228d7be0590026e7a6d01741db9`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX08 · 單擊：橫斬（Sword And Shield Cross Slash）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-attack-slash-cross.fbx` — 397,424 bytes，下載 2026-10-22，SHA-256 `cc4f3f4cb8363556c369c3b33c1b9dd45d127031ea6491008b0b377a005deaac`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX09 · 連擊（劍盾）（Sword And Shield Slash Combo）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 備註：含根位移（向前移動），整合時需決定原地化或套用根位移。
- 檔案：
  - `MX/mx-attack-combo-slash.fbx` — 606,064 bytes，下載 2026-10-22，SHA-256 `82d2ce273568a708df1f93d64f822010c6c1ba5305f3f5944c677c8ac9fc0c33`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX10 · 單手劍連擊（One Handed Sword Combo Attack）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 備註：含根位移（向前移動），整合時需決定原地化或套用根位移。
- 檔案：
  - `MX/mx-attack-combo-1h.fbx` — 622,448 bytes，下載 2026-10-22，SHA-256 `5218fa2709170411503f9a60b9bc0519e691f8574867636eeb432fe4642ab965`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX11 · 雙手劍連擊（Two Handed Sword Combo Attack）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 備註：含根位移（向前移動），整合時需決定原地化或套用根位移。
- 檔案：
  - `MX/mx-attack-combo-2h.fbx` — 589,312 bytes，下載 2026-10-22，SHA-256 `ba29d2f95cd4ce1867243a451743300f0fea660ae2c5bd4d2e21867256cd74f7`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX12 · 持劍短施法（Sword And Shield Spell Casting）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-cast-quick.fbx` — 361,312 bytes，下載 2026-10-22，SHA-256 `97229c6ad6c9b4f70d033398ec831affac6f5b76629edc1adcda44709322aab0`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX13 · 單手向前施法（Standing 1H Magic Attack 01）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-cast-forward.fbx` — 522,048 bytes，下載 2026-10-22，SHA-256 `5e63cc06b91a82a55d615f431d87653f2c20111beae1950ecabd38d4f43f8a6f`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX14 · 身體受擊（Sword And Shield Unblocked Impact）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-hit-body.fbx` — 340,720 bytes，下載 2026-10-22，SHA-256 `fb93c144f2bc7a40f56ddce2205ea8d3efd7ce4e5a0e53f6c4bfd9867a971cdf`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX15 · 頭部受擊（Sword And Shield Head Impact）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 檔案：
  - `MX/mx-hit-head.fbx` — 321,376 bytes，下載 2026-10-22，SHA-256 `5afe02a88cf18a49489c24cb8a8ba32ee9787cccc65988f03ec5ad8916b0ee7b`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX16 · 往前倒地（Sword And Shield Falling Forward Death）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 備註：含根位移（向前移動），整合時需決定原地化或套用根位移。
- 檔案：
  - `MX/mx-death-forward.fbx` — 578,400 bytes，下載 2026-10-22，SHA-256 `04fbc8631e32c4a651cc4e038f282b86739a0518184c84ae2e47e741d9afbbb7`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過

### MX17 · 往後倒地（Sword And Shield Falling Back Death）

- 來源：Adobe Mixamo — https://www.mixamo.com
- 作者：[Adobe Mixamo](https://www.mixamo.com)
- 授權：[Adobe Mixamo 使用條款](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，商用：可
- 署名文字：Animations from Adobe Mixamo (mixamo.com)
- 注意：可用於專案（含商業）；原始 FBX 不單獨散布，不進公開 Git，只烘焙進角色模型。
- 備註：含根位移（向前移動），整合時需決定原地化或套用根位移。
- 檔案：
  - `MX/mx-death-back.fbx` — 448,720 bytes，下載 2026-10-22，SHA-256 `d93e8e543ebf2a6653209ae79951a5b81b28b5d1c859de43e8486607fb935fd0`
- 測試：
  - 2026-10-22 task-007：重新綁定至 A1–A4、B1、B2；朝向與步態／擊中時刻單元測試通過
