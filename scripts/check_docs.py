"""檢查受版本控制的文件與本地 Markdown 連結；不驗證遊戲或外部網址。"""
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ('PLAN.md', 'EXECUTION.md', 'TEST_REPORT.md', 'REVIEW.md', 'SUMMARY.md')
required = ['README.md', 'AGENTS.md', 'docs/WORKFLOW.md', 'docs/TEMPLATE_GUIDE.md',
            'docs/MASTER_PLAN.md', 'docs/DECISIONS.md', 'docs/PROGRESS.md', 'docs/ASSETS.md',
            'docs/research/README.md']
required += ['docs/research/templates/' + name for name in RECORDS]
errors = []
for task in sorted((ROOT / 'docs/research').glob('task-*')):
    if task.is_dir():
        if not re.fullmatch(r'task-\d{3,}', task.name):
            errors.append(f'任務目錄編號無效：{task.name}')
        required += [str((task / name).relative_to(ROOT)) for name in RECORDS]
for name in required:
    path = ROOT / name
    if not path.is_file() or not path.read_text(encoding='utf-8').strip():
        errors.append(f'必要文件缺少或為空：{name}')
files = subprocess.check_output(
    ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], cwd=ROOT
).decode().split('\0')
count = 0
for name in sorted(set(files)):
    if not name.endswith('.md'):
        continue
    path = ROOT / name
    if not path.is_file():
        continue
    count += 1
    content = re.sub(r'```.*?```', '', path.read_text(encoding='utf-8'), flags=re.S)
    for match in re.finditer(r'\[[^\]]*\]\(([^)]+)\)', content):
        raw = match.group(1).strip()
        target = raw[1:raw.index('>')] if raw.startswith('<') else raw.split()[0]
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        if parsed.path.startswith('/'):
            errors.append(f'{name}：請使用可攜的相對連結：{target}')
            continue
        destination = (path.parent / unquote(parsed.path)).resolve()
        if not destination.is_relative_to(ROOT) or not destination.exists():
            errors.append(f'{name}：本地連結不存在或超出專案：{target}')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'通過：{len(required)} 項必要文件、{count} 份 Markdown 的行內本地連結。')
print('範圍限制：不驗證標題錨點、reference-style 連結、外部網址、內容正確性或遊戲功能。')
