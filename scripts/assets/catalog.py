#!/usr/bin/env python3
"""素材總表工具（只用標準函式庫）。

  python3 scripts/assets/catalog.py render   由 catalog.json 產生 CATALOG.md
  python3 scripts/assets/catalog.py verify   掃描 asset-library/raw/<id>/，記錄檔名、大小、SHA-256；
                                             已記錄的檔案若雜湊不符則報錯
  python3 scripts/assets/catalog.py find 字詞 依名稱、作者、授權、狀態、風格搜尋
"""
import hashlib
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / 'docs/asset-catalog/catalog.json'
MARKDOWN = ROOT / 'docs/asset-catalog/CATALOG.md'
RAW = ROOT / 'asset-library/raw'

STATUS = {
    'candidate': '候選',
    'downloaded': '已下載',
    'tested': '已測試',
    'adopted': '採用',
    'rejected': '淘汰',
    'backlog': '暫緩',
}
STYLE = {'dark-realism': '暗黑寫實', 'eastern': '日式／東方', 'any': '通用'}


def load():
    return json.loads(CATALOG.read_text(encoding='utf-8'))


def save(data):
    data['updated'] = date.today().isoformat()
    CATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b''):
            digest.update(chunk)
    return digest.hexdigest()


def cell(text):
    return str(text or '').replace('|', '\\|').replace('\n', ' ')


def render(data):
    lines = [
        '# 素材總表',
        '',
        '> 由 `scripts/assets/catalog.py render` 自 `catalog.json` 產生，請勿手改本檔。',
        f'> 最後更新：{data["updated"]}',
        '',
        '| ID | 名稱 | 類型 | 風格 | 狀態 | 作者 | 授權 | 面數 | 骨架 |',
        '|---|---|---|---|---|---|---|---|---|',
    ]
    for a in data['assets']:
        listed = a.get('listed', {})
        faces = f'{listed["faces"]:,}' if listed.get('faces') else ''
        lines.append('| {} | [{}]({}) | {} | {} | {} | {} | {} | {} | {} |'.format(
            a['id'], cell(a['name']), a['source']['url'], a['kind'], STYLE.get(a['style'], a['style']),
            STATUS.get(a['status'], a['status']), cell(a['source']['author']), cell(a['license']['name']),
            faces, cell(listed.get('rig', ''))))
    lines += ['', '## 逐項明細', '']
    for a in data['assets']:
        src, lic = a['source'], a['license']
        lines += [
            f'### {a["id"]} · {a["name"]}',
            '',
            f'- 來源：{src["platform"]} — {src["url"]}',
            f'- 作者：[{src["author"]}]({src["author_url"]})' + (f'，發布 {src["published"]}' if src.get('published') else ''),
            f'- 授權：[{lic["name"]}]({lic["url"]})，商用：{"可" if lic.get("commercial") else "否／待確認"}',
        ]
        if lic.get('attribution'):
            lines.append(f'- 署名文字：{lic["attribution"]}')
        if lic.get('caveats'):
            lines.append(f'- 注意：{lic["caveats"]}')
        if a.get('download'):
            dl = a['download']
            lines.append(f'- 下載選項：{dl["format"]}，{dl["size"]}，檔名 `{dl["file"]}`（{dl["requested"]}）；{dl["alternatives"]}')
        if a.get('notes'):
            lines.append(f'- 備註：{a["notes"]}')
        if a['files']:
            lines.append('- 檔案：')
            for f in a['files']:
                lines.append(f'  - `{f["path"]}` — {f["bytes"]:,} bytes，下載 {f["downloaded"]}，SHA-256 `{f["sha256"]}`')
        if a.get('verified'):
            v = a['verified']
            lines.append(f'- 實測骨架：{v["rig"]}；道具處理：{v["props"]}；處理後三角形 {v["triangles_after"]:,}')
        for o in a.get('outputs', []):
            lines.append(f'- 遊戲用檔：`{o["path"]}` — {o["bytes"]:,} bytes，SHA-256 `{o["sha256"]}`（{o["note"]}）')
        if a['tests']:
            lines.append('- 測試：')
            for t in a['tests']:
                lines.append(f'  - {t}')
        lines.append('')
    MARKDOWN.write_text('\n'.join(lines), encoding='utf-8')
    print(f'已寫入 {MARKDOWN.relative_to(ROOT)}（{len(data["assets"])} 項）')


def verify(data):
    errors = 0
    for a in data['assets']:
        folder = RAW / a['id']
        known = {f['path']: f for f in a['files']}
        if not folder.is_dir():
            for path in known:
                print(f'缺檔 {a["id"]}: {path}（原始檔不在 Git，可依來源重新下載）')
            continue
        for path in sorted(p for p in folder.rglob('*') if p.is_file()):
            rel = str(path.relative_to(RAW))
            digest = sha256(path)
            if rel in known:
                if known[rel]['sha256'] != digest:
                    print(f'雜湊不符 {rel}')
                    errors += 1
                continue
            a['files'].append({'path': rel, 'bytes': path.stat().st_size, 'sha256': digest,
                               'downloaded': date.today().isoformat()})
            if a['status'] == 'candidate':
                a['status'] = 'downloaded'
            print(f'新增 {rel}')
    save(data)
    render(data)
    return errors


def find(data, term):
    term = term.lower()
    for a in data['assets']:
        blob = json.dumps(a, ensure_ascii=False).lower()
        if term in blob:
            print(f'{a["id"]:4} {STATUS.get(a["status"], a["status"]):4} {a["name"]} — {a["source"]["author"]} — {a["license"]["name"]}')


if __name__ == '__main__':
    command = sys.argv[1] if len(sys.argv) > 1 else 'render'
    catalog = load()
    if command == 'render':
        render(catalog)
    elif command == 'verify':
        sys.exit(1 if verify(catalog) else 0)
    elif command == 'find' and len(sys.argv) > 2:
        find(catalog, sys.argv[2])
    else:
        print(__doc__)
        sys.exit(2)
