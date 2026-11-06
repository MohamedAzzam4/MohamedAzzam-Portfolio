import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'audit' / 'canva'
OUT.mkdir(parents=True, exist_ok=True)
LINKS = ['m5w252v1tow3y1x', '2ghqgvclhwmbl2a', 're1u3357wsjhgso', 'qqkeiug2wwykrvc', '7gacm9kgxl7lgvs', 'tb0hrvee56vuo2i', '56b505f7sihrnrx']
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1600, 'height': 1100}, device_scale_factor=1)
    results = []
    for slug in LINKS:
        record = {'originalUrl': f'https://canva.link/{slug}'}
        try:
            page.goto(record['originalUrl'], wait_until='domcontentloaded', timeout=45000)
            page.wait_for_timeout(5000)
            record.update(url=page.url, title=page.title(), text=page.locator('body').inner_text()[:18000])
            record['images'] = page.locator('img').evaluate_all('(els) => els.map(e=>({src:e.src, alt:e.alt, w:e.width,h:e.height, naturalWidth:e.naturalWidth, parent:e.parentElement.outerHTML.slice(0,1500)}))')
            record['buttons'] = page.get_by_role('button').evaluate_all('(els)=>els.map(e=>({text:e.innerText,label:e.getAttribute("aria-label")}))')
            page.screenshot(path=str(OUT/f'{slug}.png'), full_page=True)
            (OUT/f'{slug}.html').write_text(page.content(),encoding='utf-8')
        except Exception as ex:
            record['error']=str(ex)
        results.append(record)
        (OUT/'inspection.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps({k:v for k,v in record.items() if k not in ['images']}, ensure_ascii=False), flush=True)
    browser.close()
