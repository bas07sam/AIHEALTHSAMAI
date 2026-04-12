#!/usr/bin/env python3
"""
Build SCORM 1.2 .zip packages for all 5 modules.
- Module 1: Uses existing index.html with images replaced by base64 data URIs
- Modules 2-5: Generate new interactive HTML with activities + quiz
All packages include imsmanifest.xml for SCORM 1.2 compliance.
"""

import os, io, json, base64, zipfile, tarfile, shutil, re
from PIL import Image

OUTPUT_DIR = 'scorm-packages'

def compress_image(path, max_width=500, quality=65):
    img = Image.open(path)
    if img.mode in ('RGBA', 'P'):
        bg = Image.new('RGB', img.size, (255,255,255))
        if img.mode == 'P': img = img.convert('RGBA')
        bg.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
        img = bg
    elif img.mode != 'RGB': img = img.convert('RGB')
    w, h = img.size
    if w > max_width:
        ratio = max_width / w
        img = img.resize((max_width, int(h*ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=quality, optimize=True)
    return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('ascii')}"

def load_all_images():
    imgs = {}
    for d in ['scorm-module1/images', 'public/images']:
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.endswith('.png'):
                    key = f.replace('.png','')
                    if key not in imgs:
                        imgs[key] = compress_image(os.path.join(d, f))
    return imgs

def make_manifest(module_id, title):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{module_id}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
    http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>{title}</title>
      <item identifier="item_1" identifierref="res_1">
        <title>{title}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>'''

def fix_module1_images(html, images):
    """Replace image src paths with base64 data URIs in module 1"""
    replacements = {
        'images/slide-automation-concept.png': images.get('slide-automation-concept',''),
        'images/slide-why-automation.png': images.get('slide-why-automation',''),
        'images/slide-trad-vs-ai.png': images.get('slide-trad-vs-ai',''),
        'images/slide-automation-types.png': images.get('slide-automation-types',''),
        'images/slide-task-automation.png': images.get('slide-task-automation',''),
        'images/slide-process-automation.png': images.get('slide-process-automation',''),
        'images/slide-intelligent-automation.png': images.get('slide-intelligent-automation',''),
    }
    for old, new in replacements.items():
        if new:
            html = html.replace(old, new)
    return html

def generate_module_html(mod, images):
    """Generate a complete self-contained interactive HTML for modules 2-5"""
    num = mod['number']
    img_uri = images.get(mod['image_key'], '')
    
    # Build activity data as JSON
    activities_json = json.dumps(mod['activities'], ensure_ascii=False)
    quiz_en_json = json.dumps(mod['quiz_en'], ensure_ascii=False)
    quiz_ar_json = json.dumps(mod['quiz_ar'], ensure_ascii=False)
    
    # Calculate total pages: slides + activities + 1 quiz
    n_activities = len(mod['activities'])
    total_pages = mod['total_slides'] + n_activities + 1
    
    # Build page types array
    page_types = ['slide'] * mod['total_slides']
    for act in mod['activities']:
        page_types.append(f"activity-{act['type']}")
    page_types.append('module-quiz')
    
    html = f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module {num}: {mod["title_en"]}</title>
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6;min-height:100vh}}
button{{cursor:pointer;font-family:inherit;border:none;background:none}}
img{{max-width:100%;height:auto;display:block;border-radius:12px}}
:root{{--cyan:#0891b2;--cyan-light:#ecfeff;--cyan-border:#a5f3fc;--emerald:#059669;--emerald-light:#ecfdf5;--violet:#7c3aed;--violet-light:#f5f3ff;--amber:#d97706;--amber-light:#fffbeb;--red:#dc2626;--red-light:#fef2f2;--slate:#64748b;--slate-light:#f1f5f9;--white:#fff;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.1)}}
[dir="rtl"] body{{font-family:'Segoe UI',system-ui,sans-serif}}
.app{{max-width:900px;margin:0 auto;padding:12px}}
.card{{background:var(--white);border:1px solid #e2e8f0;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}}
.card-header{{padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px}}
.card-body{{padding:16px;min-height:400px}}
.card-footer{{padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:space-between}}
.toolbar{{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}}
.toolbar h1{{font-size:14px;font-weight:700;color:#0f172a;flex:1}}
.badge{{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}}
.badge-cyan{{background:var(--cyan-light);color:var(--cyan)}}
.badge-emerald{{background:var(--emerald-light);color:var(--emerald)}}
.badge-amber{{background:var(--amber-light);color:var(--amber)}}
.badge-violet{{background:var(--violet-light);color:var(--violet)}}
.lang-btn{{padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid #e2e8f0;background:var(--white);color:var(--slate);transition:.2s}}
.lang-btn:hover{{background:var(--slate-light)}}
.progress-bar{{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-bottom:8px}}
.progress-fill{{height:100%;border-radius:999px;background:linear-gradient(90deg,#06b6d4,#0284c7);transition:width .5s ease}}
.nav-dots{{display:flex;gap:3px;justify-content:center;margin-bottom:8px;flex-wrap:wrap}}
.nav-dot{{width:8px;height:8px;border-radius:50%;background:#e2e8f0;border:none;transition:.2s;cursor:pointer}}
.nav-dot.active{{background:var(--cyan);transform:scale(1.3)}}
.nav-dot.visited{{background:#a5f3fc}}
.nav-dot.section-activity{{background:#fde68a}}
.nav-dot.section-quiz{{background:#a7f3d0}}
.btn{{padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;transition:.2s;display:inline-flex;align-items:center;gap:6px}}
.btn-primary{{background:var(--cyan);color:var(--white);box-shadow:0 1px 2px rgba(0,0,0,.15)}}
.btn-primary:hover{{background:#0e7490}}
.btn-primary:disabled{{background:#94a3b8;cursor:not-allowed}}
.btn-outline{{border:1px solid #e2e8f0;color:var(--slate);background:var(--white)}}
.btn-outline:hover{{background:var(--slate-light)}}
.btn-outline:disabled{{opacity:.4;cursor:not-allowed}}
.btn-success{{background:var(--emerald);color:var(--white)}}
.grid-2{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
@media(max-width:640px){{.grid-2{{grid-template-columns:1fr}}}}
.slide-title{{font-size:22px;font-weight:800;color:#0f172a;margin-bottom:6px;line-height:1.3}}
.slide-subtitle{{font-size:14px;color:var(--slate);margin-bottom:12px}}
.info-box{{padding:12px;border-radius:var(--radius);margin-bottom:12px;font-size:13px;line-height:1.7}}
.info-box.cyan{{background:var(--cyan-light);border:1px solid var(--cyan-border);color:#155e75}}
.info-box.violet{{background:var(--violet-light);border:1px solid #c4b5fd;color:#5b21b6}}
.info-box.amber{{background:var(--amber-light);border:1px solid #fcd34d;color:#92400e}}
.info-box.emerald{{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}}
.info-box.slate{{background:var(--slate-light);border:1px solid #cbd5e1;color:#334155}}
.tag{{display:inline-flex;padding:4px 14px;background:var(--slate-light);border-radius:12px;font-size:12px;font-weight:500;color:var(--slate);border:1px solid #e2e8f0}}
.click-card{{padding:12px;border-radius:var(--radius);border:2px solid #e2e8f0;cursor:pointer;transition:.2s;text-align:left}}
[dir="rtl"] .click-card{{text-align:right}}
.click-card:hover{{border-color:var(--cyan);box-shadow:var(--shadow)}}
.click-card.active{{background:var(--cyan-light);border-color:var(--cyan)}}
.click-card .card-title{{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px}}
.click-card .card-desc{{font-size:12px;color:var(--slate);line-height:1.5}}
.match-pool{{display:flex;flex-direction:column;gap:6px}}
.match-item{{padding:10px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:.2s;border:2px solid transparent;user-select:none}}
.match-item.left{{background:#f0f9ff;border-color:#bae6fd;color:#0c4a6e}}
.match-item.left.selected{{background:#06b6d4;color:#fff;border-color:#06b6d4}}
.match-item.right{{background:#faf5ff;border-color:#d8b4fe;color:#581c87}}
.match-item.right.selected{{background:#7c3aed;color:#fff;border-color:#7c3aed}}
.match-item.correct{{background:var(--emerald-light)!important;border-color:var(--emerald)!important;color:#065f46!important}}
.match-item:disabled,.match-item[disabled]{{cursor:default;opacity:.7}}
.flashcard-container{{perspective:800px;margin:0 auto;max-width:400px}}
.flashcard{{width:100%;min-height:200px;position:relative;cursor:pointer;transition:transform .6s;transform-style:preserve-3d}}
.flashcard.flipped{{transform:rotateY(180deg)}}
[dir="rtl"] .flashcard.flipped{{transform:rotateY(-180deg)}}
.flashcard-face{{position:absolute;inset:0;backface-visibility:hidden;border-radius:var(--radius);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}}
.flashcard-front{{background:linear-gradient(135deg,#06b6d4,#0284c7);color:var(--white);font-size:20px;font-weight:700}}
.flashcard-back{{background:var(--white);border:2px solid var(--cyan);color:#0f172a;transform:rotateY(180deg);font-size:14px;line-height:1.7}}
[dir="rtl"] .flashcard-back{{transform:rotateY(-180deg)}}
.flashcard-nav{{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px}}
.flashcard-counter{{font-size:13px;font-weight:600;color:var(--slate)}}
.quiz-option{{width:100%;text-align:left;padding:10px 14px;border-radius:8px;border:2px solid #e2e8f0;font-size:13px;transition:.2s;margin-bottom:6px;display:flex;align-items:center;gap:8px}}
[dir="rtl"] .quiz-option{{text-align:right}}
.quiz-option:hover:not(:disabled){{border-color:var(--cyan);background:var(--cyan-light)}}
.quiz-option.selected{{border-color:var(--cyan);background:var(--cyan-light);font-weight:600}}
.quiz-option.correct{{border-color:var(--emerald);background:var(--emerald-light);color:#065f46}}
.quiz-option.wrong{{border-color:var(--red);background:var(--red-light);color:#991b1b}}
.quiz-option:disabled{{cursor:default}}
.quiz-radio{{width:16px;height:16px;border-radius:50%;border:2px solid #cbd5e1;flex-shrink:0;display:flex;align-items:center;justify-content:center}}
.quiz-option.selected .quiz-radio{{border-color:var(--cyan);background:var(--cyan)}}
.quiz-option.selected .quiz-radio::after{{content:'';width:6px;height:6px;background:#fff;border-radius:50%}}
.quiz-result{{text-align:center;padding:16px;border-radius:var(--radius);margin-top:12px;font-weight:700;font-size:15px}}
.quiz-result.pass{{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}}
.quiz-result.fail{{background:var(--red-light);border:1px solid #fca5a5;color:#991b1b}}
@keyframes fadeIn{{from{{opacity:0;transform:translateY(12px)}}to{{opacity:1;transform:translateY(0)}}}}
.animate-in{{animation:fadeIn .4s ease forwards}}
.scorm-status{{position:fixed;bottom:8px;right:8px;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;z-index:999}}
[dir="rtl"] .scorm-status{{right:auto;left:8px}}
.scorm-status.connected{{background:#d1fae5;color:#065f46}}
.scorm-status.disconnected{{background:#fee2e2;color:#991b1b}}
.drag-pool{{display:flex;flex-direction:column;gap:6px}}
.drag-item{{padding:10px 14px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;border:2px solid #e2e8f0;background:#fff;user-select:none;transition:.2s}}
.drag-item:hover{{border-color:var(--cyan);background:var(--cyan-light)}}
.drag-item.placed{{background:var(--cyan-light);border-color:var(--cyan)}}
.drag-item.correct{{background:var(--emerald-light);border-color:var(--emerald);color:#065f46}}
.drag-item.wrong{{background:var(--red-light);border-color:var(--red);color:#991b1b}}
.order-slot{{padding:8px 12px;border:2px dashed #cbd5e1;border-radius:8px;font-size:12px;color:#94a3b8;min-height:40px;display:flex;align-items:center;margin-bottom:6px;transition:.2s;cursor:pointer}}
.order-slot.filled{{border-style:solid;border-color:var(--cyan);background:var(--cyan-light);color:#155e75;font-weight:500}}
</style>
</head>
<body>
<div class="app" id="app"></div>
<div class="scorm-status" id="scormStatus"></div>
<script>
/* SCORM 1.2 API */
const SCORM=(()=>{{let API=null;let connected=false;function findAPI(win){{let tries=0;while(win&&!win.API&&tries<10){{tries++;if(win.parent&&win.parent!==win)win=win.parent;else if(win.opener)win=win.opener;else break}}return win?.API||null}}function init(){{API=findAPI(window);if(!API&&window.opener)API=findAPI(window.opener);if(API){{const r=API.LMSInitialize('');connected=(r==='true'||r===true)}}updateUI();return connected}}function sv(k,v){{if(!API)return;API.LMSSetValue(k,String(v));API.LMSCommit('')}}function gv(k){{if(!API)return'';return API.LMSGetValue(k)}}function setScore(s){{sv('cmi.core.score.raw',s);sv('cmi.core.score.max',100);sv('cmi.core.score.min',0)}}function setStatus(s){{sv('cmi.core.lesson_status',s)}}function setLoc(l){{sv('cmi.core.lesson_location',l)}}function getLoc(){{return gv('cmi.core.lesson_location')||''}}function setSus(d){{sv('cmi.suspend_data',typeof d==='string'?d:JSON.stringify(d))}}function getSus(){{const d=gv('cmi.suspend_data');try{{return JSON.parse(d)}}catch(e){{return d||null}}}}function finish(){{if(API){{API.LMSCommit('');API.LMSFinish('')}}}}function updateUI(){{const el=document.getElementById('scormStatus');if(el){{el.textContent=connected?'SCORM Connected':'SCORM: Standalone';el.className='scorm-status '+(connected?'connected':'disconnected')}}}}return{{init,sv,gv,setScore,setStatus,setLoc,getLoc,setSus,getSus,finish,get connected(){{return connected}}}}}})();

/* ── MODULE DATA ── */
const MOD = {{
  num: {num},
  title_en: {json.dumps(mod['title_en'])},
  title_ar: {json.dumps(mod['title_ar'])},
  subtitle_en: {json.dumps(mod['subtitle_en'])},
  subtitle_ar: {json.dumps(mod['subtitle_ar'])},
  imgUri: {json.dumps(img_uri)},
  totalSlides: {mod['total_slides']},
  activities: {activities_json},
  quiz_en: {quiz_en_json},
  quiz_ar: {quiz_ar_json},
}};

const TOTAL_PAGES = {total_pages};
const PAGE_TYPES = {json.dumps(page_types)};

/* ── STATE ── */
const S = {{
  lang:'en', page:0, visited:new Set(),
  matchSel:{{left:null,right:null}}, matchPairs:[], matchDone:false,
  flashIdx:0, flashFlipped:false,
  dragOrder:[], dragChecked:false,
  quizAns:{{}}, quizSubmitted:false, quizScore:0,
}};

function t(key) {{ return S.lang==='ar' ? (key+'_ar') : (key+'_en'); }}
function isRTL() {{ return S.lang==='ar'; }}
function getAct(pageIdx) {{
  const slideCount = MOD.totalSlides;
  const actIdx = pageIdx - slideCount;
  return MOD.activities[actIdx] || null;
}}

/* ── LABELS ── */
const L = {{
  en: {{ mod:'Module', next:'Next', prev:'Previous', of:'of', submit:'Submit', tryAgain:'Try Again', check:'Check Answers', score:'Score', pass:'Congratulations! You passed!', fail:'You need 80% to pass. Review and try again.', passThreshold:'Pass: 80%', quiz:'Module Quiz', quizDesc:'Answer all 5 questions. 80% required.', matchDone:'All matched!', reset:'Reset', flip:'Tap to flip', checkOrder:'Check Order', answered:'answered', correct:'Correct!', tryAgainDrag:'Try Again' }},
  ar: {{ mod:'الوحدة', next:'التالي', prev:'السابق', of:'من', submit:'إرسال', tryAgain:'حاول مرة أخرى', check:'تحقق من الإجابات', score:'النتيجة', pass:'تهانينا! لقد نجحت!', fail:'تحتاج 80% للنجاح. راجع وحاول مرة أخرى.', passThreshold:'حد النجاح: 80%', quiz:'اختبار الوحدة', quizDesc:'أجب على جميع الأسئلة. تحتاج 80%.', matchDone:'تم المطابقة!', reset:'إعادة', flip:'اضغط للقلب', checkOrder:'تحقق من الترتيب', answered:'تمت الإجابة', correct:'صحيح!', tryAgainDrag:'حاول مرة أخرى' }}
}};
function l(k) {{ return L[S.lang][k] || k; }}

/* ── SLIDE CONTENT GENERATOR ── */
function slideContent(idx) {{
  const title = S.lang==='ar' ? MOD.title_ar : MOD.title_en;
  const sub = S.lang==='ar' ? MOD.subtitle_ar : MOD.subtitle_en;
  if (idx === 0) {{
    return '<div style="text-align:center">' +
      '<div class="badge badge-cyan" style="margin-bottom:12px">\\u{1F4E6} ' + l('mod') + ' ' + MOD.num + '</div>' +
      '<h2 class="slide-title">' + title + '</h2>' +
      '<p class="slide-subtitle">' + sub + '</p>' +
      (MOD.imgUri ? '<div style="max-width:400px;margin:16px auto"><img src="' + MOD.imgUri + '" alt="Module Image"></div>' : '') +
      '</div>';
  }}
  // Generic content slides with key concepts from activities/quiz
  const slideNum = idx + 1;
  const quizData = S.lang==='ar' ? MOD.quiz_ar : MOD.quiz_en;
  
  // Create informative content slides based on module topics
  if (idx < MOD.totalSlides - 1) {{
    // Content slides - show key learning points
    const qIdx = Math.min(idx - 1, quizData.length - 1);
    if (qIdx >= 0 && qIdx < quizData.length) {{
      const q = quizData[qIdx];
      const correctOpt = q.opts[q.correct];
      return '<div class="info-box cyan"><h3 style="font-size:16px;font-weight:700;margin-bottom:8px">' +
        (S.lang==='ar' ? '\\u{1F4D6} النقطة الرئيسية ' : '\\u{1F4D6} Key Point ') + slideNum + '</h3>' +
        '<p style="font-size:14px;margin-bottom:8px"><strong>' + q.q + '</strong></p>' +
        '<div class="info-box emerald" style="margin-top:8px"><strong>\\u2705 </strong>' + correctOpt + '</div>' +
        '</div>' +
        '<div class="info-box slate" style="margin-top:12px"><p style="font-size:12px">' +
        (S.lang==='ar' ? 'تذكر هذا المفهوم - سيظهر في الاختبار!' : 'Remember this concept - it will appear in the quiz!') +
        '</p></div>';
    }}
    return '<div class="info-box cyan"><h3 class="slide-title">' + title + '</h3><p class="slide-subtitle">' + sub + '</p></div>';
  }}
  
  // Last slide = Summary
  return '<div style="text-align:center"><h2 class="slide-title">' +
    (S.lang==='ar' ? '\\u{1F4CB} ملخص الوحدة' : '\\u{1F4CB} Module Summary') + '</h2>' +
    '<p class="slide-subtitle">' + (S.lang==='ar' ? 'مراجعة النقاط الرئيسية قبل الاختبار' : 'Review key points before the quiz') + '</p>' +
    '<div style="text-align:left;max-width:600px;margin:16px auto">' +
    quizData.map(function(q,i) {{
      return '<div class="info-box cyan" style="margin-bottom:8px"><strong>' + (i+1) + '. </strong>' + q.q + '<br><span style="color:var(--emerald);font-weight:600">\\u2705 ' + q.opts[q.correct] + '</span></div>';
    }}).join('') + '</div></div>';
}}

/* ── RENDER ── */
function render() {{
  const dir = isRTL()?'rtl':'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = S.lang;
  const p = S.page;
  const pType = PAGE_TYPES[p];
  S.visited.add(p);
  
  let headerLabel = '';
  let headerColor = 'badge-cyan';
  const title = S.lang==='ar' ? MOD.title_ar : MOD.title_en;
  
  if (pType==='slide') {{ headerLabel = (S.lang==='ar'?'\\u{1F4D6} الشريحة ':'\\u{1F4D6} Slide ') + (p+1); }}
  else if (pType.startsWith('activity')) {{ headerLabel = getAct(p)?.[t('title')]||'Activity'; headerColor='badge-amber'; }}
  else if (pType==='module-quiz') {{ headerLabel = l('quiz'); headerColor='badge-emerald'; }}
  
  const prevBtn = '<button class="btn btn-outline" '+(p===0?'disabled':'')+' onclick="goTo('+(p-1)+')">'+(isRTL()?'\\u2192':'\\u2190')+' '+l('prev')+'</button>';
  const nextBtn = p<TOTAL_PAGES-1
    ? '<button class="btn btn-primary" onclick="goTo('+(p+1)+')">'+l('next')+' '+(isRTL()?'\\u2190':'\\u2192')+'</button>'
    : '<button class="btn btn-success" disabled>\\u2713 '+l('score')+'</button>';
  
  let dots = '';
  for (let i=0;i<TOTAL_PAGES;i++) {{
    let cls = 'nav-dot';
    if (i===p) cls += ' active';
    else if (S.visited.has(i)) cls += ' visited';
    if (PAGE_TYPES[i].startsWith('activity')) cls += ' section-activity';
    else if (PAGE_TYPES[i]==='module-quiz') cls += ' section-quiz';
    dots += '<button class="'+cls+'" onclick="goTo('+i+')" title="'+(i+1)+'/'+TOTAL_PAGES+'"></button>';
  }}
  
  let bodyHTML = '';
  if (pType==='slide') bodyHTML = slideContent(p);
  else if (pType==='activity-match') bodyHTML = renderMatch(p);
  else if (pType==='activity-flashcard') bodyHTML = renderFlash(p);
  else if (pType==='activity-dragdrop') bodyHTML = renderDrag(p);
  else if (pType==='module-quiz') bodyHTML = renderQuiz();
  
  document.getElementById('app').innerHTML =
    '<div class="toolbar"><h1>'+l('mod')+' '+MOD.num+': '+title+'</h1>' +
    '<button class="lang-btn" onclick="toggleLang()">'+(S.lang==='en'?'\\u0627\\u0644\\u0639\\u0631\\u0628\\u064a\\u0629':'English')+'</button></div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(((p+1)/TOTAL_PAGES)*100)+'%"></div></div>' +
    '<div class="nav-dots">'+dots+'</div>' +
    '<div class="card"><div class="card-header"><span class="badge '+headerColor+'">'+headerLabel+'</span>' +
    '<span style="font-size:11px;color:#94a3b8;font-weight:600">'+(p+1)+' '+l('of')+' '+TOTAL_PAGES+'</span></div>' +
    '<div class="card-body animate-in" id="pageBody">'+bodyHTML+'</div>' +
    '<div class="card-footer">'+prevBtn+'<span style="font-size:11px;color:#94a3b8">'+(p+1)+'/'+TOTAL_PAGES+'</span>'+nextBtn+'</div></div>';
}}

/* ── MATCH ACTIVITY ── */
function renderMatch(pageIdx) {{
  const act = getAct(pageIdx);
  if (!act) return '';
  const pairs = S.lang==='ar' ? act.pairs_ar : act.pairs_en;
  const title = S.lang==='ar' ? act.title_ar : act.title_en;
  const desc = S.lang==='ar' ? act.desc_ar : act.desc_en;
  const matched = S.matchPairs;
  const done = S.matchDone;
  
  const leftItems = pairs.map(function(p,i){{ return {{text:p[0],idx:i}} }});
  const rightItems = pairs.map(function(p,i){{ return {{text:p[1],idx:i}} }});
  const rightShuffled = rightItems.slice().sort(function(a,b){{ return (a.idx+3)%6-(b.idx+3)%6 }});
  
  const isLM = function(i){{ return matched.some(function(m){{return m.left===i}}) }};
  const isRM = function(i){{ return matched.some(function(m){{return m.right===i}}) }};
  
  let html = '<div style="max-width:700px;margin:0 auto"><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p>';
  if (done) html += '<div class="info-box emerald" style="text-align:center;font-weight:700">\\u2705 '+l('matchDone')+'</div>';
  html += '<div class="grid-2"><div class="match-pool">';
  leftItems.forEach(function(item) {{
    const m = isLM(item.idx);
    const sel = S.matchSel.left===item.idx;
    html += '<button class="match-item left '+(m?'correct':'')+' '+(sel?'selected':'')+'" '+(m?'disabled':'')+' onclick="matchSel(\'left\','+item.idx+')">'+item.text+'</button>';
  }});
  html += '</div><div class="match-pool">';
  rightShuffled.forEach(function(item) {{
    const m = isRM(item.idx);
    const sel = S.matchSel.right===item.idx;
    html += '<button class="match-item right '+(m?'correct':'')+' '+(sel?'selected':'')+'" '+(m?'disabled':'')+' onclick="matchSel(\'right\','+item.idx+')">'+item.text+'</button>';
  }});
  html += '</div></div>';
  if (done) html += '<div style="text-align:center;margin-top:12px"><button class="btn btn-outline" onclick="resetMatch()">\\u{1F504} '+l('reset')+'</button></div>';
  html += '</div>';
  return html;
}}

/* ── FLASHCARD ACTIVITY ── */
function renderFlash(pageIdx) {{
  const act = getAct(pageIdx);
  if (!act) return '';
  const cards = S.lang==='ar' ? act.cards_ar : act.cards_en;
  const title = S.lang==='ar' ? act.title_ar : act.title_en;
  const desc = S.lang==='ar' ? act.desc_ar : act.desc_en;
  const icons = act.icons || ['\\u{1F4D6}','\\u{1F4D6}','\\u{1F4D6}','\\u{1F4D6}','\\u{1F4D6}'];
  const idx = S.flashIdx;
  const flipped = S.flashFlipped;
  const card = cards[idx];
  
  return '<div style="max-width:500px;margin:0 auto;text-align:center">' +
    '<h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p>' +
    '<div class="flashcard-container"><div class="flashcard '+(flipped?'flipped':'')+'" onclick="toggleFlash()">' +
    '<div class="flashcard-face flashcard-front"><div style="font-size:28px;margin-bottom:8px">'+(icons[idx]||'\\u{1F4D6}')+'</div>'+card[0]+
    '<div style="font-size:11px;margin-top:8px;opacity:.7">'+l('flip')+'</div></div>' +
    '<div class="flashcard-face flashcard-back">'+card[1]+'</div></div></div>' +
    '<div class="flashcard-nav">' +
    '<button class="btn btn-outline" onclick="flashPrev()" '+(idx===0?'disabled':'')+'>'+(isRTL()?'\\u2192':'\\u2190')+'</button>' +
    '<span class="flashcard-counter">'+(idx+1)+' / '+cards.length+'</span>' +
    '<button class="btn btn-outline" onclick="flashNext()" '+(idx===cards.length-1?'disabled':'')+'>'+(isRTL()?'\\u2190':'\\u2192')+'</button>' +
    '</div></div>';
}}

/* ── DRAG-DROP (ORDER) ACTIVITY ── */
function renderDrag(pageIdx) {{
  const act = getAct(pageIdx);
  if (!act) return '';
  const items = S.lang==='ar' ? act.items_ar : act.items_en;
  const title = S.lang==='ar' ? act.title_ar : act.title_en;
  const desc = S.lang==='ar' ? act.desc_ar : act.desc_en;
  
  // Initialize shuffled order if empty
  if (S.dragOrder.length !== items.length) {{
    S.dragOrder = items.map(function(_,i){{return i}});
    // Shuffle
    for (let i=S.dragOrder.length-1;i>0;i--) {{
      const j = (i*3+2)%S.dragOrder.length;
      const tmp=S.dragOrder[i];S.dragOrder[i]=S.dragOrder[j];S.dragOrder[j]=tmp;
    }}
  }}
  
  let html = '<div style="max-width:600px;margin:0 auto"><h2 class="slide-title">'+title+'</h2><p class="slide-subtitle">'+desc+'</p>';
  html += '<div class="drag-pool">';
  S.dragOrder.forEach(function(origIdx, pos) {{
    let cls = 'drag-item';
    if (S.dragChecked) {{
      cls += origIdx === pos ? ' correct' : ' wrong';
    }}
    html += '<div class="'+cls+'" style="display:flex;justify-content:space-between;align-items:center">' +
      '<span>'+(pos+1)+'. '+items[origIdx]+'</span>' +
      (!S.dragChecked ? '<span style="display:flex;gap:4px">' +
        (pos>0?'<button class="btn btn-outline" style="padding:4px 8px;font-size:11px" onclick="dragMove('+pos+','+(pos-1)+')">\\u2191</button>':'') +
        (pos<items.length-1?'<button class="btn btn-outline" style="padding:4px 8px;font-size:11px" onclick="dragMove('+pos+','+(pos+1)+')">\\u2193</button>':'') +
        '</span>' : (origIdx===pos?'\\u2705':'\\u274C')) +
      '</div>';
  }});
  html += '</div>';
  
  if (!S.dragChecked) {{
    html += '<div style="text-align:center;margin-top:12px"><button class="btn btn-primary" onclick="checkDrag()">'+l('checkOrder')+'</button></div>';
  }} else {{
    const correctCount = S.dragOrder.filter(function(v,i){{return v===i}}).length;
    const allCorrect = correctCount === items.length;
    html += '<div class="info-box '+(allCorrect?'emerald':'amber')+'" style="text-align:center;margin-top:12px;font-weight:700">' +
      (allCorrect ? '\\u2705 '+l('correct') : correctCount+'/'+items.length+' '+l('correct')) + '</div>';
    html += '<div style="text-align:center;margin-top:8px"><button class="btn btn-outline" onclick="resetDrag()">\\u{1F504} '+l('tryAgainDrag')+'</button></div>';
  }}
  html += '</div>';
  return html;
}}

/* ── MODULE QUIZ ── */
function renderQuiz() {{
  const qs = S.lang==='ar' ? MOD.quiz_ar : MOD.quiz_en;
  const ans = S.quizAns;
  const submitted = S.quizSubmitted;
  
  let html = '<div style="max-width:700px;margin:0 auto"><div style="text-align:center;margin-bottom:16px">' +
    '<div class="badge badge-emerald" style="margin-bottom:8px">\\u{1F4DD} '+l('quiz')+'</div>' +
    '<h2 class="slide-title">'+(S.lang==='ar'?MOD.title_ar:MOD.title_en)+'</h2>' +
    '<p class="slide-subtitle">'+l('quizDesc')+'</p>' +
    '<div class="badge badge-amber">'+l('passThreshold')+'</div></div>';
  
  qs.forEach(function(q,qi) {{
    html += '<div style="margin-bottom:16px"><p style="font-size:13px;font-weight:600;margin-bottom:8px"><span style="color:#0891b2;font-weight:700">Q'+(qi+1)+'.</span> '+q.q+'</p>';
    html += '<div style="padding-'+(isRTL()?'right':'left')+':20px">';
    q.opts.forEach(function(opt,oi) {{
      const sel = ans[qi]===oi;
      const isC = submitted && q.correct===oi;
      const isW = submitted && sel && q.correct!==oi;
      let cls = 'quiz-option';
      if (isC) cls += ' correct';
      else if (isW) cls += ' wrong';
      else if (sel && !submitted) cls += ' selected';
      html += '<button class="'+cls+'" onclick="'+(submitted?'':"selQuiz("+qi+","+oi+")")+'" '+(submitted?'disabled':'')+'><div class="quiz-radio"></div>'+(submitted&&isC?'\\u2713 ':'')+(submitted&&isW?'\\u2717 ':'')+opt+'</button>';
    }});
    html += '</div></div>';
  }});
  
  let resultHTML = '';
  if (submitted) {{
    const pct = S.quizScore;
    const pass = pct >= 80;
    resultHTML = '<div class="quiz-result '+(pass?'pass':'fail')+'">'+(pass?'\\u2705':'\\u274C')+' '+l('score')+': '+pct+'%<br><span style="font-size:13px;font-weight:400">'+(pass?l('pass'):l('fail'))+'</span></div>';
  }}
  
  const answeredCount = Object.keys(ans).length;
  html += '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">';
  if (submitted) {{
    html += '<span style="font-size:12px;color:#64748b">'+(S.quizScore>=80?'\\u2713 ':'')+l('score')+': '+S.quizScore+'%</span><button class="btn btn-outline" onclick="resetQuiz()">\\u{1F504} '+l('tryAgain')+'</button>';
  }} else {{
    html += '<span style="font-size:11px;color:#94a3b8">'+answeredCount+' '+l('of')+' '+qs.length+' '+l('answered')+'</span><button class="btn btn-primary" onclick="submitQuiz()" '+(answeredCount===qs.length?'':'disabled')+'>'+l('check')+'</button>';
  }}
  html += '</div>'+resultHTML+'</div>';
  return html;
}}

/* ── HANDLERS ── */
function goTo(p) {{ if(p<0||p>=TOTAL_PAGES)return; S.page=p; SCORM.setLoc(String(p)); saveProg(); render(); }}
function toggleLang() {{ S.lang=S.lang==='en'?'ar':'en'; S.matchSel={{left:null,right:null}};S.matchPairs=[];S.matchDone=false;S.flashIdx=0;S.flashFlipped=false;S.dragOrder=[];S.dragChecked=false; render(); }}

// Match
function matchSel(side,idx) {{
  if(S.matchDone)return;
  S.matchSel[side]=idx;
  if(S.matchSel.left!==null&&S.matchSel.right!==null) {{
    const act = getAct(S.page);
    const pairs = S.lang==='ar' ? act.pairs_ar : act.pairs_en;
    const l=S.matchSel.left, r=S.matchSel.right;
    if(pairs[l][1]===pairs[r][1]) S.matchPairs.push({{left:l,right:r}});
    const uL=new Set(S.matchPairs.map(function(m){{return m.left}}));
    if(uL.size===pairs.length) S.matchDone=true;
    S.matchSel={{left:null,right:null}};
    setTimeout(render,100);
  }} else render();
}}
function resetMatch() {{ S.matchSel={{left:null,right:null}};S.matchPairs=[];S.matchDone=false;render(); }}

// Flash
function toggleFlash() {{ S.flashFlipped=!S.flashFlipped;render(); }}
function flashPrev() {{ if(S.flashIdx>0){{S.flashIdx--;S.flashFlipped=false;render();}} }}
function flashNext() {{
  const act = getAct(S.page);
  const cards = S.lang==='ar'?act.cards_ar:act.cards_en;
  if(S.flashIdx<cards.length-1){{S.flashIdx++;S.flashFlipped=false;render();}}
}}

// Drag
function dragMove(from,to) {{
  const tmp=S.dragOrder[from];S.dragOrder[from]=S.dragOrder[to];S.dragOrder[to]=tmp;render();
}}
function checkDrag() {{ S.dragChecked=true;render(); }}
function resetDrag() {{
  S.dragOrder=[];S.dragChecked=false;render();
}}

// Quiz
function selQuiz(qi,oi) {{ if(S.quizSubmitted)return;S.quizAns[qi]=oi;render(); }}
function submitQuiz() {{
  const qs=S.lang==='ar'?MOD.quiz_ar:MOD.quiz_en;
  let c=0;qs.forEach(function(q,i){{if(S.quizAns[i]===q.correct)c++}});
  const pct=Math.round((c/qs.length)*100);
  S.quizScore=pct;S.quizSubmitted=true;
  SCORM.setScore(pct);
  SCORM.setStatus(pct>=80?'passed':'failed');
  saveProg();render();
}}
function resetQuiz() {{ S.quizAns={{}};S.quizSubmitted=false;S.quizScore=0;render(); }}

/* ── PROGRESS ── */
function saveProg() {{
  SCORM.setSus({{lang:S.lang,page:S.page,visited:Array.from(S.visited),quizAns:S.quizAns,quizSubmitted:S.quizSubmitted,quizScore:S.quizScore}});
}}
function loadProg() {{
  const d=SCORM.getSus();
  if(d&&typeof d==='object') {{
    if(d.lang)S.lang=d.lang;
    if(d.page!==undefined)S.page=d.page;
    if(d.visited)d.visited.forEach(function(v){{S.visited.add(v)}});
    if(d.quizAns)S.quizAns=d.quizAns;
    if(d.quizSubmitted)S.quizSubmitted=d.quizSubmitted;
    if(d.quizScore)S.quizScore=d.quizScore;
  }} else {{
    const loc=SCORM.getLoc();if(loc)S.page=parseInt(loc)||0;
  }}
}}

/* ── INIT ── */
window.addEventListener('load',function() {{
  SCORM.init();loadProg();
  if(!S.quizSubmitted)SCORM.setStatus('incomplete');
  render();
}});
window.addEventListener('beforeunload',function() {{ saveProg();SCORM.finish(); }});
window.addEventListener('keydown',function(e) {{
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){{e.preventDefault();goTo(S.page+1);}}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){{e.preventDefault();goTo(S.page-1);}}
}});
</script>
</body>
</html>'''
    return html

def build_all():
    print("Loading and compressing images...")
    images = load_all_images()
    print(f"  Loaded {len(images)} images")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Module 1: Use existing HTML with base64 images
    print("\n=== Module 1: Fixing existing HTML with base64 images ===")
    with open('scorm-module1/index.html', 'r', encoding='utf-8') as f:
        m1_html = f.read()
    m1_html = fix_module1_images(m1_html, images)
    
    m1_dir = os.path.join(OUTPUT_DIR, 'module1')
    os.makedirs(m1_dir, exist_ok=True)
    with open(os.path.join(m1_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(m1_html)
    with open(os.path.join(m1_dir, 'imsmanifest.xml'), 'w', encoding='utf-8') as f:
        f.write(make_manifest('Module1_IntroToAIAutomation', 'Module 1: Introduction to AI Automation'))
    
    # Create zip
    zip_path = os.path.join(OUTPUT_DIR, 'module1-scorm.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.write(os.path.join(m1_dir, 'imsmanifest.xml'), 'imsmanifest.xml')
        zf.write(os.path.join(m1_dir, 'index.html'), 'index.html')
    print(f"  Created {zip_path} ({os.path.getsize(zip_path)/1024:.0f} KB)")
    
    # Modules 2-5: Generate new HTML
    from build_all_scorm import get_module_data
    modules = get_module_data()
    
    for mod in modules[1:]:  # Skip module 1
        num = mod['number']
        print(f"\n=== Module {num}: {mod['title_en']} ===")
        
        mod_dir = os.path.join(OUTPUT_DIR, f'module{num}')
        os.makedirs(mod_dir, exist_ok=True)
        
        html = generate_module_html(mod, images)
        with open(os.path.join(mod_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        
        manifest = make_manifest(mod['id'], f"Module {num}: {mod['title_en']}")
        with open(os.path.join(mod_dir, 'imsmanifest.xml'), 'w', encoding='utf-8') as f:
            f.write(manifest)
        
        zip_path = os.path.join(OUTPUT_DIR, f'module{num}-scorm.zip')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.write(os.path.join(mod_dir, 'imsmanifest.xml'), 'imsmanifest.xml')
            zf.write(os.path.join(mod_dir, 'index.html'), 'index.html')
        print(f"  Created {zip_path} ({os.path.getsize(zip_path)/1024:.0f} KB)")
    
    # Build full Open edX course tar.gz
    print("\n=== Building full Open edX course tar.gz ===")
    course_dir = 'full-openedx-course'
    if os.path.exists(course_dir):
        shutil.rmtree(course_dir)
    
    # Create OLX structure
    for d in ['course', 'chapter', 'sequential', 'vertical', 'html', 'policies/course', 'static']:
        os.makedirs(os.path.join(course_dir, d), exist_ok=True)
    
    # Root course.xml
    with open(os.path.join(course_dir, 'course.xml'), 'w') as f:
        f.write('<course url_name="course" org="HealthAI" course="AIAutomation101" />\n')
    
    # Course definition with all 5 chapters
    chapters = '\n'.join([f'  <chapter url_name="module{i}_chapter"/>' for i in range(1,6)])
    with open(os.path.join(course_dir, 'course/course.xml'), 'w') as f:
        f.write(f'''<course display_name="AI Automation and Vibe Coding" language="en" start="2026-01-01T00:00:00Z">
{chapters}
</course>
''')
    
    # Grading policy
    with open(os.path.join(course_dir, 'policies/course/grading_policy.json'), 'w') as f:
        json.dump({"GRADER":[{"type":"Module Quiz","min_count":5,"drop_count":0,"weight":1.0}],"GRADE_CUTOFFS":{"Pass":0.7}}, f)
    
    with open(os.path.join(course_dir, 'policies/course/policy.json'), 'w') as f:
        json.dump({"course/course":{"display_name":"AI Automation and Vibe Coding","start":"2026-01-01T00:00:00Z","language":"en"}}, f)
    
    module_titles = {
        1: 'Introduction to AI Automation',
        2: 'Workflow Thinking',
        3: 'AI Agents',
        4: 'Vibe Coding',
        5: 'Designing AI Automation Solutions',
    }
    
    for i in range(1, 6):
        title = module_titles[i]
        # Chapter
        with open(os.path.join(course_dir, f'chapter/module{i}_chapter.xml'), 'w') as f:
            f.write(f'<chapter display_name="Module {i}: {title}"><sequential url_name="module{i}_seq"/></chapter>\n')
        
        # Sequential
        with open(os.path.join(course_dir, f'sequential/module{i}_seq.xml'), 'w') as f:
            f.write(f'<sequential display_name="{title}"><vertical url_name="module{i}_unit"/></sequential>\n')
        
        # Vertical with HTML component (iframe to SCORM content)
        with open(os.path.join(course_dir, f'vertical/module{i}_unit.xml'), 'w') as f:
            f.write(f'<vertical display_name="Module {i}: Interactive Content"><html url_name="module{i}_html"/></vertical>\n')
        
        # HTML component
        with open(os.path.join(course_dir, f'html/module{i}_html.xml'), 'w') as f:
            f.write(f'<html filename="module{i}_content" display_name="Module {i}: {title}"/>\n')
        
        # HTML content (iframe to static file)
        with open(os.path.join(course_dir, f'html/module{i}_content.html'), 'w') as f:
            f.write(f'<iframe src="/static/module{i}/index.html" width="100%" height="800" frameborder="0" allowfullscreen></iframe>\n')
        
        # Copy module HTML to static
        src_html = os.path.join(OUTPUT_DIR, f'module{i}', 'index.html')
        dst_dir = os.path.join(course_dir, f'static/module{i}')
        os.makedirs(dst_dir, exist_ok=True)
        shutil.copy2(src_html, os.path.join(dst_dir, 'index.html'))
    
    # Also copy SCORM zips to static for SCORM XBlock usage
    for i in range(1, 6):
        src_zip = os.path.join(OUTPUT_DIR, f'module{i}-scorm.zip')
        shutil.copy2(src_zip, os.path.join(course_dir, f'static/module{i}-scorm.zip'))
    
    # Create tar.gz
    tar_path = os.path.join(OUTPUT_DIR, 'full-course-openedx.tar.gz')
    with tarfile.open(tar_path, 'w:gz') as tar:
        for root, dirs, files in os.walk(course_dir):
            for f in files:
                fp = os.path.join(root, f)
                arcname = os.path.relpath(fp, course_dir)
                tar.add(fp, arcname=arcname)
    print(f"  Created {tar_path} ({os.path.getsize(tar_path)/1024:.0f} KB)")
    
    print("\n=== SUMMARY ===")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith(('.zip', '.tar.gz')):
            fp = os.path.join(OUTPUT_DIR, f)
            print(f"  {f}: {os.path.getsize(fp)/1024:.0f} KB")
    
    print("\nDone! All packages ready in", OUTPUT_DIR)

if __name__ == '__main__':
    build_all()
