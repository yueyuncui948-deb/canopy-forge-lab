# 人物資產重建

一般展示不需要 Blender 或 Python，GLB 已放在 public/models/rocketbox。以下僅供研究者重建來源處理流程。

環境：Blender 4.3.2、Python 3、Pillow。固定來源版本與輸入／輸出雜湊見 [source.json](../../public/models/rocketbox/source.json)。

```sh
python3 scripts/assets/fetch_rocketbox.py /tmp/rocket-source
blender -b -t 2 --python scripts/assets/convert_rocketbox.py -- /tmp/rocket-source /tmp/rocket-output
python3 scripts/assets/optimize_glb.py /tmp/rocket-output/female.glb /tmp/rocket-output/male.glb
```

FBX 使用不同休止姿勢，不能直接共用 local quaternion。轉換以世界空間 Copy Rotation 約束烘焙到人物骨架；骨盆僅複製世界 Z，高度保留、水平移動交給遊戲。Idle／Walk／Run 分別烘焙為 NLA 動畫。三種動作均來自原始庫，跳躍與揮劍則在 TypeScript 疊加程序姿態。

材質重新連結原始底色／法線，取消 FBX 灰色乘數與不適用的舊高光設定。頭部底色保留 2048，其餘貼圖縮為 1024；不透明底色轉 JPEG 92，透明頭髮和法線保持 PNG。保留高精度網格與 80 個骨架節點，沒有網格簡化。

以實際渲染檢查任何重建輸出；不同 Blender／圖像編碼版本可能造成位元組差異。不要以成功匯出代替視覺與動作驗收。

## Sketchfab 人物流程（task-005）

工具依賴不加入專案 package.json，於任意暫存目錄安裝：`npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer sharp three@0.180.0 playwright-core`，並把下列腳本複製過去執行。

1. `node inspect_glb.mjs <file>`：骨架、動畫、網格、貼圖。
2. `XBOT_GLB=<Xbot.glb> node retarget_character.mjs <rig> <in> <out>`：rig 為 ue5／mixamo／quickrig／blenderik／cc／wushi。
3. `node process_character.mjs <ID> <in> <out>`：道具掛骨／移除與壓縮。
4. `verify_motion.html` + `node verify_motion.mjs <ID> <左腳,右腳> <glb>`：四格截圖與著地腳方向（需本機 HTTP 伺服器於 8765）。
