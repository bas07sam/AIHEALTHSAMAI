# Universal SCORM 1.2 Builder Prompt for Open edX

> **Purpose:** Copy and paste this prompt into any AI assistant (ChatGPT, Claude, etc.) to generate a complete, working `build_scorm.py` script that produces per-lesson/topic SCORM 1.2 packages and standalone interactive activity SCORM packages for any course, aligned to Open edX, with Arabic as the default language.

---

## The Prompt

```
You are a Python developer specializing in e-learning standards. Generate a complete, self-contained Python 3 script called `build_scorm.py` that creates SCORM 1.2 packages for the following course. The script must follow the exact template, structure, and conventions described below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COURSE DATA (replace with your course info)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Course Title (EN): [Your Course Title]
Course Title (AR): [عنوان الدورة بالعربية]
Organization: [Your Org Name]
Total Modules: [Number]

For EACH module, provide:
- Module number, English title, Arabic title
- For each slide: id, title_en, title_ar, type (intro/content/summary), image_key (optional), content_en (HTML), content_ar (HTML)

For EACH interactive activity, provide:
- Activity ID (e.g., 's1-match'), type ('match' | 'flashcard' | 'dragdrop'), module number
- English and Arabic titles and descriptions
- For 'match': pairs list with left_en, left_ar, right_en, right_ar
- For 'flashcard': cards list with front_en, front_ar, back_en, back_ar
- For 'dragdrop': items list with id, text_en, text_ar, order (integer)

For images (optional):
- Map image keys to file paths relative to the script directory

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY TEMPLATE REQUIREMENTS (do NOT deviate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DEFAULT LANGUAGE: Arabic (`DEFAULT_LANG = 'ar'`). HTML starts with `<html lang="ar" dir="rtl">`. The language toggle button shows "English" initially.

2. OUTPUT STRUCTURE:
   - One SCORM .zip per slide (content only, NO activities embedded in slides)
   - One SCORM .zip per interactive activity (match, flashcard, drag-and-drop) as a STANDALONE file
   - One Open edX .tar.gz wrapper per SCORM .zip
   - Two combined archives: `all-scorm-zips.tar.gz` and `all-openedx-packages.tar.gz`
   - Output directory: `scorm-output/` with subdirectories `module1/`, `module2/`, etc.

3. NAMING CONVENTION:
   - Slide zips: `m{module}-topic{slide_number}-{slide_id}.zip`
   - Activity zips: `m{module}-activity-{activity_id}.zip`
   - Open edX tars: same name with `-openedx.tar.gz` suffix

4. SCORM 1.2 COMPLIANCE — each .zip must contain exactly:
   - `index.html` — self-contained HTML with embedded CSS, JS, and base64 images
   - `imsmanifest.xml` — valid SCORM 1.2 manifest

5. imsmanifest.xml template:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <manifest identifier="{IDENTIFIER}" version="1.0"
     xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
     xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
     <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
     <organizations default="org_1">
       <organization identifier="org_1">
         <title>{TITLE}</title>
         <item identifier="item_1" identifierref="res_1">
           <title>{TITLE}</title>
           <adlcp:masteryscore>80</adlcp:masteryscore>
         </item>
       </organization>
     </organizations>
     <resources>
       <resource identifier="res_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
         <file href="index.html"/>
       </resource>
     </resources>
   </manifest>
   ```

6. SCORM 1.2 JavaScript API (embed in every index.html):
   ```javascript
   const SCORM=(()=>{let API=null,connected=false;
   function findAPI(w){let t=0;while(w&&!w.API&&t<10){t++;if(w.parent&&w.parent!==w)w=w.parent;else if(w.opener)w=w.opener;else break;}return w?.API||null;}
   function init(){API=findAPI(window);if(!API&&window.opener)API=findAPI(window.opener);if(API){const r=API.LMSInitialize('');connected=(r==='true'||r===true);}updateUI();return connected;}
   function sv(k,v){if(!API)return;API.LMSSetValue(k,String(v));API.LMSCommit('');}
   function gv(k){if(!API)return'';return API.LMSGetValue(k);}
   function setScore(s,mx,mn){sv('cmi.core.score.raw',s);sv('cmi.core.score.max',mx||100);sv('cmi.core.score.min',mn||0);}
   function setStatus(s){sv('cmi.core.lesson_status',s);}
   function finish(){if(API){API.LMSCommit('');API.LMSFinish('');}}
   function updateUI(){const el=document.getElementById('scormStatus');if(el){el.textContent=connected?'SCORM Connected':'Standalone Mode';el.className='scorm-status '+(connected?'connected':'disconnected');}}
   return{init,sv,gv,setScore,setStatus,finish,get connected(){return connected;}};
   })();
   ```

7. SCORM LIFECYCLE (in every index.html):
   ```javascript
   window.addEventListener('load', () => {
     applyLang();
     SCORM.init();
     SCORM.setStatus('incomplete');
     setTimeout(() => {
       SCORM.setStatus('completed');
       SCORM.setScore(100, 100, 0);
     }, 5000);
   });
   window.addEventListener('beforeunload', () => { SCORM.finish(); });
   ```
   For activity pages, the activity JS should call `SCORM.setScore(pct, 100, 0)` when the learner scores >= 80%.

8. BILINGUAL TOGGLE — every page must have:
   - A `toggleLang()` function that switches between 'ar' and 'en'
   - Updates `document.documentElement.lang` and `dir` attributes
   - Toggles visibility of `#contentEN` / `#contentAR` divs
   - Updates title, badges, footer text
   - Dispatches a `langChange` event (so activity JS can react)

9. CSS — use this exact embedded stylesheet (minified, responsive, RTL-aware):
   [Include the full CSS from the template — see reference below]

10. EXCLUSIONS — the generated packages must NOT contain:
    - Videos or YouTube embeds
    - Quiz questions
    - Navigation menus or sidebar
    - External file dependencies (everything is self-contained)

11. IMAGES — load from local paths, convert to base64 JPEG (max width 600px, quality 45), embed as `data:image/jpeg;base64,...` in the HTML. Use Pillow (`from PIL import Image`).

12. OPEN edX .tar.gz WRAPPER — each SCORM zip must be wrapped in an Open edX course export package containing:
    - `course.xml` (root pointer)
    - `course/course.xml` (course metadata with `language="ar"`)
    - `chapter/{id}_chapter.xml`
    - `sequential/{id}_seq.xml`
    - `vertical/{id}_unit.xml`
    - `html/{id}_html.xml` and `html/{id}_html_content.html` (iframe embedding)
    - `policies/course/policy.json` and `policies/course/grading_policy.json`
    - `static/{zip_name}` (the SCORM zip)
    - `static/{folder_name}/index.html` (extracted for direct serving)

13. INTERACTIVE ACTIVITY HTML BUILDERS — the script must define these three functions:

    a) `build_match_html(activity, idx=0)` — Matching activity:
       - Renders left items (violet) and right items (emerald) in a grid
       - Click left, then click right to match
       - Check button validates answers; shows score percentage
       - Reset button allows retry
       - Bilingual: renders text based on current `lang` variable
       - On score >= 80%, calls `SCORM.setScore(pct, 100, 0)`

    b) `build_flashcard_html(activity, idx=0)` — Flashcard activity:
       - Card with front (cyan) and back (amber) using CSS 3D flip
       - RTL-aware flip direction (`rotateY(-180deg)` for RTL)
       - Previous/Next navigation with counter
       - Bilingual front/back text

    c) `build_dragdrop_html(activity, idx=0)` — Drag-and-drop ordering:
       - Draggable list items with drag handles (☰)
       - Items start shuffled; learner reorders by dragging
       - Check button validates order; green = correct position, red = wrong
       - Score percentage display
       - On score >= 80%, calls `SCORM.setScore(pct, 100, 0)`

    All three must:
    - Be wrapped in an IIFE `(function(){ ... })();`
    - Listen for `langChange` event to re-render
    - Use the global `lang` variable for language switching

14. HTML PAGE STRUCTURE for every SCORM package:
    ```html
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{Arabic Title}</title>
      <style>{FULL CSS}</style>
    </head>
    <body>
    <div class="app">
      <div class="card">
        <div class="card-header">
          <div>
            <span class="badge badge-cyan" id="badgeModule">الوحدة {N}</span>
            <span class="badge badge-violet" id="badgeSlide">الموضوع {N}</span>
          </div>
          <button class="lang-btn" onclick="toggleLang()" id="langBtn">English</button>
        </div>
        <div class="card-body animate-in">
          <h2 class="slide-title" id="slideTitle">{Arabic Title}</h2>
          {optional image}
          <div id="contentEN" class="hidden">{English content HTML}</div>
          <div id="contentAR">{Arabic content HTML}</div>
        </div>
        <div class="card-footer">
          <span style="font-size:11px;color:var(--slate)" id="footerInfo">الوحدة {N} من {Total} — {Module Title AR}</span>
        </div>
      </div>
    </div>
    <div class="scorm-status" id="scormStatus"></div>
    <script>{SCORM_JS}</script>
    <script>{LANG_TOGGLE_JS}</script>
    <script>{SCORM_LIFECYCLE_JS}</script>
    </body>
    </html>
    ```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT STRUCTURE (Python)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The script must be organized in this order:
1. Imports: `os, zipfile, json, io, base64, tarfile, shutil` + `from PIL import Image`
2. Configuration: `BASE_DIR`, `OUTPUT_DIR`, `DEFAULT_LANG = 'ar'`, `COURSE_INFO` dict
3. Image loading: `img_to_base64()` helper + load module banners and slide images
4. `ACTIVITIES` dict: all interactive activities keyed by unique ID
5. `MODULES` list: all modules with their slides (content only, no activities)
6. `CSS` string: full embedded CSS
7. `SCORM_JS` string: SCORM 1.2 API JavaScript
8. `build_lang_js()`: language toggle JS builder
9. Activity HTML builders: `build_match_html()`, `build_flashcard_html()`, `build_dragdrop_html()`, `get_activity_html()`
10. `build_page_html()`: full HTML page assembler
11. `build_manifest()`: imsmanifest.xml builder
12. `build_openedx_tar()`: Open edX tar.gz wrapper builder
13. `build_all()`: main build function that:
    - Clears and creates output directory
    - Iterates MODULES → builds slide SCORM zips + Open edX tars
    - Iterates ACTIVITIES → builds standalone activity SCORM zips + Open edX tars
    - Creates combined archives
    - Prints summary
14. `if __name__ == '__main__': build_all()`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Activities are NEVER embedded in slide pages. Each activity is its own separate SCORM package.
- The slide pages contain only the lesson content (text, info boxes, images).
- The activity pages contain a brief description + the interactive widget.
- All HTML content uses info-box classes: `cyan`, `violet`, `amber`, `emerald`, `slate` for visual variety.
- Grid layouts use `.grid-2` class.
- Tags/chips use `.chip` class.
- No external CDN links. No external fonts. No external scripts.
- The script should print progress during build (module names, slide counts, file sizes).
- Dependencies: Python 3.8+, Pillow (`pip install Pillow`). No other packages needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOW GENERATE THE COMPLETE SCRIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Using the course data I provided above, generate the full `build_scorm.py` file. Make sure:
1. Every slide has both English and Arabic content
2. Every activity is a standalone SCORM zip
3. Default language is Arabic with RTL
4. No videos, no quizzes, no menus
5. All CSS, JS, and images are embedded inline
6. Open edX wrappers are created for every package
```

---

## How to Use This Prompt

### Step 1: Prepare Your Course Data
Before using the prompt, organize your course content:

| Data | Format | Example |
|------|--------|---------|
| **Course title** | EN + AR | "Data Science 101" / "علوم البيانات 101" |
| **Modules** | List with titles | Module 1: Introduction, Module 2: Basics... |
| **Slides per module** | ID, titles, HTML content | `m1-s1`, "What is Data?", `<div class="info-box cyan">...</div>` |
| **Activities** | Type + data | Match pairs, Flashcard front/back, Drag-drop items |
| **Images** (optional) | File paths | `public/images/module1-banner.png` |

### Step 2: Fill in the Course Data
Replace the `[Your Course Title]` placeholders in the prompt with your actual course data. Include all modules, slides, and activities.

### Step 3: Run the Prompt
Paste the complete prompt (with your data filled in) into an AI assistant. It will generate a complete `build_scorm.py` script.

### Step 4: Run the Script
```bash
pip install Pillow
python3 build_scorm.py
```

### Step 5: Upload to Open edX
- Individual SCORM zips: Upload via Open edX Studio > SCORM XBlock
- Open edX tar.gz packages: Import via Studio > Import Course
- Combined archives: Extract and upload as needed

---

## Reference: Complete CSS

The full CSS to embed (copy exactly as-is into your generated script):

```css
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6;min-height:100vh;padding:12px}
button{cursor:pointer;font-family:inherit;border:none;background:none}
img{max-width:100%;height:auto;display:block;border-radius:12px}
:root{--cyan:#0891b2;--cyan-light:#ecfeff;--cyan-border:#a5f3fc;--emerald:#059669;--emerald-light:#ecfdf5;--violet:#7c3aed;--violet-light:#f5f3ff;--amber:#d97706;--amber-light:#fffbeb;--red:#dc2626;--red-light:#fef2f2;--slate:#64748b;--slate-light:#f1f5f9;--white:#fff;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.1)}
[dir="rtl"] body{font-family:'Segoe UI',system-ui,sans-serif}
.app{max-width:900px;margin:0 auto}
.hidden{display:none!important}
.card{background:var(--white);border:1px solid #e2e8f0;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.card-header{padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.card-body{padding:16px;min-height:300px}
.card-footer{padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
.badge-cyan{background:var(--cyan-light);color:var(--cyan)}
.badge-violet{background:var(--violet-light);color:var(--violet)}
.badge-amber{background:var(--amber-light);color:var(--amber)}
.lang-btn{padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid #e2e8f0;background:var(--white);color:var(--slate);transition:.2s}
.lang-btn:hover{background:var(--slate-light)}
.slide-title{font-size:22px;font-weight:800;color:#0f172a;margin-bottom:6px;line-height:1.3}
.slide-subtitle{font-size:14px;color:var(--slate);margin-bottom:12px}
.info-box{padding:12px;border-radius:var(--radius);margin-bottom:10px;font-size:13px;line-height:1.7}
.info-box.cyan{background:var(--cyan-light);border:1px solid var(--cyan-border);color:#155e75}
.info-box.violet{background:var(--violet-light);border:1px solid #c4b5fd;color:#5b21b6}
.info-box.amber{background:var(--amber-light);border:1px solid #fcd34d;color:#92400e}
.info-box.emerald{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}
.info-box.red{background:var(--red-light);border:1px solid #fca5a5;color:#991b1b}
.info-box.slate{background:var(--slate-light);border:1px solid #cbd5e1;color:#334155}
.chip{display:inline-flex;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:500;background:var(--slate-light);color:var(--slate);border:1px solid #e2e8f0;margin:3px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:640px){.grid-2{grid-template-columns:1fr}}
.btn{padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;transition:.2s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--cyan);color:var(--white);box-shadow:0 1px 2px rgba(0,0,0,.15)}
.btn-primary:hover{background:#0e7490}
.btn-outline{border:1px solid #e2e8f0;color:var(--slate);background:var(--white)}
.btn-outline:hover{background:var(--slate-light)}
.section-divider{margin:16px 0;padding:12px;border-radius:var(--radius);background:linear-gradient(135deg,#06b6d4,#0284c7);color:#fff;text-align:center;font-weight:700;font-size:14px}
.scorm-status{position:fixed;bottom:8px;right:8px;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;z-index:999}
[dir="rtl"] .scorm-status{right:auto;left:8px}
.scorm-status.connected{background:#d1fae5;color:#065f46}
.scorm-status.disconnected{background:#fee2e2;color:#991b1b}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.animate-in{animation:fadeIn .4s ease forwards}
.activity-section{margin-top:20px;padding-top:16px;border-top:2px dashed #e2e8f0}
.activity-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:4px}
.activity-desc{font-size:12px;color:var(--slate);margin-bottom:12px}
.match-grid{display:grid;gap:8px}
.match-item{display:flex;gap:8px;align-items:stretch}
.match-left,.match-right{flex:1;padding:10px;border-radius:8px;font-size:12px;line-height:1.5}
.match-left{background:var(--violet-light);border:1px solid #c4b5fd;color:#5b21b6;cursor:pointer;transition:.2s}
.match-right{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}
.match-left:hover{border-color:var(--violet);transform:scale(1.02)}
.match-left.matched{opacity:.5;cursor:default}
.match-left.correct{background:#d1fae5;border-color:#059669}
.match-left.wrong{background:#fef2f2;border-color:#dc2626}
.flash-card{perspective:1000px;cursor:pointer;margin-bottom:8px}
.flash-inner{position:relative;width:100%;min-height:100px;transition:transform .5s;transform-style:preserve-3d}
.flash-card.flipped .flash-inner{transform:rotateY(180deg)}
[dir="rtl"] .flash-card.flipped .flash-inner{transform:rotateY(-180deg)}
.flash-front,.flash-back{position:absolute;top:0;left:0;width:100%;min-height:100px;backface-visibility:hidden;border-radius:var(--radius);padding:14px;font-size:13px;display:flex;align-items:center;justify-content:center;text-align:center}
.flash-front{background:var(--cyan-light);border:1px solid var(--cyan-border);color:#155e75;font-weight:700}
.flash-back{background:var(--amber-light);border:1px solid #fcd34d;color:#92400e;transform:rotateY(180deg);line-height:1.6}
[dir="rtl"] .flash-back{transform:rotateY(-180deg)}
.flash-nav{display:flex;gap:8px;justify-content:center;margin-top:8px}
.drag-list{list-style:none;padding:0}
.drag-item{padding:10px 14px;margin-bottom:6px;border-radius:8px;border:2px solid #e2e8f0;background:var(--white);font-size:12px;cursor:grab;transition:.2s;display:flex;align-items:center;gap:8px}
.drag-item:hover{border-color:var(--cyan);background:var(--cyan-light)}
.drag-item.correct-pos{border-color:var(--emerald);background:var(--emerald-light)}
.drag-item.wrong-pos{border-color:var(--red);background:var(--red-light)}
.drag-handle{color:var(--slate);font-size:14px;user-select:none}
```

---

## Example: Minimal Course (2 Modules, 1 Activity Each)

Here is a minimal example of how to structure course data in the prompt:

```
COURSE DATA:

Course Title (EN): Introduction to Project Management
Course Title (AR): مقدمة في إدارة المشاريع
Organization: PMOrg
Total Modules: 2

MODULE 1: "Project Basics" / "أساسيات المشاريع" (3 slides)

Slide 1: id='m1-s1', type='intro'
  title_en: "Introduction to Project Management"
  title_ar: "مقدمة في إدارة المشاريع"
  content_en: '<div class="info-box cyan"><strong>What you will learn:</strong><ul><li>Define project management</li><li>Understand project lifecycle</li></ul></div>'
  content_ar: '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><ul><li>تعريف إدارة المشاريع</li><li>فهم دورة حياة المشروع</li></ul></div>'

Slide 2: id='m1-s2', type='content'
  title_en: "What is a Project?"
  title_ar: "ما هو المشروع؟"
  content_en: '<div class="info-box cyan"><strong>A project</strong> is a temporary endeavor with a defined beginning and end.</div>'
  content_ar: '<div class="info-box cyan"><strong>المشروع</strong> هو مسعى مؤقت بداية ونهاية محددتين.</div>'

Slide 3: id='m1-s3', type='summary'
  title_en: "Module 1 Summary"
  title_ar: "ملخص الوحدة الأولى"
  content_en: '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul><li>Projects are temporary</li><li>They have defined scope, time, and budget</li></ul></div>'
  content_ar: '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul><li>المشاريع مؤقتة</li><li>لها نطاق ووقت وميزانية محددة</li></ul></div>'

ACTIVITY for Module 1: Match activity
  id: 's1-match'
  title_en: "Project Characteristics"
  title_ar: "خصائص المشروع"
  desc_en: "Match each characteristic to its meaning"
  desc_ar: "طابق كل خاصية مع معناها"
  pairs:
    - left_en: "Has a defined start and end", left_ar: "له بداية ونهاية", right_en: "Temporary", right_ar: "مؤقت"
    - left_en: "Produces a unique result", left_ar: "ينتج نتيجة فريدة", right_en: "Unique", right_ar: "فريد"
    - left_en: "Refined over time", left_ar: "يتم تحسينه بمرور الوقت", right_en: "Progressive Elaboration", right_ar: "التوضيح التدريجي"

MODULE 2: "Project Lifecycle" / "دورة حياة المشروع" (2 slides)
[... similar structure ...]

ACTIVITY for Module 2: Drag-and-drop
  id: 's2-drag'
  title_en: "Project Phases Order"
  title_ar: "ترتيب مراحل المشروع"
  desc_en: "Arrange the project phases in correct order"
  desc_ar: "رتب مراحل المشروع بالترتيب الصحيح"
  items:
    - id: 'initiate', text_en: "Initiating", text_ar: "البدء", order: 1
    - id: 'plan', text_en: "Planning", text_ar: "التخطيط", order: 2
    - id: 'execute', text_en: "Executing", text_ar: "التنفيذ", order: 3
    - id: 'monitor', text_en: "Monitoring & Controlling", text_ar: "المراقبة والتحكم", order: 4
    - id: 'close', text_en: "Closing", text_ar: "الإغلاق", order: 5
```

---

## Verification Checklist

After generating and running the script, verify:

- [ ] Default language is Arabic (check `let lang = 'ar'` in any index.html)
- [ ] HTML starts with `<html lang="ar" dir="rtl">`
- [ ] No YouTube/video references in any package
- [ ] No quiz references in any package
- [ ] Each activity is a separate .zip file (not embedded in slides)
- [ ] Every .zip contains exactly `index.html` + `imsmanifest.xml`
- [ ] imsmanifest.xml uses SCORM 1.2 schema (`imscp_rootv1p1p2`, `adlcp:scormtype`)
- [ ] Language toggle works (button text switches between "English" / "العربية")
- [ ] RTL direction toggles with language
- [ ] Open edX tar.gz contains proper course structure
- [ ] Activities report score to SCORM API on >= 80%
- [ ] Combined archives contain all packages

---

## File Reference

| File | Purpose |
|------|---------|
| `build_universal_scorm.py` | Working reference implementation for the HealthAI course |
| `SCORM_BUILDER_PROMPT.md` | This document — the reusable prompt template |
| `scorm-output/` | Generated SCORM packages |
| `scorm-output/all-scorm-zips.tar.gz` | All SCORM zips in one archive |
| `scorm-output/all-openedx-packages.tar.gz` | All Open edX packages in one archive |
