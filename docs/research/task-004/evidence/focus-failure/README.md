# 焦點失敗重現

在本任務完成版本的獨立研究副本中，可套用 reproduce.patch，再執行 npm run build 與 npm run test:browser -- --grep 展示暫停。此 patch 由實際修正的三行焦點變更反向建立，用於重現 Space 被核取方塊攔截；不是整個任務過程的自動快照。使用 git apply -R 同一 patch 還原。

原始失敗輸出見上一層 browser-final.log、browser-focus-failure.json。本目錄保留錯誤上下文與失敗截圖。trace-events.zip 保留原始 Playwright 事件、網路、stack 與測試原始碼，省略重複模型回應與逐幀 screencast；不是完整可離線重播的 archive。原完整 archive 雜湊與保留清單見 trace-manifest.json。
