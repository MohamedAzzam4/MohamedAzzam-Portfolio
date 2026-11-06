"""Build the public gallery index from verified Canva captures."""
import json
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
META={
 'm5w252v1tow3y1x': ('Daily Routine Guide','Educational Content',['Educational Content','Graphic Design'],'A six-page Arabic guide combining a training introduction, routines and practical instructional layouts. Green accents, illustrated graphics and structured typography keep the information approachable.'),
 '2ghqgvclhwmbl2a': ('Transform Your Body & Mind','Social Media',['Social Media','Graphic Design'],'A three-page collection of fitness promotional designs, combining bold type, green lighting effects and training imagery. The supplied Canva title is “Transforme1”.'),
 're1u3357wsjhgso': ('Change Your Life','Social Media',['Social Media','Graphic Design'],'A three-page fitness design collection with transformation messaging, layered photography and bold promotional layouts. Display title is taken from the artwork; the original Canva file is untitled.'),
 'qqkeiug2wwykrvc': ('Muscle Power','Social Media',['Social Media','Graphic Design'],'A fitness poster using a dark red palette, strong typographic hierarchy and bodybuilding imagery to present training services. Original sample text and contact placeholders remain unchanged in the artwork.'),
 '7gacm9kgxl7lgvs': ('Push / Pull / Legs','Educational Content',['Educational Content','Graphic Design'],'A six-page Arabic workout guide with a push / pull / legs structure, illustrated training imagery and organized exercise information. Original Canva title: Full-Training-PDF.'),
 'tb0hrvee56vuo2i': ('Teacher → Student Models','Technical Content',['Technical Content'],'A technical explainer visual contrasting a GPT-4o-mini teacher model with a Qwen 2.5 1.5B student model. Created to support a technical LinkedIn explanation, as documented in the content creation CV.'),
 '56b505f7sihrnrx': ('AI for Everyone','Presentations',['Presentations','Educational Content'],'A 24-slide presentation introducing artificial intelligence and practical uses, including productivity, research, language learning and workflows. Original slide designs are shown in full.'),
}
captures=json.loads((ROOT/'audit/canva/captures.json').read_text(encoding='utf8'))
projects=[]
for item in captures:
    if item['status']!='captured':
        print('NOT CAPTURED',item['id'])
        continue
    title,category,categories,description=META[item['id']]
    pages=[]
    for n,page in enumerate(item['pages'],1):
        path=ROOT/'public'/page['src']
        im=Image.open(path)
        im.thumbnail((640,640))
        thumb=path.with_name(path.stem+'-thumb.webp')
        im.save(thumb,'WEBP',quality=83,method=6)
        pages.append({**{k:v for k,v in page.items() if k!='text'},'alt':f'{title} — original design, page {n}','thumbnail':str(thumb.relative_to(ROOT/'public')).replace('\\','/')})
    projects.append({'id':item['id'],'title':title,'canvaTitle':item['canvaTitle'].replace(' - Instagram Post (4:5)','').replace(' - Presentation',''),'category':category,'categories':categories,'description':description,'originalUrl':item['originalUrl'],'medium':'image','thumbnail':pages[0]['thumbnail'],'tags':['Canva',category],'pages':pages})
(ROOT/'src/data/creative.json').write_text(json.dumps(projects,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Prepared {len(projects)} projects / {sum(len(p["pages"]) for p in projects)} pages')
