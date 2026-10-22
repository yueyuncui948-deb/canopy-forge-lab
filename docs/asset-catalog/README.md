# 素材庫與來源紀錄

所有外部素材（人物、動畫、貼圖、音效）都在這裡登記：從哪裡來、誰做的、什麼授權、下載了哪些檔案。

## 檔案分工

| 位置 | 內容 | 進 Git |
|---|---|---|
| `docs/asset-catalog/catalog.json` | **總表唯一資料來源**：來源網址、作者、授權、署名文字、注意事項、檔案雜湊、測試結果 | ✅ |
| `docs/asset-catalog/CATALOG.md` | 由 catalog.json 自動產生的閱讀版表格，勿手改 | ✅ |
| `asset-library/raw/<ID>/` | 平台下載的原始 zip／fbx／glb，保持原樣不修改 | ❌（體積大、部分授權不允許再散布） |
| `asset-library/work/<ID>/` | 轉檔、減面、重新綁定的中間檔 | ❌ |
| `public/models/<名稱>/` | 最佳化後實際給遊戲載入的 GLB，附 NOTICE.txt | ✅（只放採用的） |

原始檔不進 Git，但 catalog.json 記有來源網址與 SHA-256，任何人都能重新下載並比對是不是同一份。

## ID 規則

- `A*` 暗黑寫實人物、`B*` 日式／東方人物、`M*` 動畫；之後可加 `E*` 敵人、`W*` 武器、`T*` 貼圖材質。
- ID 一旦分配不重用；淘汰的素材保留紀錄並把狀態改成 `rejected`，寫明原因。

## 狀態流程

`backlog 暫緩` → `candidate 候選` → `downloaded 已下載` → `tested 已測試` → `adopted 採用`／`rejected 淘汰`

## 常用指令

```bash
python3 scripts/assets/catalog.py verify     # 下載檔放進 asset-library/raw/<ID>/ 後，自動記錄大小與雜湊
python3 scripts/assets/catalog.py render     # 修改 catalog.json 後重新產生 CATALOG.md
python3 scripts/assets/catalog.py find 武士   # 依任何欄位搜尋
```

## 新增素材時必填

來源網址與平台 ID、作者與作者頁、授權名稱與連結、能否商用、署名文字、注意事項（例如參考他人概念設計）、取得日期。只寫在頁面上看得到的資訊；骨架、動畫等未經實測的內容，標明是「作者聲明」。
