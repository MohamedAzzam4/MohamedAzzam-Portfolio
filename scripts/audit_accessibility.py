import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:5173/MohamedAzzam-Portfolio/'
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    page=b.new_page(viewport={'width':1440,'height':1000})
    reports=[]
    for theme in ['light','dark']:
        page.goto(BASE,wait_until='networkidle')
        page.evaluate('(theme)=>{document.documentElement.classList.toggle("dark",theme==="dark");document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"))}',theme)
        page.wait_for_timeout(800)
        page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
        result=page.evaluate('async()=>await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}})')
        reports.append({'theme':theme,'violations':result['violations']})
    page.goto(BASE+'#project/m5w252v1tow3y1x',wait_until='networkidle')
    page.get_by_role('dialog').wait_for()
    page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
    result=page.evaluate('async()=>await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}})')
    reports.append({'theme':'gallery','violations':result['violations']})
    (ROOT/'audit/site/accessibility.json').write_text(json.dumps(reports,indent=2),encoding='utf8')
    print(json.dumps([{'theme':x['theme'],'violations':[{'id':v['id'],'impact':v['impact'],'nodes':[{'target':n['target'],'summary':n['failureSummary']} for n in v['nodes']]} for v in x['violations']]} for x in reports],indent=2),flush=True)
    b.close()
