import json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
items=json.loads((ROOT/'audit/canva/inspection.json').read_text(encoding='utf8'))
results=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    page=b.new_page(viewport={'width':2200,'height':1600},device_scale_factor=1)
    for item in items:
        slug=item['originalUrl'].rsplit('/',1)[1]
        record={'id':slug,'originalUrl':item['originalUrl'],'resolvedUrl':item['url'],'canvaTitle':item['title'],'pages':[]}
        try:
            url=item['url']
            if '/edit?' in url:
                url=url.split('/edit?')[0]+'/view'
            page.goto(url,wait_until='domcontentloaded',timeout=45000)
            presentation='/edit?' in item['url']
            if presentation:
                page.get_by_role('button',name='Present full screen',exact=True).wait_for(timeout=30000)
                page.get_by_role('button',name='Present full screen',exact=True).click()
            page.get_by_role('button',name='More',exact=True).wait_for(timeout=30000)
            page.wait_for_timeout(2500)
            record['canvaTitle']=page.title()
            counter=page.get_by_role('button',name=re.compile(r'^Go to page'))
            count=int(re.findall(r'\d+',counter.inner_text())[-1]) if counter.count() else 1
            record['pageCount']=count
            if not presentation:
                page.get_by_role('button',name='More',exact=True).click()
                page.get_by_text('Hide controls',exact=True).click()
            folder=ROOT/'public/assets/creative'/slug
            folder.mkdir(parents=True,exist_ok=True)
            for i in range(count):
                page.wait_for_timeout(1800)
                design=page.locator('div._mXnjA').filter(visible=True).first
                design.wait_for(state='visible')
                page.evaluate('document.fonts.ready')
                design.locator('img').evaluate_all('(els)=>Promise.all(els.map(e=>e.complete?Promise.resolve():new Promise(r=>{e.onload=r;e.onerror=r})))')
                png=folder/f'page-{i+1:02}.png'
                design.screenshot(path=str(png),timeout=20000)
                img=Image.open(png).convert('RGB')
                webp=png.with_suffix('.webp')
                img.save(webp,'WEBP',quality=90,method=6)
                record['pages'].append({'src':str(webp.relative_to(ROOT/'public')).replace('\\','/'),'width':img.width,'height':img.height,'alt':f"{record['canvaTitle']} — page {i+1}",'text':design.inner_text()[:14000]})
                png.unlink()
                print(f"CAPTURED {slug} {i+1}/{count} {img.size}",flush=True)
                if i<count-1:
                    if not presentation:
                        page.get_by_role('button',name='Show controls',exact=True).click()
                    page.get_by_role('button',name=re.compile(r'^Next page')).click()
                    page.wait_for_timeout(600)
                    counter=page.get_by_role('button',name=re.compile(r'^Go to page'))
                    assert int(re.findall(r'\d+',counter.inner_text())[0])==i+2, 'Wrong Canva page selected'
                    if not presentation:
                        page.get_by_role('button',name='More',exact=True).click()
                        page.get_by_text('Hide controls',exact=True).click()
            record['status']='captured'
        except Exception as ex:
            record['status']='blocked'
            record['error']=str(ex)
            record['pageText']=page.locator('body').inner_text()[:4000]
            print(f'BLOCKED {slug}: {record["pageText"][:200]}',flush=True)
        results.append(record)
        (ROOT/'audit/canva/captures.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
    b.close()
