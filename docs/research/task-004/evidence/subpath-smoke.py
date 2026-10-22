"""以靜態 HTTP 驗證 /canopy/ 輸出；不冒稱直接執行 Apache。需 Python Playwright。"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=sys.argv[1]))
Thread(target=server.serve_forever,daemon=True).start()
evidence = Path(__file__).parent / 'final-preview'; evidence.mkdir(exist_ok=True)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
        page=browser.new_page(viewport={'width':1280,'height':800})
        errors=[]; responses=[]; states=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        page.on('response',lambda r:responses.append({'path':r.url.split(str(server.server_port))[-1],'status':r.status}))
        page.goto(f'http://127.0.0.1:{server.server_port}/canopy/?debug=1')
        page.wait_for_function('window.__CANOPY_DEBUG__?.frame > 3',timeout=60000)
        page.locator('#showcase').check()
        for character, path in [('female','rocketbox/female'),('male','rocketbox/male'),('sophia','sophia/sophia')]:
            page.locator(f'[data-character="{character}"]').click()
            page.wait_for_function('(id) => window.__CANOPY_DEBUG__.character.id === id',arg=character,timeout=60000)
            page.get_by_role('button',name='近看',exact=True).click()
            page.wait_for_function('Math.abs(window.__CANOPY_DEBUG__.camera.distance - window.__CANOPY_DEBUG__.camera.desiredDistance) < 0.02',timeout=30000)
            assert page.request.get(page.locator('.foot a').evaluate('(link) => link.href')).status==200
            state=page.evaluate('window.__CANOPY_DEBUG__');states.append(state)
            assert state['character']['loaded'] and state['showcase']
            assert any(r['path']==f'/canopy/models/{path}.glb' and r['status']==200 for r in responses)
            page.screenshot(path=str(evidence/(character+'-portrait.png')))
        assert all(r['status']<400 for r in responses),responses
        assert not errors,errors
        print(json.dumps({'subpath':'/canopy/','states':states,'responses':responses,'errors':errors,'note':'Python 靜態 HTTP server 模擬 XAMPP 子目錄，未直接啟動 Apache；真實 Chromium WebGL2 軟體渲染。'},ensure_ascii=False,indent=2))
        browser.close()
finally:
    server.shutdown();server.server_close()
