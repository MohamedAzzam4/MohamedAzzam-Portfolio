"""Integration checks for local preview or the deployed GitHub Pages site."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:5173/MohamedAzzam-Portfolio/'
OUT=ROOT/'audit/site'
OUT.mkdir(parents=True,exist_ok=True)
projects=json.loads((ROOT/'src/data/creative.json').read_text(encoding='utf8'))
assert len(projects)==7, f'Expected seven unique Canva projects, found {len(projects)}'
assert sum(len(p['pages']) for p in projects)==44
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
    errors=[]
    failed=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r: failed.append(f'{r.status} {r.url}') if r.status>=400 and BASE.split('/')[2] in r.url else None)
    response=page.goto(BASE,wait_until='networkidle')
    assert response.status==200
    expect(page.get_by_role('heading',level=1)).to_be_visible()
    expect(page.locator('.creative-card')).to_have_count(7)
    expect(page.get_by_role('link',name='Chat on WhatsApp')).to_have_attribute('href','https://wa.me/201097794098')
    for selector in ['#work','#creative','#about','#experience','#education','#contact']:
        page.locator(selector).scroll_into_view_if_needed()
        page.wait_for_timeout(250)
    # Every image and both source PDFs must resolve under the repository base path.
    assets={x['src'] for project in projects for x in project['pages']}
    assets.update(x['thumbnail'] for project in projects for x in project['pages'])
    assets.update(['assets/profile/mohamed-azzam.webp','assets/cv/Mohamed_Azzam_Master_CV_2026.pdf','assets/cv/Mohamed_Azzam_Content_Creation_CV.pdf'])
    for path in sorted(assets):
        res=page.request.get(BASE+path)
        assert res.status==200, f'{path}: {res.status}'
        if path.endswith('.pdf'): assert res.body().startswith(b'%PDF')
    for project in projects:
        page.goto(BASE+'#project/'+project['id'],wait_until='networkidle')
        dialog=page.get_by_role('dialog')
        expect(dialog).to_be_visible()
        expect(dialog.get_by_role('heading',name=project['title'],exact=True)).to_be_visible()
        expect(dialog.get_by_role('link',name='View Original on Canva')).to_have_attribute('href',project['originalUrl'])
        for i,design in enumerate(project['pages']):
            image=dialog.locator('.gallery-stage > img')
            expect(image).to_have_attribute('src', '/MohamedAzzam-Portfolio/'+design['src'])
            expect(image).to_be_visible()
            image.evaluate('(e)=>e.decode()')
            assert image.evaluate('(e)=>e.complete&&e.naturalWidth>0')
            if i<len(project['pages'])-1:
                dialog.get_by_role('button',name='Next design page',exact=True).click()
        if len(project['pages'])>1:
            dialog.get_by_role('button',name='View page 1',exact=True).click()
            expect(dialog.locator('.gallery-stage > img')).to_have_attribute('src','/MohamedAzzam-Portfolio/'+project['pages'][0]['src'])
            page.keyboard.press('ArrowRight')
            expect(dialog.locator('.gallery-stage > img')).to_have_attribute('src','/MohamedAzzam-Portfolio/'+project['pages'][1]['src'])
        page.keyboard.press('Escape')
        expect(dialog).to_have_count(0)
        assert page.evaluate('document.body.style.overflow')==''
    page.goto(BASE,wait_until='networkidle')
    for category in ['AI & ML','Data & Analytics','Software','All projects']:
        page.get_by_role('button',name=category,exact=True).click()
        expect(page.locator('.technical-card').first).to_be_visible()
    page.get_by_role('button',name='View all 9 projects').click()
    expect(page.locator('.technical-card')).to_have_count(9)
    for category in sorted({c for project in projects for c in project['categories']}):
        page.get_by_role('button',name=category,exact=True).click()
        expect(page.locator('.creative-card')).to_have_count(sum(category in project['categories'] for project in projects))
    page.get_by_role('button',name='All work',exact=True).click()
    page.goto(BASE,wait_until='networkidle')
    for width in [375,390,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for section in page.locator('main>section').all():
            section.scroll_into_view_if_needed()
            page.wait_for_timeout(150)
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'), f'Overflow at {width}px'
        # Exercise touch navigation at mobile sizes.
        if width<761:
            page.get_by_role('button',name='Open navigation',exact=True).click()
            expect(page.get_by_role('navigation',name='Main navigation')).to_be_visible()
            page.get_by_role('navigation').get_by_role('link',name='About',exact=True).click()
            expect(page.get_by_role('button',name='Open navigation',exact=True)).to_be_visible()
        page.locator('#home').scroll_into_view_if_needed()
        page.wait_for_timeout(350)
        page.screenshot(path=str(OUT/f'verified-{width}.png'),full_page=width in [390,1440])
    page.get_by_role('button',name='Switch to dark mode').click()
    page.reload(wait_until='networkidle')
    assert page.locator('html').get_attribute('class').find('dark')>=0
    page.screenshot(path=str(OUT/'verified-dark.png'))
    page.get_by_role('button',name='Switch to light mode').click()
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
    assert not errors, errors
    assert not failed, failed
    print(json.dumps({'base':BASE,'projects':len(projects),'galleryPages':sum(len(x['pages']) for x in projects),'assetsChecked':len(assets),'viewports':[375,390,768,1024,1440],'javascriptErrors':errors,'failedRequests':failed,'result':'PASS'},indent=2),flush=True)
    browser.close()
