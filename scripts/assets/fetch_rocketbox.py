"""python3 scripts/assets/fetch_rocketbox.py /tmp/rocket-source
僅下載 source.json 固定版本中的原始檔，核對 SHA-256；約 150 MB，不放進 Git。
"""
import concurrent.futures, hashlib, json, pathlib, sys, urllib.request
manifest=json.loads((pathlib.Path(__file__).resolve().parents[2]/'public/models/rocketbox/source.json').read_text())
root=pathlib.Path(sys.argv[1])
base='https://raw.githubusercontent.com/microsoft/Microsoft-Rocketbox/'+manifest['commit']+'/'
def fetch(record):
    target=root/record['path'];target.parent.mkdir(parents=True,exist_ok=True)
    data=target.read_bytes() if target.exists() else urllib.request.urlopen(base+record['path'],timeout=60).read()
    if hashlib.sha256(data).hexdigest()!=record['sha256']:raise ValueError('來源雜湊不符：'+record['path'])
    target.write_bytes(data);print(record['path'],len(data))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(fetch,manifest['files']))
