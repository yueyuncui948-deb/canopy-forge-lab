# task-003 執行紀錄

日期：2026-10-22（Asia/Taipei），main。事前計畫 d0dffb7。

## 操作與選型

1. 讀取現行規格與程式，依使用者回饋將人物視覺提前，另納入滾輪近看。
2. 比較可取得公開資產：CesiumMan 有授權但造型偏測試用；Quaternius 原網站／下載入口受網路限制；Godot TPS 為機器人；GDQuest Sophia 具完整臉髮服裝與骨架，符合本次非商業研究與立即改善的需求。未下載整個大型場景。
3. 使用來源 repository 的 main SHA 固定下載 Sophia GLB 與 LICENSE；模型 2,635,436 bytes。保留原檔與 SHA-256，解析其 93 關節、19,086 三角形、貼圖尺寸及八個動畫名稱。
4. 新增 character/hero、sword、camera/follow-camera、zoom 模組。移除幾何主角，保留占位怪物；GLTFLoader 使用本地 BASE_URL 路徑，AnimationMixer 切換動作，劍連到右手骨架。
5. 改近預設鏡頭、加入滾輪、環視、R 重設，依鏡頭方位移動；加入人物材質環境光與可讀性補光，地形大小不變。
6. 首次實際截圖發現遊戲時間 -0.0866、攻擊冷卻非零，原因是非同步載入後首個 RAF timestamp 早於初始化。以 frameDelta 處理首影格與非負時間差；另外 debug frame 只計遊戲 render，不計環境貼圖 render。
7. 動態載入 GLTFLoader，將原本約 636 kB 單一 JS 分為約 593 kB 主檔與 44.8 kB loader；仍有 Vite 500 kB 提示，未提高門檻隱藏它。
8. 執行型別、建置與 8 項單元測試；6 項真實瀏覽器測試全過，保存人物近看／環視／跳躍及狀態證據。
9. 另以 /canopy/ base 建置至任務暫存目錄，以靜態 HTTP 伺服器模擬 XAMPP 子路徑，模型與貼圖載入成功。沒有宣稱實際測過 Apache。
10. 更新來源、授權、操作說明、研究文件與現行進度；直接 main 提交推送。

## 證據與限制

實際命令與退出碼見 evidence/commands.jsonl。資產細節見 asset-metadata.json；完整授權與署名隨 public/models/sophia 提供。
第一版人物是風格化／Q 版，與最終寫實目標不同；本輪取得使用者對非商業研究用途的明確說明，但未將風格化模型宣稱為最終視覺批准。
