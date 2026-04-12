#!/usr/bin/env python3
"""
Generate SCORM 1.2 packages for all 5 modules of the AI Automation course.
Images are compressed and embedded as base64 data URIs for full self-containment.
"""

import os, sys, json, base64, io, zipfile, tarfile, shutil
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_IMAGES = os.path.join(BASE_DIR, "public", "images")
OUTPUT_DIR = os.path.join(BASE_DIR, "scorm-packages")

def compress_image_to_base64(path, max_width=500, quality=60):
    """Compress a PNG image and return as JPEG base64 data URI."""
    img = Image.open(path)
    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, (248, 250, 252))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    w, h = img.size
    if w > max_width:
        ratio = max_width / w
        img = img.resize((max_width, int(h * ratio)), Image.LANCZOS)
    
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=quality, optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    size_kb = len(buf.getvalue()) / 1024
    print(f"    {os.path.basename(path)}: {os.path.getsize(path)/1024:.0f}KB -> {size_kb:.0f}KB")
    return f"data:image/jpeg;base64,{b64}"

# ─── Module 1 slide images ───
MODULE1_IMAGES = {
    'slide-automation-concept': 'slide-automation-concept.png',
    'slide-why-automation': 'slide-why-automation.png',
    'slide-trad-vs-ai': 'slide-trad-vs-ai.png',
    'slide-automation-types': 'slide-automation-types.png',
    'slide-task-automation': 'slide-task-automation.png',
    'slide-process-automation': 'slide-process-automation.png',
    'slide-intelligent-automation': 'slide-intelligent-automation.png',
}

def get_module1_images():
    imgs = {}
    for key, fname in MODULE1_IMAGES.items():
        path = os.path.join(PUBLIC_IMAGES, fname)
        if os.path.exists(path):
            imgs[key] = compress_image_to_base64(path)
        else:
            imgs[key] = ""
    return imgs

# ─── Generic module intro images ───
def get_module_intro_image(module_num):
    fnames = {
        1: 'module1-intro-ai-automation.png',
        2: 'module2-workflow-thinking.png',
        3: 'module3-ai-agents.png',
        4: 'module4-vibe-coding.png',
        5: 'module5-designing-solutions.png',
    }
    path = os.path.join(PUBLIC_IMAGES, fnames.get(module_num, ''))
    if os.path.exists(path):
        return compress_image_to_base64(path, max_width=450, quality=55)
    return ""

# ─── SCORM imsmanifest.xml ───
def make_manifest(module_num, title):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="Module{module_num}_{title.replace(' ','_').replace('&','and')}"
          version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>Module {module_num}: {title}</title>
      <item identifier="item_1" identifierref="res_1" isvisible="true">
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

# ─── CSS (shared) ───
SHARED_CSS = '''*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6;min-height:100vh}
button{cursor:pointer;font-family:inherit;border:none;background:none}
img{max-width:100%;height:auto;display:block;border-radius:12px}
:root{--cyan:#0891b2;--cyan-light:#ecfeff;--cyan-border:#a5f3fc;--emerald:#059669;--emerald-light:#ecfdf5;--violet:#7c3aed;--violet-light:#f5f3ff;--amber:#d97706;--amber-light:#fffbeb;--red:#dc2626;--red-light:#fef2f2;--slate:#64748b;--slate-light:#f1f5f9;--white:#fff;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.1)}
[dir="rtl"] body{font-family:'Segoe UI',system-ui,sans-serif}
.app{max-width:900px;margin:0 auto;padding:12px}
.card{background:var(--white);border:1px solid #e2e8f0;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.card-header{padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px}
.card-body{padding:16px;min-height:400px}
.card-footer{padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:space-between}
.toolbar{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.toolbar h1{font-size:14px;font-weight:700;color:#0f172a;flex:1}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
.badge-cyan{background:var(--cyan-light);color:var(--cyan)}
.badge-emerald{background:var(--emerald-light);color:var(--emerald)}
.badge-amber{background:var(--amber-light);color:var(--amber)}
.badge-violet{background:var(--violet-light);color:var(--violet)}
.lang-btn{padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid #e2e8f0;background:var(--white);color:var(--slate);transition:.2s}
.lang-btn:hover{background:var(--slate-light)}
.progress-bar{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-bottom:8px}
.progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#06b6d4,#0284c7);transition:width .5s ease}
.nav-dots{display:flex;gap:3px;justify-content:center;margin-bottom:8px;flex-wrap:wrap}
.nav-dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;border:none;transition:.2s;cursor:pointer}
.nav-dot.active{background:var(--cyan);transform:scale(1.3)}
.nav-dot.visited{background:#a5f3fc}
.nav-dot.section-activity{background:#fde68a}
.nav-dot.section-quiz{background:#a7f3d0}
.btn{padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;transition:.2s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--cyan);color:var(--white);box-shadow:0 1px 2px rgba(0,0,0,.15)}
.btn-primary:hover{background:#0e7490}
.btn-primary:disabled{background:#94a3b8;cursor:not-allowed}
.btn-outline{border:1px solid #e2e8f0;color:var(--slate);background:var(--white)}
.btn-outline:hover{background:var(--slate-light)}
.btn-outline:disabled{opacity:.4;cursor:not-allowed}
.btn-success{background:var(--emerald);color:var(--white)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:640px){.grid-2{grid-template-columns:1fr}}
.slide-title{font-size:22px;font-weight:800;color:#0f172a;margin-bottom:6px;line-height:1.3}
.slide-subtitle{font-size:14px;color:var(--slate);margin-bottom:12px}
.info-box{padding:12px;border-radius:var(--radius);margin-bottom:12px;font-size:13px;line-height:1.7}
.info-box.cyan{background:var(--cyan-light);border:1px solid var(--cyan-border);color:#155e75}
.info-box.violet{background:var(--violet-light);border:1px solid #c4b5fd;color:#5b21b6}
.info-box.amber{background:var(--amber-light);border:1px solid #fcd34d;color:#92400e}
.info-box.emerald{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}
.info-box.red{background:var(--red-light);border:1px solid #fca5a5;color:#991b1b}
.info-box.slate{background:var(--slate-light);border:1px solid #cbd5e1;color:#334155}
.chip{display:inline-flex;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:500;background:var(--slate-light);color:var(--slate);border:1px solid #e2e8f0;margin:3px}
.tag{display:inline-flex;padding:4px 14px;background:var(--slate-light);border-radius:12px;font-size:12px;font-weight:500;color:var(--slate);border:1px solid #e2e8f0}
.match-pool{display:flex;flex-direction:column;gap:6px}
.match-item{padding:10px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:.2s;border:2px solid transparent;user-select:none}
.match-item.left{background:#f0f9ff;border-color:#bae6fd;color:#0c4a6e}
.match-item.left.selected{background:#06b6d4;color:#fff;border-color:#06b6d4}
.match-item.right{background:#faf5ff;border-color:#d8b4fe;color:#581c87}
.match-item.right.selected{background:#7c3aed;color:#fff;border-color:#7c3aed}
.match-item.correct{background:var(--emerald-light)!important;border-color:var(--emerald)!important;color:#065f46!important}
.match-item:disabled,.match-item[disabled]{cursor:default;opacity:.7}
.flashcard-container{perspective:800px;margin:0 auto;max-width:400px}
.flashcard{width:100%;min-height:200px;position:relative;cursor:pointer;transition:transform .6s;transform-style:preserve-3d}
.flashcard.flipped{transform:rotateY(180deg)}
[dir="rtl"] .flashcard.flipped{transform:rotateY(-180deg)}
.flashcard-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:var(--radius);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.flashcard-front{background:linear-gradient(135deg,#06b6d4,#0284c7);color:var(--white);font-size:20px;font-weight:700}
.flashcard-back{background:var(--white);border:2px solid var(--cyan);color:#0f172a;transform:rotateY(180deg);font-size:14px;line-height:1.7}
[dir="rtl"] .flashcard-back{transform:rotateY(-180deg)}
.flashcard-nav{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px}
.flashcard-counter{font-size:13px;font-weight:600;color:var(--slate)}
.quiz-option{width:100%;text-align:left;padding:10px 14px;border-radius:8px;border:2px solid #e2e8f0;font-size:13px;transition:.2s;margin-bottom:6px;display:flex;align-items:center;gap:8px}
[dir="rtl"] .quiz-option{text-align:right}
.quiz-option:hover:not(:disabled){border-color:var(--cyan);background:var(--cyan-light)}
.quiz-option.selected{border-color:var(--cyan);background:var(--cyan-light);font-weight:600}
.quiz-option.correct{border-color:var(--emerald);background:var(--emerald-light);color:#065f46}
.quiz-option.wrong{border-color:var(--red);background:var(--red-light);color:#991b1b}
.quiz-option:disabled{cursor:default}
.quiz-radio{width:16px;height:16px;border-radius:50%;border:2px solid #cbd5e1;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.quiz-option.selected .quiz-radio{border-color:var(--cyan);background:var(--cyan)}
.quiz-option.selected .quiz-radio::after{content:'';width:6px;height:6px;background:#fff;border-radius:50%}
.quiz-result{text-align:center;padding:16px;border-radius:var(--radius);margin-top:12px;font-weight:700;font-size:15px}
.quiz-result.pass{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}
.quiz-result.fail{background:var(--red-light);border:1px solid #fca5a5;color:#991b1b}
.drag-pool{display:flex;flex-direction:column;gap:8px}
.drag-item{padding:12px;border-radius:8px;font-size:12px;font-weight:500;cursor:grab;transition:.2s;border:2px solid #e2e8f0;background:#fff;user-select:none;display:flex;align-items:center;gap:8px}
.drag-item:hover{border-color:var(--cyan);box-shadow:var(--shadow)}
.drag-item .drag-num{width:24px;height:24px;border-radius:50%;background:var(--slate-light);color:var(--slate);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.drag-item.placed .drag-num{background:var(--cyan);color:#fff}
.drag-item.correct-order{border-color:var(--emerald);background:var(--emerald-light)}
.drag-item.wrong-order{border-color:var(--red);background:var(--red-light)}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.animate-in{animation:fadeIn .4s ease forwards}
.scorm-status{position:fixed;bottom:8px;right:8px;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;z-index:999}
[dir="rtl"] .scorm-status{right:auto;left:8px}
.scorm-status.connected{background:#d1fae5;color:#065f46}
.scorm-status.disconnected{background:#fee2e2;color:#991b1b}'''

# ─── SCORM API JS (shared) ───
SCORM_API_JS = '''const SCORM=(()=>{let API=null,connected=false;function findAPI(w){let t=0;while(w&&!w.API&&t<10){t++;if(w.parent&&w.parent!==w)w=w.parent;else if(w.opener)w=w.opener;else break}return w?.API||null}function init(){API=findAPI(window);if(!API&&window.opener)API=findAPI(window.opener);if(API){const r=API.LMSInitialize('');connected=(r==='true'||r===true)}updateUI();return connected}function sv(k,v){if(!API)return;API.LMSSetValue(k,String(v));API.LMSCommit('')}function gv(k){if(!API)return'';return API.LMSGetValue(k)}function setScore(s,mx,mn){sv('cmi.core.score.raw',s);sv('cmi.core.score.max',mx||100);sv('cmi.core.score.min',mn||0)}function setStatus(s){sv('cmi.core.lesson_status',s)}function setLoc(l){sv('cmi.core.lesson_location',l)}function getLoc(){return gv('cmi.core.lesson_location')||''}function setSuspend(d){sv('cmi.suspend_data',typeof d==='string'?d:JSON.stringify(d))}function getSuspend(){const d=gv('cmi.suspend_data');try{return JSON.parse(d)}catch(e){return d||null}}function finish(){if(API){API.LMSCommit('');API.LMSFinish('')}}function updateUI(){const el=document.getElementById('scormStatus');if(el){el.textContent=connected?'SCORM Connected':'SCORM: Standalone';el.className='scorm-status '+(connected?'connected':'disconnected')}}return{init,sv,gv,setScore,setStatus,setLoc,getLoc,setSuspend,getSuspend,finish,get connected(){return connected}}})();'''

# ─── Shared JS utilities ───
SHARED_JS_UTILS = '''
function t(){return T[STATE.lang]}
function isRTL(){return STATE.lang==='ar'}

function render(){
  const dir=isRTL()?'rtl':'ltr';
  document.documentElement.dir=dir;
  document.documentElement.lang=STATE.lang;
  const tt=t();
  const p=STATE.currentPage;
  const pType=PAGE_TYPES[p];
  STATE.visitedPages.add(p);

  let headerLabel='',headerColor='badge-cyan';
  if(pType==='slide'){headerLabel=(tt.slideTitles&&tt.slideTitles[p])||tt.title}
  else if(pType.startsWith('activity')){headerLabel=tt.activityTitles?tt.activityTitles[pType]||pType:pType;headerColor='badge-amber'}
  else if(pType==='module-quiz'){headerLabel=tt.moduleQuiz;headerColor='badge-emerald'}

  const prevBtn='<button class="btn btn-outline" '+(p===0?'disabled':'')+' onclick="goTo('+(p-1)+')">'+(isRTL()?'\\u2192':'\\u2190')+' '+tt.previous+'</button>';
  const nextBtn=p<TOTAL_PAGES-1
    ?'<button class="btn btn-primary" onclick="goTo('+(p+1)+')">'+tt.next+' '+(isRTL()?'\\u2190':'\\u2192')+'</button>'
    :'<button class="btn btn-success" disabled>\\u2713 '+tt.score+'</button>';

  let dots='';
  for(let i=0;i<TOTAL_PAGES;i++){
    const cls=['nav-dot'];
    if(i===p)cls.push('active');
    else if(STATE.visitedPages.has(i))cls.push('visited');
    if(PAGE_TYPES[i].startsWith('activity'))cls.push('section-activity');
    else if(PAGE_TYPES[i]==='module-quiz')cls.push('section-quiz');
    dots+='<button class="'+cls.join(' ')+'" onclick="goTo('+i+')" title="'+(i+1)+'/'+TOTAL_PAGES+'"></button>';
  }

  let bodyHTML='';
  if(pType==='slide')bodyHTML=renderSlide(p);
  else if(pType==='activity-match')bodyHTML=renderMatchActivity();
  else if(pType==='activity-flash')bodyHTML=renderFlashcardActivity();
  else if(pType==='activity-drag')bodyHTML=renderDragDropActivity();
  else if(pType==='module-quiz')bodyHTML=renderModuleQuiz();

  document.getElementById('app').innerHTML=
    '<div class="toolbar"><h1>'+tt.moduleLabel+': '+tt.title+'</h1><button class="lang-btn" onclick="toggleLang()">'+(STATE.lang==='en'?'\\u0627\\u0644\\u0639\\u0631\\u0628\\u064a\\u0629':'English')+'</button></div>'+
    '<div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(((p+1)/TOTAL_PAGES)*100)+'%"></div></div>'+
    '<div class="nav-dots">'+dots+'</div>'+
    '<div class="card"><div class="card-header"><span class="badge '+headerColor+'">'+headerLabel+'</span><span style="font-size:11px;color:#94a3b8;font-weight:600">'+(p+1)+' '+tt.of+' '+TOTAL_PAGES+'</span></div>'+
    '<div class="card-body animate-in" id="pageBody">'+bodyHTML+'</div>'+
    '<div class="card-footer">'+prevBtn+'<span style="font-size:11px;color:#94a3b8;font-weight:600">'+(p+1)+' / '+TOTAL_PAGES+'</span>'+nextBtn+'</div></div>';
}

function goTo(page){if(page<0||page>=TOTAL_PAGES)return;STATE.currentPage=page;SCORM.setLoc(String(page));saveProgress();render()}
function toggleLang(){STATE.lang=STATE.lang==='en'?'ar':'en';STATE.matchSelected={left:null,right:null};STATE.matchPairs=[];STATE.matchDone=false;STATE.flashIdx=0;STATE.flashFlipped=false;STATE.dragOrder=null;STATE.dragChecked=false;render()}

function renderMatchActivity(){
  const tt=t();
  const pairs=tt.matchPairsData;
  const matched=STATE.matchPairs;
  const done=STATE.matchDone;
  const leftItems=pairs.map((p,i)=>({text:p.left,idx:i}));
  const rightShuffled=[...pairs.map((p,i)=>({text:p.right,idx:i}))].sort((a,b)=>(a.idx+3)%pairs.length-(b.idx+3)%pairs.length);
  const isLM=(i)=>matched.some(m=>m.left===i);
  const isRM=(i)=>matched.some(m=>m.right===i);
  return '<div style="max-width:700px;margin:0 auto"><h2 class="slide-title">'+tt.matchTitle+'</h2><p class="slide-subtitle">'+tt.matchDesc+'</p>'+
    (done?'<div class="info-box emerald" style="text-align:center;font-weight:700">\\u2705 '+tt.matchComplete+'</div>':'')+
    '<div class="grid-2"><div class="match-pool">'+leftItems.map((item,i)=>{
      const m=isLM(i),sel=STATE.matchSelected.left===i;
      return '<button class="match-item left'+(m?' correct':'')+(sel?' selected':'')+'" '+(m?'disabled':'')+' onclick="matchSelect(\'left\','+i+')">'+item.text+'</button>';
    }).join('')+'</div><div class="match-pool">'+rightShuffled.map(item=>{
      const m=isRM(item.idx),sel=STATE.matchSelected.right===item.idx;
      return '<button class="match-item right'+(m?' correct':'')+(sel?' selected':'')+'" '+(m?'disabled':'')+' onclick="matchSelect(\'right\','+item.idx+')">'+item.text+'</button>';
    }).join('')+'</div></div>'+
    (done?'<div style="text-align:center;margin-top:12px"><button class="btn btn-outline" onclick="resetMatch()">\\ud83d\\udd04 '+tt.matchReset+'</button></div>':'')+'</div>';
}
function matchSelect(side,idx){
  if(STATE.matchDone)return;
  STATE.matchSelected[side]=idx;
  if(STATE.matchSelected.left!==null&&STATE.matchSelected.right!==null){
    const pairs=t().matchPairsData;
    const l=STATE.matchSelected.left,r=STATE.matchSelected.right;
    if(pairs[l].right===pairs[r].right)STATE.matchPairs.push({left:l,right:r});
    const uniqueLefts=new Set(STATE.matchPairs.map(m=>m.left));
    if(uniqueLefts.size===pairs.length)STATE.matchDone=true;
    STATE.matchSelected={left:null,right:null};
    setTimeout(render,100);
  }else render();
}
function resetMatch(){STATE.matchSelected={left:null,right:null};STATE.matchPairs=[];STATE.matchDone=false;render()}

function renderFlashcardActivity(){
  const tt=t();const cards=tt.flashcardsData;const idx=STATE.flashIdx;const flipped=STATE.flashFlipped;
  const icons=['\\ud83d\\udcc4','\\ud83d\\udcca','\\ud83e\\udde0','\\u2699\\ufe0f','\\ud83e\\udd16'];
  return '<div style="max-width:500px;margin:0 auto;text-align:center"><h2 class="slide-title">'+tt.flashTitle+'</h2><p class="slide-subtitle">'+tt.flashDesc+'</p>'+
    '<div class="flashcard-container"><div class="flashcard '+(flipped?'flipped':'')+'" onclick="toggleFlash()">'+
    '<div class="flashcard-face flashcard-front"><div style="font-size:28px;margin-bottom:8px">'+(icons[idx%icons.length]||'\\ud83d\\udcda')+'</div>'+cards[idx].front+'<div style="font-size:11px;margin-top:8px;opacity:.7">'+tt.flashTap+'</div></div>'+
    '<div class="flashcard-face flashcard-back">'+cards[idx].back+'</div></div></div>'+
    '<div class="flashcard-nav"><button class="btn btn-outline" onclick="flashPrev()" '+(idx===0?'disabled':'')+'>'+(isRTL()?'\\u2192':'\\u2190')+'</button>'+
    '<span class="flashcard-counter">'+(idx+1)+' / '+cards.length+'</span>'+
    '<button class="btn btn-outline" onclick="flashNext()" '+(idx===cards.length-1?'disabled':'')+'>'+(isRTL()?'\\u2190':'\\u2192')+'</button></div></div>';
}
function toggleFlash(){STATE.flashFlipped=!STATE.flashFlipped;render()}
function flashPrev(){if(STATE.flashIdx>0){STATE.flashIdx--;STATE.flashFlipped=false;render()}}
function flashNext(){const mx=t().flashcardsData.length-1;if(STATE.flashIdx<mx){STATE.flashIdx++;STATE.flashFlipped=false;render()}}

function renderDragDropActivity(){
  const tt=t();const items=tt.dragItemsData;
  if(!STATE.dragOrder)STATE.dragOrder=items.map((_,i)=>i).sort(()=>Math.random()-0.5);
  const order=STATE.dragOrder;
  const checked=STATE.dragChecked;
  return '<div style="max-width:600px;margin:0 auto"><h2 class="slide-title">'+tt.dragTitle+'</h2><p class="slide-subtitle">'+tt.dragDesc+'</p>'+
    '<div class="drag-pool">'+order.map((itemIdx,pos)=>{
      const item=items[itemIdx];
      const correctPos=itemIdx;
      const isCorrect=checked&&pos===correctPos;
      const isWrong=checked&&pos!==correctPos;
      return '<div class="drag-item'+(isCorrect?' correct-order':'')+(isWrong?' wrong-order':'')+'">'+
        '<span class="drag-num'+(checked?' placed':'')+'">'+(pos+1)+'</span>'+
        '<span style="flex:1">'+item.text+'</span>'+
        (!checked?'<span style="display:flex;flex-direction:column;gap:2px">'+
          (pos>0?'<button style="padding:2px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:10px;cursor:pointer;background:#fff" onclick="dragMove('+pos+','+(pos-1)+')">\\u25B2</button>':'')+
          (pos<order.length-1?'<button style="padding:2px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:10px;cursor:pointer;background:#fff" onclick="dragMove('+pos+','+(pos+1)+')">\\u25BC</button>':'')+'</span>':'')+'</div>';
    }).join('')+'</div>'+
    '<div style="margin-top:12px;text-align:center">'+
    (checked
      ?'<div class="info-box '+(STATE.dragScore===items.length?'emerald':'amber')+'" style="text-align:center;font-weight:700">'+tt.score+': '+STATE.dragScore+'/'+items.length+'</div><button class="btn btn-outline" onclick="resetDrag()">\\ud83d\\udd04 '+tt.tryAgain+'</button>'
      :'<button class="btn btn-primary" onclick="checkDrag()">'+tt.checkAnswers+'</button>')+'</div></div>';
}
function dragMove(from,to){const o=STATE.dragOrder;const tmp=o[from];o[from]=o[to];o[to]=tmp;render()}
function checkDrag(){STATE.dragChecked=true;const items=t().dragItemsData;let score=0;STATE.dragOrder.forEach((itemIdx,pos)=>{if(pos===itemIdx)score++});STATE.dragScore=score;render()}
function resetDrag(){STATE.dragOrder=null;STATE.dragChecked=false;STATE.dragScore=0;render()}

function renderModuleQuiz(){
  const tt=t();const qs=tt.moduleQuizQs;const ans=STATE.quizAnswers;const submitted=STATE.quizSubmitted;
  let qHTML=qs.map((q,qi)=>{
    return '<div style="margin-bottom:16px"><p style="font-size:13px;font-weight:600;margin-bottom:8px"><span style="color:#0891b2;font-weight:700">Q'+(qi+1)+'.</span> '+q.question+'</p>'+
      '<div style="padding-'+(isRTL()?'right':'left')+':20px">'+
      q.options.map((opt,oi)=>{
        const sel=ans[qi]===oi;const isC=submitted&&q.correct===oi;const isW=submitted&&sel&&q.correct!==oi;
        let cls='quiz-option';if(isC)cls+=' correct';else if(isW)cls+=' wrong';else if(sel&&!submitted)cls+=' selected';
        return '<button class="'+cls+'" onclick="'+(submitted?'':'selectQuizAns('+qi+','+oi+')')+'" '+(submitted?'disabled':'')+'><div class="quiz-radio"></div>'+(submitted&&isC?'\\u2713 ':'')+(submitted&&isW?'\\u2717 ':'')+opt+'</button>';
      }).join('')+'</div></div>';
  }).join('');
  let resultHTML='';
  if(submitted){const pct=STATE.quizScore;const pass=pct>=80;resultHTML='<div class="quiz-result '+(pass?'pass':'fail')+'">'+(pass?'\\u2705':'\\u274c')+' '+tt.score+': '+pct+'%<br><span style="font-size:13px;font-weight:400">'+(pass?tt.passMsg:tt.failMsg)+'</span></div>'}
  const answeredCount=Object.keys(ans).length;const allAnswered=answeredCount===qs.length;
  return '<div style="max-width:700px;margin:0 auto"><div style="text-align:center;margin-bottom:16px"><div class="badge badge-emerald" style="margin-bottom:8px">\\ud83d\\udcdd '+tt.moduleQuiz+'</div><h2 class="slide-title">'+tt.title+'</h2><p class="slide-subtitle">'+tt.quizDesc+'</p><div class="badge badge-amber">'+tt.passThreshold+'</div></div>'+
    qHTML+'<div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">'+
    (submitted?'<span style="font-size:12px;color:#64748b">'+(STATE.quizScore>=80?'\\u2713 ':'')+tt.score+': '+STATE.quizScore+'%</span><button class="btn btn-outline" onclick="resetQuiz()">\\ud83d\\udd04 '+tt.tryAgain+'</button>'
    :'<span style="font-size:11px;color:#94a3b8">'+answeredCount+' '+tt.of+' '+qs.length+' '+tt.answered+'</span><button class="btn btn-primary" onclick="submitQuiz()" '+(allAnswered?'':'disabled')+'>'+tt.checkAnswers+'</button>')+
    '</div>'+resultHTML+'</div>';
}
function selectQuizAns(qi,oi){if(STATE.quizSubmitted)return;STATE.quizAnswers[qi]=oi;render()}
function submitQuiz(){const qs=t().moduleQuizQs;let c=0;qs.forEach((q,i)=>{if(STATE.quizAnswers[i]===q.correct)c++});const pct=Math.round((c/qs.length)*100);STATE.quizScore=pct;STATE.quizSubmitted=true;SCORM.setScore(pct,100,0);SCORM.setStatus(pct>=80?'passed':'failed');saveProgress();render()}
function resetQuiz(){STATE.quizAnswers={};STATE.quizSubmitted=false;STATE.quizScore=0;render()}

function saveProgress(){SCORM.setSuspend({lang:STATE.lang,page:STATE.currentPage,visited:Array.from(STATE.visitedPages),qa:STATE.quizAnswers,qs:STATE.quizSubmitted,qsc:STATE.quizScore})}
function loadProgress(){const d=SCORM.getSuspend();if(d&&typeof d==='object'){if(d.lang)STATE.lang=d.lang;if(d.page!==undefined)STATE.currentPage=d.page;if(d.visited)d.visited.forEach(v=>STATE.visitedPages.add(v));if(d.qa)STATE.quizAnswers=d.qa;if(d.qs)STATE.quizSubmitted=d.qs;if(d.qsc)STATE.quizScore=d.qsc}else{const loc=SCORM.getLoc();if(loc)STATE.currentPage=parseInt(loc)||0}}

window.addEventListener('load',()=>{SCORM.init();loadProgress();if(!STATE.quizSubmitted)SCORM.setStatus('incomplete');render()});
window.addEventListener('beforeunload',()=>{saveProgress();SCORM.finish()});
window.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goTo(STATE.currentPage+1)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goTo(STATE.currentPage-1)}});
'''

def build_module_html(module_num, en_data, ar_data, intro_img_b64, slide_images_b64=None):
    """Build a complete self-contained HTML file for a module."""
    
    # Build page types
    page_types = []
    slide_count = en_data.get('totalSlides', 5)
    # Add slides
    for i in range(slide_count):
        page_types.append('slide')
    # Add activities
    for act in en_data.get('activities', []):
        if act['type'] == 'match':
            page_types.append('activity-match')
        elif act['type'] == 'flashcard':
            page_types.append('activity-flash')
        elif act['type'] == 'dragdrop':
            page_types.append('activity-drag')
    # Add module quiz
    page_types.append('module-quiz')
    
    total_pages = len(page_types)
    
    # Build T data for both languages
    en_t = build_translation_data(module_num, en_data, 'en', intro_img_b64)
    ar_t = build_translation_data(module_num, ar_data, 'ar', intro_img_b64)
    
    # Build slide renderer
    slide_renderer = build_slide_renderer(module_num, en_data, slide_images_b64 or {}, intro_img_b64)
    
    html = f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module {module_num}: {en_data['title']}</title>
<style>
{SHARED_CSS}
</style>
</head>
<body>
<div class="app" id="app"></div>
<div class="scorm-status" id="scormStatus"></div>
<script>
{SCORM_API_JS}

const STATE={{lang:'en',currentPage:0,visitedPages:new Set(),matchSelected:{{left:null,right:null}},matchPairs:[],matchDone:false,flashIdx:0,flashFlipped:false,dragOrder:null,dragChecked:false,dragScore:0,quizAnswers:{{}},quizSubmitted:false,quizScore:0}};

const TOTAL_PAGES={total_pages};
const PAGE_TYPES={json.dumps(page_types)};

const T={{
  en: {json.dumps(en_t, ensure_ascii=False)},
  ar: {json.dumps(ar_t, ensure_ascii=False)}
}};

{slide_renderer}
{SHARED_JS_UTILS}
</script>
</body>
</html>'''
    return html

def build_translation_data(module_num, section_data, lang, intro_img):
    """Build translation data object for a module."""
    t = {}
    
    if lang == 'en':
        t['moduleLabel'] = f'Module {module_num}'
        t['title'] = section_data['title']
        t['subtitle'] = section_data.get('shortDescription', '')[:120] + '...'
        t['next'] = 'Next'
        t['previous'] = 'Previous'
        t['of'] = 'of'
        t['submit'] = 'Submit'
        t['tryAgain'] = 'Try Again'
        t['checkAnswers'] = 'Check Answers'
        t['answered'] = 'answered'
        t['score'] = 'Score'
        t['passMsg'] = 'Congratulations! You passed the module quiz!'
        t['failMsg'] = 'You need at least 80% to pass. Review the material and try again.'
        t['passThreshold'] = 'Pass Threshold: 80%'
        t['moduleQuiz'] = 'Module Quiz'
        t['quizDesc'] = 'Answer all 5 questions. You need 80% or higher to pass.'
        t['matchComplete'] = 'All matched!'
        t['matchReset'] = 'Reset'
        t['flashTap'] = 'Tap to flip'
    else:
        t['moduleLabel'] = f'الوحدة {module_num}'
        t['title'] = section_data['title']
        t['subtitle'] = section_data.get('shortDescription', '')[:120] + '...'
        t['next'] = 'التالي'
        t['previous'] = 'السابق'
        t['of'] = 'من'
        t['submit'] = 'إرسال'
        t['tryAgain'] = 'حاول مرة أخرى'
        t['checkAnswers'] = 'تحقق من الإجابات'
        t['answered'] = 'تمت الإجابة'
        t['score'] = 'النتيجة'
        t['passMsg'] = 'تهانينا! لقد اجتزت اختبار الوحدة!'
        t['failMsg'] = 'تحتاج إلى 80% على الأقل للنجاح. راجع المادة وحاول مرة أخرى.'
        t['passThreshold'] = 'حد النجاح: 80%'
        t['moduleQuiz'] = 'اختبار الوحدة'
        t['quizDesc'] = 'أجب على جميع الأسئلة الخمسة. تحتاج إلى 80% أو أكثر للنجاح.'
        t['matchComplete'] = 'تم المطابقة بالكامل!'
        t['matchReset'] = 'إعادة'
        t['flashTap'] = 'اضغط للقلب'
    
    # Slide titles (use the title for all slides as generic)
    t['slideTitles'] = [section_data['title']] + [f'Slide {i+1}' for i in range(1, section_data.get('totalSlides', 5))]
    
    # Activity data
    t['activityTitles'] = {}
    for act in section_data.get('activities', []):
        if act['type'] == 'match':
            t['matchTitle'] = act['title']
            t['matchDesc'] = act['description']
            t['matchPairsData'] = act['pairs']
            t['activityTitles']['activity-match'] = act['title']
        elif act['type'] == 'flashcard':
            t['flashTitle'] = act['title']
            t['flashDesc'] = act['description']
            t['flashcardsData'] = act['cards']
            t['activityTitles']['activity-flash'] = act['title']
        elif act['type'] == 'dragdrop':
            t['dragTitle'] = act['title']
            t['dragDesc'] = act['description']
            t['dragItemsData'] = [{'text': item['text']} for item in sorted(act['items'], key=lambda x: x['order'])]
            t['activityTitles']['activity-drag'] = act['title']
    
    # Fill defaults for missing activity types
    if 'matchTitle' not in t:
        t['matchTitle'] = ''
        t['matchDesc'] = ''
        t['matchPairsData'] = []
    if 'flashTitle' not in t:
        t['flashTitle'] = ''
        t['flashDesc'] = ''
        t['flashcardsData'] = []
    if 'dragTitle' not in t:
        t['dragTitle'] = ''
        t['dragDesc'] = ''
        t['dragItemsData'] = []
    
    # Module quiz
    quiz_key = 'moduleQuiz' if lang == 'en' else 'moduleQuizAr'
    t['moduleQuizQs'] = section_data.get(quiz_key, section_data.get('moduleQuiz', []))
    
    # Learning outcomes
    t['outcomes'] = section_data.get('outcomes', [])
    t['tags'] = section_data.get('tags', [])
    
    return t

def build_slide_renderer(module_num, en_data, images_b64, intro_img):
    """Build a generic slide renderer that shows module content."""
    outcomes_en = en_data.get('outcomes', [])
    tags = en_data.get('tags', [])
    
    # For modules 2-5 that don't have the detailed interactive slides like module 1,
    # we create a generic but engaging slide layout
    js = '''
function renderSlide(idx) {
  const tt = t();
  const introImg = INTRO_IMG;
  
  if (idx === 0) {
    // Title slide
    return '<div style="text-align:center">' +
      '<div class="badge badge-cyan" style="margin-bottom:12px">\\ud83d\\udce6 ' + tt.moduleLabel + '</div>' +
      '<h2 class="slide-title">' + tt.title + '</h2>' +
      '<p class="slide-subtitle">' + tt.subtitle + '</p>' +
      (introImg ? '<div style="max-width:400px;margin:0 auto 16px"><img src="' + introImg + '" alt="Module"></div>' : '') +
      '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">' + tt.tags.map(function(tag){return '<span class="tag">' + tag + '</span>'}).join('') + '</div></div>';
  }
  
  if (idx === 1) {
    // Learning Outcomes slide
    const outLabel = STATE.lang === 'en' ? 'Learning Outcomes' : '\\u0645\\u062e\\u0631\\u062c\\u0627\\u062a \\u0627\\u0644\\u062a\\u0639\\u0644\\u0645';
    const outcomes = tt.outcomes || [];
    return '<h2 class="slide-title" style="text-align:center">' + outLabel + '</h2>' +
      '<div style="max-width:600px;margin:16px auto">' +
      outcomes.map(function(o, i) {
        const colors = ['#0891b2', '#7c3aed', '#d97706', '#059669', '#ef4444'];
        return '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;padding:12px;border-radius:12px;background:#fff;border:1px solid #e2e8f0">' +
          '<div style="width:32px;height:32px;border-radius:8px;background:' + colors[i % colors.length] + ';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0">' + (i+1) + '</div>' +
          '<p style="font-size:13px;color:#334155;line-height:1.6;flex:1">' + o + '</p></div>';
      }).join('') + '</div>';
  }
  
  // Generic content slides - show module description with visual variety
  const slideStyles = [
    {bg: 'cyan', icon: '\\ud83d\\udca1', label: STATE.lang === 'en' ? 'Key Concept' : '\\u0645\\u0641\\u0647\\u0648\\u0645 \\u0631\\u0626\\u064a\\u0633\\u064a'},
    {bg: 'violet', icon: '\\ud83d\\udd0d', label: STATE.lang === 'en' ? 'Deep Dive' : '\\u062a\\u0639\\u0645\\u0642'},
    {bg: 'amber', icon: '\\u26a1', label: STATE.lang === 'en' ? 'Important' : '\\u0645\\u0647\\u0645'},
    {bg: 'emerald', icon: '\\u2705', label: STATE.lang === 'en' ? 'Practice' : '\\u062a\\u0637\\u0628\\u064a\\u0642'},
    {bg: 'slate', icon: '\\ud83d\\udcca', label: STATE.lang === 'en' ? 'Overview' : '\\u0646\\u0638\\u0631\\u0629 \\u0639\\u0627\\u0645\\u0629'},
  ];
  const style = slideStyles[(idx - 2) % slideStyles.length];
  const slideTitle = tt.slideTitles[idx] || (tt.title + ' - ' + (STATE.lang === 'en' ? 'Part' : '\\u062c\\u0632\\u0621') + ' ' + idx);
  
  return '<div style="text-align:center;margin-bottom:16px">' +
    '<span style="font-size:32px">' + style.icon + '</span>' +
    '<h2 class="slide-title">' + slideTitle + '</h2>' +
    '<span class="badge badge-' + style.bg + '">' + style.label + '</span></div>' +
    '<div class="info-box ' + style.bg + '" style="max-width:600px;margin:0 auto">' +
    '<p style="font-size:14px;line-height:1.8">' + tt.subtitle + '</p></div>' +
    (introImg && idx % 3 === 0 ? '<div style="max-width:350px;margin:16px auto"><img src="' + introImg + '" alt="Module content"></div>' : '');
}
'''
    return f'const INTRO_IMG = "{intro_img}";\n{js}'


def build_module1_html(en_data, ar_data, intro_img, slide_images):
    """Build Module 1 with full interactive slides (using existing detailed code)."""
    # Read the existing module 1 index.html and modify it to embed images
    existing_path = os.path.join(BASE_DIR, "scorm-module1", "index.html")
    with open(existing_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace image references with base64 data URIs
    for key, b64 in slide_images.items():
        html = html.replace(f'src="images/{key}.png"', f'src="{b64}"')
    
    return html


# ─── MAIN BUILD ───
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load course data by importing it
    sys.path.insert(0, os.path.join(BASE_DIR, 'src', 'data'))
    
    # We can't import ES modules directly, so parse the data from the JS file
    import subprocess
    result = subprocess.run(
        ['node', '-e', '''
const fs = require('fs');
const data = fs.readFileSync('src/data/courseData.js', 'utf8');

// Extract sections
const sectionsMatch = data.match(/export const sections = (\\[[\\s\\S]*?\\n\\];)/);
const sectionsArMatch = data.match(/export const sectionsAr = (\\[[\\s\\S]*?\\n\\];)/);

// We need to evaluate these - wrap in a function
const sections = eval(sectionsMatch[1]);

// For Arabic sections, find them
const arStart = data.indexOf('export const sectionsAr');
const arData = data.substring(arStart);
const sectionsArBody = arData.match(/= (\\[[\\s\\S]*?\\n\\];)/);
const sectionsAr = eval(sectionsArBody[1]);

console.log(JSON.stringify({sections, sectionsAr}));
'''],
        capture_output=True, text=True, cwd=BASE_DIR
    )
    
    if result.returncode != 0:
        print("Error loading course data:", result.stderr)
        sys.exit(1)
    
    course_data = json.loads(result.stdout)
    sections_en = course_data['sections']
    sections_ar = course_data['sectionsAr']
    
    print("=" * 60)
    print("Building SCORM 1.2 packages for all modules")
    print("=" * 60)
    
    zip_files = []
    
    for i, (sec_en, sec_ar) in enumerate(zip(sections_en, sections_ar)):
        module_num = i + 1
        title_en = sec_en['title']
        print(f"\n--- Module {module_num}: {title_en} ---")
        
        # Get intro image
        print("  Compressing intro image...")
        intro_img = get_module_intro_image(module_num)
        
        if module_num == 1:
            # Module 1 has detailed interactive slides with specific images
            print("  Compressing slide images...")
            slide_imgs = {}
            for key, fname in MODULE1_IMAGES.items():
                path = os.path.join(PUBLIC_IMAGES, fname)
                if os.path.exists(path):
                    slide_imgs[key] = compress_image_to_base64(path, max_width=400, quality=50)
            
            html = build_module1_html(sec_en, sec_ar, intro_img, slide_imgs)
        else:
            # Modules 2-5 use generic slide renderer
            html = build_module_html(module_num, sec_en, sec_ar, intro_img)
        
        # Create manifest
        manifest = make_manifest(module_num, title_en)
        
        # Create ZIP
        zip_name = f"module{module_num}-scorm.zip"
        zip_path = os.path.join(OUTPUT_DIR, zip_name)
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('imsmanifest.xml', manifest)
            zf.writestr('index.html', html)
        
        zip_size = os.path.getsize(zip_path) / 1024
        html_size = len(html.encode('utf-8')) / 1024
        print(f"  Created {zip_name}: {zip_size:.0f}KB (HTML: {html_size:.0f}KB)")
        zip_files.append(zip_path)
    
    # Also copy ZIPs to root
    for zp in zip_files:
        shutil.copy2(zp, os.path.join(BASE_DIR, os.path.basename(zp)))
    
    print("\n" + "=" * 60)
    print("Building Open edX course tar.gz...")
    print("=" * 60)
    
    # Build Open edX course
    build_openedx_course(sections_en, zip_files)
    
    print("\n" + "=" * 60)
    print("All packages built successfully!")
    print("=" * 60)
    print(f"\nOutput directory: {OUTPUT_DIR}")
    for zp in zip_files:
        print(f"  - {os.path.basename(zp)}")
    print(f"  - openedx-full-course.tar.gz")

def build_openedx_course(sections_en, zip_files):
    """Build a full Open edX course tar.gz with all modules."""
    course_dir = os.path.join(OUTPUT_DIR, 'openedx-course')
    if os.path.exists(course_dir):
        shutil.rmtree(course_dir)
    
    for d in ['course', 'chapter', 'sequential', 'vertical', 'html', 'policies/course', 'static']:
        os.makedirs(os.path.join(course_dir, d), exist_ok=True)
    
    # course.xml (root)
    with open(os.path.join(course_dir, 'course.xml'), 'w') as f:
        f.write('<course url_name="course" org="HealthAI" course="AIAutomation101" />\n')
    
    # course/course.xml
    chapters = '\n'.join([f'  <chapter url_name="module{i+1}_chapter"/>' for i in range(len(sections_en))])
    with open(os.path.join(course_dir, 'course', 'course.xml'), 'w') as f:
        f.write(f'<course display_name="AI Automation &amp; Vibe Coding - Healthcare" language="en" start="2025-01-01T00:00:00Z">\n{chapters}\n</course>\n')
    
    for i, sec in enumerate(sections_en):
        n = i + 1
        title = sec['title'].replace('&', '&amp;')
        
        # chapter
        with open(os.path.join(course_dir, 'chapter', f'module{n}_chapter.xml'), 'w') as f:
            f.write(f'<chapter display_name="Module {n}: {title}">\n  <sequential url_name="module{n}_seq"/>\n</chapter>\n')
        
        # sequential
        with open(os.path.join(course_dir, 'sequential', f'module{n}_seq.xml'), 'w') as f:
            f.write(f'<sequential display_name="{title}">\n  <vertical url_name="module{n}_unit"/>\n</sequential>\n')
        
        # vertical
        with open(os.path.join(course_dir, 'vertical', f'module{n}_unit.xml'), 'w') as f:
            f.write(f'<vertical display_name="Module {n}: Interactive Content">\n  <html url_name="module{n}_html"/>\n</vertical>\n')
        
        # html component
        with open(os.path.join(course_dir, 'html', f'module{n}_html.xml'), 'w') as f:
            f.write(f'<html display_name="Module {n}: {title}" filename="module{n}_content"/>\n')
        
        # html content - extract from zip and embed directly
        zip_path = zip_files[i]
        with zipfile.ZipFile(zip_path, 'r') as zf:
            html_content = zf.read('index.html').decode('utf-8')
        
        # Write the full HTML as the content file
        with open(os.path.join(course_dir, 'html', f'module{n}_content.html'), 'w', encoding='utf-8') as f:
            # Wrap in iframe-less approach - embed the full content directly
            f.write(f'<div style="width:100%;max-width:960px;margin:0 auto;min-height:800px;" id="scorm-module{n}-container"></div>\n')
            f.write(f'<script>\n')
            f.write(f'// Module {n} content is self-contained in the SCORM zip\n')
            f.write(f'// Upload module{n}-scorm.zip via SCORM XBlock for full interactive experience\n')
            f.write(f'document.getElementById("scorm-module{n}-container").innerHTML = "<p style=\\"text-align:center;padding:40px;color:#64748b;\\">Please upload <strong>module{n}-scorm.zip</strong> using the SCORM XBlock component for the full interactive experience.</p>";\n')
            f.write(f'</script>\n')
    
    # policies
    with open(os.path.join(course_dir, 'policies', 'course', 'policy.json'), 'w') as f:
        json.dump({"course/course": {"advanced_modules": ["scorm"], "display_name": "AI Automation & Vibe Coding - Healthcare"}}, f, indent=2)
    
    with open(os.path.join(course_dir, 'policies', 'course', 'grading_policy.json'), 'w') as f:
        json.dump({"GRADER": [{"type": "SCORM", "min_count": 5, "drop_count": 0, "weight": 1.0}], "GRADE_CUTOFFS": {"Pass": 0.8}}, f, indent=2)
    
    # Copy SCORM zips to static
    for zp in zip_files:
        shutil.copy2(zp, os.path.join(course_dir, 'static', os.path.basename(zp)))
    
    # Create tar.gz
    tar_path = os.path.join(OUTPUT_DIR, 'openedx-full-course.tar.gz')
    with tarfile.open(tar_path, 'w:gz') as tar:
        for root, dirs, files in os.walk(course_dir):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, course_dir)
                tar.add(full_path, arcname=arcname)
    
    # Also copy to root
    shutil.copy2(tar_path, os.path.join(BASE_DIR, 'openedx-full-course.tar.gz'))
    
    tar_size = os.path.getsize(tar_path) / 1024 / 1024
    print(f"  Created openedx-full-course.tar.gz: {tar_size:.1f}MB")

if __name__ == '__main__':
    main()
