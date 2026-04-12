#!/usr/bin/env python3
"""
Build SCORM 1.2 packages for all 5 modules of the AI Automation & Vibe Coding course.
Images are compressed and embedded as base64 data URIs for maximum compatibility with Open edX.
"""

import os, io, json, base64, zipfile, tarfile, shutil
from PIL import Image

OUTPUT_DIR = 'scorm-packages'
COURSE_DIR = 'full-openedx-course'

# ─── Image Compression ───────────────────────────────────────────────────────

def compress_image(path, max_width=500, quality=65):
    img = Image.open(path)
    if img.mode in ('RGBA', 'P'):
        bg = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        bg.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
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
    return f"data:image/jpeg;base64,{b64}"

def load_images():
    """Load and compress all images, return dict of name -> data_uri"""
    imgs = {}
    # Slide images
    img_dir = 'scorm-module1/images'
    if os.path.isdir(img_dir):
        for f in os.listdir(img_dir):
            if f.endswith('.png'):
                imgs[f.replace('.png','')] = compress_image(os.path.join(img_dir, f))
    # Module intro images
    pub_dir = 'public/images'
    if os.path.isdir(pub_dir):
        for f in os.listdir(pub_dir):
            if f.startswith('module') and f.endswith('.png'):
                imgs[f.replace('.png','')] = compress_image(os.path.join(pub_dir, f))
    return imgs

# ─── CSS (shared across all modules) ─────────────────────────────────────────

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
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
.btn-amber{background:var(--amber);color:var(--white)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:640px){.grid-2{grid-template-columns:1fr}}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
@media(max-width:640px){.grid-3{grid-template-columns:1fr}}
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
.click-card{padding:12px;border-radius:var(--radius);border:2px solid #e2e8f0;cursor:pointer;transition:.2s;text-align:left}
[dir="rtl"] .click-card{text-align:right}
.click-card:hover{border-color:var(--cyan);box-shadow:var(--shadow)}
.click-card.active{background:var(--cyan-light);border-color:var(--cyan)}
.click-card .card-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px}
.click-card .card-desc{font-size:11px;color:var(--slate);line-height:1.5;overflow:hidden;max-height:0;transition:.3s}
.click-card.active .card-desc{max-height:200px}
.icon-box{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--white);flex-shrink:0}
.flip-card-btn{padding:10px;border-radius:var(--radius);border:2px solid #e2e8f0;cursor:pointer;transition:.3s;text-align:center;min-height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.flip-card-btn.flipped{background:var(--cyan);border-color:var(--cyan);color:var(--white)}
.flip-card-btn .flip-icon{font-size:22px;margin-bottom:4px}
.flip-card-btn .flip-label{font-size:11px;font-weight:600}
.flip-card-btn .flip-desc{font-size:11px}
.step-row{display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.step-box{flex:1;min-width:60px;padding:6px;border-radius:8px;text-align:center;font-size:10px;font-weight:600;transition:.4s;background:#e2e8f0;color:var(--slate)}
.step-box.active{transform:scale(1.05);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.step-box.done{opacity:.85}
.step-arrow{font-size:12px;color:#cbd5e1}
.flow-tab{flex:1;padding:6px;border-radius:8px;font-size:11px;font-weight:700;transition:.2s;background:var(--slate-light);color:var(--slate);text-align:center}
.flow-tab.active{background:var(--violet);color:var(--white)}
.match-pool{display:flex;flex-direction:column;gap:6px}
.match-item{padding:10px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:.2s;border:2px solid transparent;user-select:none}
.match-item.left{background:#f0f9ff;border-color:#bae6fd;color:#0c4a6e}
.match-item.left.selected{background:#06b6d4;color:#fff;border-color:#06b6d4}
.match-item.right{background:#faf5ff;border-color:#d8b4fe;color:#581c87}
.match-item.right.selected{background:#7c3aed;color:#fff;border-color:#7c3aed}
.match-item.correct{background:var(--emerald-light)!important;border-color:var(--emerald)!important;color:#065f46!important}
.match-item.wrong{background:var(--red-light)!important;border-color:var(--red)!important;color:#991b1b!important}
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
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.animate-in{animation:fadeIn .4s ease forwards}
.hidden{display:none!important}
.scorm-status{position:fixed;bottom:8px;right:8px;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;z-index:999}
[dir="rtl"] .scorm-status{right:auto;left:8px}
.scorm-status.connected{background:#d1fae5;color:#065f46}
.scorm-status.disconnected{background:#fee2e2;color:#991b1b}
.drag-area{min-height:60px;border:2px dashed #e2e8f0;border-radius:var(--radius);padding:8px;display:flex;flex-direction:column;gap:6px}
.drag-item{padding:10px;border-radius:8px;font-size:12px;font-weight:500;cursor:grab;border:2px solid #e2e8f0;background:#fff;user-select:none;display:flex;align-items:center;gap:8px;transition:.2s}
.drag-item:active{cursor:grabbing;box-shadow:var(--shadow)}
.drag-item.placed{background:var(--cyan-light);border-color:var(--cyan)}
.drag-item.correct{background:var(--emerald-light);border-color:var(--emerald);color:#065f46}
.drag-item.wrong{background:var(--red-light);border-color:var(--red);color:#991b1b}
.drag-slot{min-height:40px;border:2px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#94a3b8;padding:6px;transition:.2s}
.drag-slot.filled{border-style:solid;border-color:var(--cyan);background:var(--cyan-light)}
"""

# ─── SCORM 1.2 JavaScript (shared) ───────────────────────────────────────────

SCORM_JS = """
const SCORM = (() => {
  let API = null;
  let connected = false;
  function findAPI(win) {
    let tries = 0;
    while (win && !win.API && tries < 10) {
      tries++;
      if (win.parent && win.parent !== win) { win = win.parent; }
      else if (win.opener) { win = win.opener; }
      else break;
    }
    return win?.API || null;
  }
  function init() {
    API = findAPI(window);
    if (!API && window.opener) API = findAPI(window.opener);
    if (API) {
      const r = API.LMSInitialize('');
      connected = (r === 'true' || r === true);
    }
    updateStatusUI();
    return connected;
  }
  function setValue(key, val) {
    if (!API) return;
    API.LMSSetValue(key, String(val));
    API.LMSCommit('');
  }
  function getValue(key) { if (!API) return ''; return API.LMSGetValue(key); }
  function setScore(score, max, min) { setValue('cmi.core.score.raw', score); setValue('cmi.core.score.max', max||100); setValue('cmi.core.score.min', min||0); }
  function setStatus(status) { setValue('cmi.core.lesson_status', status); }
  function setLocation(loc) { setValue('cmi.core.lesson_location', loc); }
  function getLocation() { return getValue('cmi.core.lesson_location') || ''; }
  function setSuspendData(data) { setValue('cmi.suspend_data', typeof data === 'string' ? data : JSON.stringify(data)); }
  function getSuspendData() { const d = getValue('cmi.suspend_data'); try { return JSON.parse(d); } catch(e) { return d || null; } }
  function finish() { if (API) { API.LMSCommit(''); API.LMSFinish(''); } }
  function updateStatusUI() {
    const el = document.getElementById('scormStatus');
    if (el) { el.textContent = connected ? 'SCORM Connected' : 'SCORM: Standalone'; el.className = 'scorm-status ' + (connected ? 'connected' : 'disconnected'); }
  }
  return { init, setValue, getValue, setScore, setStatus, setLocation, getLocation, setSuspendData, getSuspendData, finish, get connected(){ return connected; } };
})();
"""

# ─── Module definitions ───────────────────────────────────────────────────────

def get_module_data():
    """Return definitions for all 5 modules"""
    modules = []
    
    # ── MODULE 1: Introduction to AI Automation ──
    modules.append({
        'number': 1,
        'id': 'Module1_IntroToAIAutomation',
        'title_en': 'Introduction to AI Automation',
        'title_ar': 'مدخل إلى أتمتة الذكاء الاصطناعي',
        'subtitle_en': 'Fundamentals, Types, and the Difference Between Traditional and AI Systems',
        'subtitle_ar': 'الأساسيات، الأنواع، والفرق بين الأنظمة التقليدية والذكاء الاصطناعي',
        'image_key': 'slide-automation-concept',
        'total_slides': 9,
        'slide_images': {
            0: 'slide-automation-concept',
            2: 'slide-why-automation',
            3: 'slide-trad-vs-ai',
            4: 'slide-automation-types',
            5: 'slide-task-automation',
            6: 'slide-process-automation',
            7: 'slide-intelligent-automation',
        },
        'activities': [
            {
                'type': 'match',
                'title_en': 'Traditional vs AI Automation',
                'title_ar': 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي',
                'desc_en': 'Match each concept to the correct automation type.',
                'desc_ar': 'طابق كل مفهوم مع نوع الأتمتة الصحيح.',
                'pairs_en': [
                    ('Fixed rules: If X, do Y', 'Traditional Automation'),
                    ('Context-aware processing', 'AI Automation'),
                    ('Handles only structured data', 'Traditional Automation'),
                    ('Processes unstructured text & images', 'AI Automation'),
                    ('Adaptive decision logic', 'AI Automation'),
                    ('Rigid predefined workflows', 'Traditional Automation'),
                ],
                'pairs_ar': [
                    ('قواعد ثابتة: إذا حدث X، افعل Y', 'الأتمتة التقليدية'),
                    ('معالجة واعية للسياق', 'أتمتة الذكاء الاصطناعي'),
                    ('تتعامل مع البيانات المنظمة فقط', 'الأتمتة التقليدية'),
                    ('تعالج النصوص والصور غير المنظمة', 'أتمتة الذكاء الاصطناعي'),
                    ('منطق قرار تكيفي', 'أتمتة الذكاء الاصطناعي'),
                    ('سير عمل جامد محدد مسبقًا', 'الأتمتة التقليدية'),
                ],
            },
            {
                'type': 'flashcard',
                'title_en': 'Automation Types Flashcards',
                'title_ar': 'بطاقات أنواع الأتمتة',
                'desc_en': 'Click the card to flip it. Use arrows to navigate.',
                'desc_ar': 'اضغط على البطاقة لقلبها. استخدم الأسهم للتنقل.',
                'cards_en': [
                    ('Task Automation', 'Automates a single, isolated action. Examples: Send confirmation email, create calendar entry.'),
                    ('Process Automation', 'Connects multiple steps into a unified workflow. Examples: HR onboarding, order processing.'),
                    ('Intelligent Automation', 'Combines automation with AI capabilities like predicting, classifying, recommending.'),
                    ('Traditional Automation', 'Fixed, rule-based logic (If X, do Y). Works for structured, predictable tasks.'),
                    ('AI Automation', 'Context-aware automation handling unstructured data and adapting to new situations.'),
                ],
                'cards_ar': [
                    ('أتمتة المهام', 'أتمتة إجراء واحد منفصل. أمثلة: إرسال بريد تأكيد، إنشاء إدخال في التقويم.'),
                    ('أتمتة العمليات', 'ربط خطوات متعددة في سير عمل موحد. أمثلة: تدفق تهيئة الموارد البشرية.'),
                    ('الأتمتة الذكية', 'تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التنبؤ والتصنيف والتوصية.'),
                    ('الأتمتة التقليدية', 'تستخدم منطقًا ثابتًا قائمًا على القواعد. تعمل للمهام المنظمة والمتوقعة.'),
                    ('أتمتة الذكاء الاصطناعي', 'أتمتة واعية للسياق يمكنها التعامل مع البيانات غير المنظمة.'),
                ],
                'icons': ['📄','📊','🧠','⚙️','🤖'],
            },
        ],
        'quiz_en': [
            {'q': 'What is the main purpose of automation?', 'opts': ['To replace all human workers','To use technology to perform tasks with minimal human intervention','To eliminate technology from workflows','To slow down processes'], 'correct': 1},
            {'q': 'Which type of automation focuses on a single isolated action?', 'opts': ['Process Automation','Intelligent Automation','Task Automation','Manual Automation'], 'correct': 2},
            {'q': 'What distinguishes AI automation from traditional?', 'opts': ['AI automation is slower','AI automation uses context-aware, adaptive logic','AI automation only follows fixed rules','AI automation requires no technology'], 'correct': 1},
            {'q': 'Which is an example of Process Automation?', 'opts': ['Sending a confirmation email','An HR onboarding workflow connecting multiple steps','Classifying support tickets using AI','Saving data to a spreadsheet'], 'correct': 1},
            {'q': 'Intelligent Automation combines automation with:', 'opts': ['Manual labor only','Fixed rule-based logic only','AI capabilities like understanding, predicting, classifying','Hardware upgrades'], 'correct': 2},
        ],
        'quiz_ar': [
            {'q': 'ما هو الهدف الرئيسي للأتمتة؟', 'opts': ['استبدال جميع العاملين البشريين','استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري','إلغاء التكنولوجيا من سير العمل','إبطاء العمليات لجودة أفضل'], 'correct': 1},
            {'q': 'أي نوع من الأتمتة يركز على إجراء واحد معزول؟', 'opts': ['أتمتة العمليات','الأتمتة الذكية','أتمتة المهام','الأتمتة اليدوية'], 'correct': 2},
            {'q': 'ما الذي يميز أتمتة الذكاء الاصطناعي عن الأتمتة التقليدية؟', 'opts': ['أتمتة الذكاء الاصطناعي أبطأ','أتمتة الذكاء الاصطناعي تستخدم منطقاً تكيفياً واعياً للسياق','أتمتة الذكاء الاصطناعي تتبع قواعد ثابتة فقط','أتمتة الذكاء الاصطناعي لا تحتاج تكنولوجيا'], 'correct': 1},
            {'q': 'أي مما يلي مثال على أتمتة العمليات؟', 'opts': ['إرسال بريد تأكيد','سير عمل تهيئة الموارد البشرية يربط خطوات متعددة','تصنيف تذاكر الدعم باستخدام الذكاء الاصطناعي','حفظ البيانات في جدول بيانات'], 'correct': 1},
            {'q': 'الأتمتة الذكية تجمع بين الأتمتة و:', 'opts': ['العمل اليدوي فقط','المنطق الثابت القائم على القواعد فقط','قدرات الذكاء الاصطناعي مثل الفهم والتنبؤ والتصنيف','ترقيات الأجهزة'], 'correct': 2},
        ],
    })
    
    # ── MODULE 2: Workflow Thinking ──
    modules.append({
        'number': 2,
        'id': 'Module2_WorkflowThinking',
        'title_en': 'Workflow Thinking',
        'title_ar': 'التفكير بمنهجية سير العمل',
        'subtitle_en': 'Building Blocks: Triggers, Actions, Conditions, and Outputs',
        'subtitle_ar': 'المكونات الأساسية: المحفزات، الإجراءات، الشروط، والمخرجات',
        'image_key': 'module2-workflow-thinking',
        'total_slides': 9,
        'slide_images': {},
        'activities': [
            {
                'type': 'dragdrop',
                'title_en': 'Build a Workflow Sequence',
                'title_ar': 'بناء تسلسل سير العمل',
                'desc_en': 'Arrange the workflow components in the correct order.',
                'desc_ar': 'رتب مكونات سير العمل بالترتيب الصحيح.',
                'items_en': [
                    'Trigger: Patient submits appointment request',
                    'Condition: Check if preferred slot is available',
                    'Action: Send confirmation or alternative options',
                    'Action: Update calendar and patient record',
                    'Output: Confirmation notification to patient',
                ],
                'items_ar': [
                    'المحفز: يقدم المريض طلب موعد',
                    'الشرط: التحقق من توفر الوقت المفضل',
                    'الإجراء: إرسال تأكيد أو خيارات بديلة',
                    'الإجراء: تحديث التقويم وسجل المريض',
                    'المخرج: إشعار تأكيد للمريض',
                ],
            },
            {
                'type': 'match',
                'title_en': 'Workflow Building Blocks',
                'title_ar': 'مكونات سير العمل',
                'desc_en': 'Match each workflow component with its definition.',
                'desc_ar': 'طابق كل مكون مع تعريفه الصحيح.',
                'pairs_en': [
                    ('Starts the workflow automatically', 'Trigger'),
                    ('The task performed by the system', 'Action'),
                    ('Checks if criteria are met before proceeding', 'Condition'),
                    ('The final result delivered to the user', 'Output'),
                    ('New form submission received', 'Trigger'),
                    ('Send email notification', 'Action'),
                ],
                'pairs_ar': [
                    ('يبدأ سير العمل تلقائياً', 'المحفز'),
                    ('المهمة التي ينفذها النظام', 'الإجراء'),
                    ('يتحقق من استيفاء المعايير قبل المتابعة', 'الشرط'),
                    ('النتيجة النهائية المقدمة للمستخدم', 'المخرج'),
                    ('استلام نموذج جديد', 'المحفز'),
                    ('إرسال إشعار بالبريد', 'الإجراء'),
                ],
            },
        ],
        'quiz_en': [
            {'q': 'What is the first element in a typical workflow?', 'opts': ['Action','Output','Trigger','Condition'], 'correct': 2},
            {'q': "What does a 'Condition' do in a workflow?", 'opts': ['Starts the workflow','Checks criteria before proceeding','Delivers the final result','Performs the main task'], 'correct': 1},
            {'q': 'Which component represents the task performed by the system?', 'opts': ['Trigger','Condition','Action','Output'], 'correct': 2},
            {'q': 'In a patient appointment workflow, what would be the trigger?', 'opts': ['Doctor reviews the chart','Patient submits appointment request','System sends confirmation','Appointment is added to calendar'], 'correct': 1},
            {'q': 'Why is workflow thinking important for automation?', 'opts': ['It makes tasks slower','It helps break processes into structured, automatable steps','It eliminates the need for technology','It only works for simple tasks'], 'correct': 1},
        ],
        'quiz_ar': [
            {'q': 'ما هو العنصر الأول في سير العمل النموذجي؟', 'opts': ['الإجراء','المخرج','المحفز','الشرط'], 'correct': 2},
            {'q': "ماذا يفعل 'الشرط' في سير العمل؟", 'opts': ['يبدأ سير العمل','يتحقق من المعايير قبل المتابعة','يقدم النتيجة النهائية','ينفذ المهمة الرئيسية'], 'correct': 1},
            {'q': 'أي مكون يمثل المهمة التي ينفذها النظام؟', 'opts': ['المحفز','الشرط','الإجراء','المخرج'], 'correct': 2},
            {'q': 'في سير عمل مواعيد المرضى، ما هو المحفز؟', 'opts': ['يراجع الطبيب الملف','يقدم المريض طلب موعد','يرسل النظام تأكيداً','يتم إضافة الموعد للتقويم'], 'correct': 1},
            {'q': 'لماذا يعد التفكير بمنهجية سير العمل مهماً للأتمتة؟', 'opts': ['يجعل المهام أبطأ','يساعد في تقسيم العمليات إلى خطوات منظمة قابلة للأتمتة','يلغي الحاجة للتكنولوجيا','يعمل فقط للمهام البسيطة'], 'correct': 1},
        ],
    })
    
    # ── MODULE 3: AI Agents ──
    modules.append({
        'number': 3,
        'id': 'Module3_AIAgents',
        'title_en': 'AI Agents',
        'title_ar': 'وكلاء الذكاء الاصطناعي',
        'subtitle_en': 'Understanding AI Agents and Intelligent Workflow Execution',
        'subtitle_ar': 'فهم وكلاء الذكاء الاصطناعي وتنفيذ سير العمل الذكي',
        'image_key': 'module3-ai-agents',
        'total_slides': 9,
        'slide_images': {},
        'activities': [
            {
                'type': 'flashcard',
                'title_en': 'AI Agent Concepts',
                'title_ar': 'مفاهيم وكلاء الذكاء الاصطناعي',
                'desc_en': 'Click the card to flip it. Use arrows to navigate.',
                'desc_ar': 'اضغط على البطاقة لقلبها. استخدم الأسهم للتنقل.',
                'cards_en': [
                    ('AI Agent', 'A system that can understand goals, interpret context, make decisions, and take autonomous actions.'),
                    ('Goal-Oriented Behavior', 'AI agents work toward defined objectives rather than just following fixed rules.'),
                    ('Agent vs Standard Automation', 'Standard automation follows fixed steps. AI agents can interpret, decide, and adapt.'),
                    ('Decision Support', 'AI agents can analyze data, identify patterns, and recommend actions.'),
                    ('Multi-Step Reasoning', 'AI agents can break complex tasks into sub-tasks, execute sequentially, and adjust.'),
                ],
                'cards_ar': [
                    ('وكيل الذكاء الاصطناعي', 'نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة.'),
                    ('السلوك الموجه بالأهداف', 'يعمل وكلاء الذكاء الاصطناعي نحو أهداف محددة بدلاً من اتباع قواعد ثابتة.'),
                    ('الوكيل مقابل الأتمتة العادية', 'الأتمتة العادية تتبع خطوات ثابتة. وكلاء الذكاء الاصطناعي يمكنهم التفسير والقرار والتكيف.'),
                    ('دعم القرار', 'يمكن لوكلاء الذكاء الاصطناعي تحليل البيانات وتحديد الأنماط والتوصية بالإجراءات.'),
                    ('التفكير متعدد الخطوات', 'يمكن لوكلاء الذكاء الاصطناعي تقسيم المهام المعقدة إلى مهام فرعية والتعديل بناءً على النتائج.'),
                ],
                'icons': ['🤖','🎯','⚡','📊','🧩'],
            },
            {
                'type': 'match',
                'title_en': 'Agent Capabilities Matching',
                'title_ar': 'مطابقة قدرات الوكيل',
                'desc_en': 'Match each capability with the correct description.',
                'desc_ar': 'طابق كل قدرة مع وصفها الصحيح.',
                'pairs_en': [
                    ('Reads and understands patient messages', 'Natural Language Understanding'),
                    ('Prioritizes tasks based on urgency', 'Decision Making'),
                    ('Works toward a defined objective', 'Goal-Oriented Behavior'),
                    ('Adjusts workflow based on new data', 'Adaptive Execution'),
                    ('Calls APIs and updates records', 'Tool Use'),
                    ('Remembers previous interactions', 'Context Awareness'),
                ],
                'pairs_ar': [
                    ('يقرأ ويفهم رسائل المرضى', 'فهم اللغة الطبيعية'),
                    ('يحدد أولويات المهام حسب الإلحاح', 'اتخاذ القرار'),
                    ('يعمل نحو هدف محدد', 'السلوك الموجه بالأهداف'),
                    ('يعدل سير العمل بناءً على بيانات جديدة', 'التنفيذ التكيفي'),
                    ('يستدعي واجهات البرمجة ويحدث السجلات', 'استخدام الأدوات'),
                    ('يتذكر التفاعلات السابقة', 'الوعي بالسياق'),
                ],
            },
        ],
        'quiz_en': [
            {'q': 'What is an AI agent?', 'opts': ['A simple rule-based script','A system that can understand goals, interpret context, and take autonomous actions','A database management tool','A type of spreadsheet'], 'correct': 1},
            {'q': 'How do AI agents differ from standard automation?', 'opts': ['They are identical','AI agents can interpret, decide, and adapt to new situations','Standard automation is more intelligent','AI agents cannot handle data'], 'correct': 1},
            {'q': 'Which capability allows AI agents to understand patient messages?', 'opts': ['Data Storage','Natural Language Understanding','File Management','Network Security'], 'correct': 1},
            {'q': "What is 'goal-oriented behavior' in AI agents?", 'opts': ['Following fixed rules without exception','Working toward defined objectives and adapting based on context','Only processing structured data','Running on a schedule'], 'correct': 1},
            {'q': 'What is multi-step reasoning in AI agents?', 'opts': ['Running one step repeatedly','Breaking complex tasks into sub-tasks and adjusting based on results','Only answering yes/no questions','Storing data in multiple locations'], 'correct': 1},
        ],
        'quiz_ar': [
            {'q': 'ما هو وكيل الذكاء الاصطناعي؟', 'opts': ['برنامج بسيط قائم على القواعد','نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ إجراءات مستقلة','أداة إدارة قواعد البيانات','نوع من جداول البيانات'], 'correct': 1},
            {'q': 'كيف يختلف وكلاء الذكاء الاصطناعي عن الأتمتة العادية؟', 'opts': ['هم متطابقون','يمكن لوكلاء الذكاء الاصطناعي التفسير واتخاذ القرارات والتكيف','الأتمتة العادية أكثر ذكاءً','وكلاء الذكاء الاصطناعي لا يمكنهم معالجة البيانات'], 'correct': 1},
            {'q': 'أي قدرة تسمح لوكلاء الذكاء الاصطناعي بفهم رسائل المرضى؟', 'opts': ['تخزين البيانات','فهم اللغة الطبيعية','إدارة الملفات','أمن الشبكات'], 'correct': 1},
            {'q': "ما هو 'السلوك الموجه بالأهداف' في وكلاء الذكاء الاصطناعي؟", 'opts': ['اتباع قواعد ثابتة بدون استثناء','العمل نحو أهداف محددة والتكيف حسب السياق','معالجة البيانات المهيكلة فقط','التشغيل وفق جدول زمني'], 'correct': 1},
            {'q': 'ما هو التفكير متعدد الخطوات في وكلاء الذكاء الاصطناعي؟', 'opts': ['تشغيل خطوة واحدة بشكل متكرر','تقسيم المهام المعقدة إلى مهام فرعية والتعديل بناءً على النتائج','الإجابة فقط بنعم/لا','تخزين البيانات في مواقع متعددة'], 'correct': 1},
        ],
    })
    
    # ── MODULE 4: Vibe Coding ──
    modules.append({
        'number': 4,
        'id': 'Module4_VibeCoding',
        'title_en': 'Vibe Coding',
        'title_ar': 'البرمجة بالوصف',
        'subtitle_en': 'Prompt-Driven Development and Rapid Prototyping with AI',
        'subtitle_ar': 'التطوير بالأوامر النصية والنمذجة السريعة بالذكاء الاصطناعي',
        'image_key': 'module4-vibe-coding',
        'total_slides': 9,
        'slide_images': {},
        'activities': [
            {
                'type': 'dragdrop',
                'title_en': 'Vibe Coding Workflow',
                'title_ar': 'سير عمل البرمجة بالوصف',
                'desc_en': 'Arrange the vibe coding steps in the correct order.',
                'desc_ar': 'رتب خطوات البرمجة بالوصف بالترتيب الصحيح.',
                'items_en': [
                    'Describe what you want to build in natural language',
                    'AI generates the initial code/app',
                    'Review the generated output',
                    'Refine with follow-up prompts',
                    'Iterate until the solution meets requirements',
                ],
                'items_ar': [
                    'وصف ما تريد بناءه بلغة طبيعية',
                    'يولّد الذكاء الاصطناعي الكود/التطبيق الأولي',
                    'مراجعة المخرجات المُنشأة',
                    'تحسين بأوامر متابعة',
                    'التكرار حتى يلبي الحل المتطلبات',
                ],
            },
            {
                'type': 'flashcard',
                'title_en': 'Vibe Coding Key Concepts',
                'title_ar': 'المفاهيم الرئيسية للبرمجة بالوصف',
                'desc_en': 'Click the card to flip it. Use arrows to navigate.',
                'desc_ar': 'اضغط على البطاقة لقلبها. استخدم الأسهم للتنقل.',
                'cards_en': [
                    ('Vibe Coding', 'Creating digital solutions by describing what you want in natural language, then letting AI generate the code.'),
                    ('Describe > Generate > Refine', 'The core vibe coding loop: describe your idea, AI generates a solution, you refine through iteration.'),
                    ('Prompt-Driven Development', 'Writing natural language instructions to guide AI in building applications.'),
                    ('Rapid Prototyping', 'Quickly creating working prototypes using AI tools for fast testing and validation.'),
                    ('Iteration', 'Repeatedly refining prompts and generated output until the solution meets requirements.'),
                ],
                'cards_ar': [
                    ('البرمجة بالوصف', 'إنشاء حلول رقمية بوصف ما تريد بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولّد الكود.'),
                    ('صف > ولّد > حسّن', 'الحلقة الأساسية: صف فكرتك، يولّد الذكاء الاصطناعي حلاً، تحسّنه بالتكرار.'),
                    ('التطوير بالأوامر النصية', 'كتابة تعليمات بلغة طبيعية لتوجيه الذكاء الاصطناعي في بناء التطبيقات.'),
                    ('النمذجة السريعة', 'إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي.'),
                    ('التكرار', 'تحسين الأوامر والمخرجات بشكل متكرر حتى يلبي الحل المتطلبات.'),
                ],
                'icons': ['💻','🔄','📝','⚡','🔁'],
            },
        ],
        'quiz_en': [
            {'q': 'What is vibe coding?', 'opts': ['A new programming language','Creating solutions using natural language prompts instead of traditional coding','A type of database system','A testing framework'], 'correct': 1},
            {'q': 'What is the core loop of vibe coding?', 'opts': ['Plan, Code, Test','Describe, Generate, Refine','Design, Build, Deploy','Research, Develop, Publish'], 'correct': 1},
            {'q': 'Does vibe coding require extensive programming experience?', 'opts': ['Yes, advanced coding skills are mandatory','No, it uses natural language prompts','Only Python knowledge is needed','Only for experienced developers'], 'correct': 1},
            {'q': "What is 'rapid prototyping' in vibe coding?", 'opts': ['Writing code very fast manually','Quickly creating working prototypes using AI tools','Skipping testing entirely','Copying existing applications'], 'correct': 1},
            {'q': 'Why is iteration important in vibe coding?', 'opts': ['It is not important','It refines prompts and output until the solution meets requirements','It makes the process slower','It replaces testing'], 'correct': 1},
        ],
        'quiz_ar': [
            {'q': 'ما هي البرمجة بالوصف؟', 'opts': ['لغة برمجة جديدة','إنشاء حلول باستخدام أوامر نصية طبيعية بدلاً من البرمجة التقليدية','نوع من أنظمة قواعد البيانات','إطار عمل للاختبار'], 'correct': 1},
            {'q': 'ما هي الحلقة الأساسية للبرمجة بالوصف؟', 'opts': ['خطط، برمج، اختبر','صف، ولّد، حسّن','صمم، ابنِ، انشر','ابحث، طوّر، انشر'], 'correct': 1},
            {'q': 'هل تتطلب البرمجة بالوصف خبرة برمجية واسعة؟', 'opts': ['نعم، مهارات برمجة متقدمة إلزامية','لا، تستخدم أوامر نصية طبيعية','فقط معرفة بايثون مطلوبة','فقط للمطورين المحترفين'], 'correct': 1},
            {'q': "ما هو 'النمذجة السريعة' في سياق البرمجة بالوصف؟", 'opts': ['كتابة الكود بسرعة يدوياً','إنشاء نماذج عمل سريعة باستخدام أدوات الذكاء الاصطناعي','تخطي الاختبار تماماً','نسخ التطبيقات الموجودة'], 'correct': 1},
            {'q': 'لماذا يعد التكرار مهماً في البرمجة بالوصف؟', 'opts': ['ليس مهماً','يحسّن الأوامر والمخرجات حتى يلبي الحل المتطلبات','يجعل العملية أبطأ','يحل محل الاختبار'], 'correct': 1},
        ],
    })
    
    # ── MODULE 5: Designing AI Automation Solutions ──
    modules.append({
        'number': 5,
        'id': 'Module5_DesigningSolutions',
        'title_en': 'Designing AI Automation Solutions & Common Use Cases',
        'title_ar': 'تصميم حلول أتمتة الذكاء الاصطناعي وحالات الاستخدام الشائعة',
        'subtitle_en': 'Identify Opportunities, Design Workflows, and Explore Use Cases',
        'subtitle_ar': 'تحديد الفرص، تصميم سير العمل، واستكشاف حالات الاستخدام',
        'image_key': 'module5-designing-solutions',
        'total_slides': 9,
        'slide_images': {},
        'activities': [
            {
                'type': 'match',
                'title_en': 'Use Case Categories',
                'title_ar': 'فئات حالات الاستخدام',
                'desc_en': 'Match each use case to its category.',
                'desc_ar': 'طابق كل حالة استخدام مع فئتها.',
                'pairs_en': [
                    ('Automated appointment scheduling', 'Operational Coordination'),
                    ('Patient follow-up reminders', 'Communication'),
                    ('Flagging abnormal lab results', 'Decision Support'),
                    ('Auto-generating shift reports', 'Productivity'),
                    ('Tracking medication inventory levels', 'Monitoring & Alerts'),
                    ('Routing referrals to specialists', 'Operational Coordination'),
                ],
                'pairs_ar': [
                    ('جدولة المواعيد الآلية', 'التنسيق التشغيلي'),
                    ('تذكيرات متابعة المرضى', 'التواصل'),
                    ('الإبلاغ عن نتائج المختبر غير الطبيعية', 'دعم القرار'),
                    ('إنشاء تقارير المناوبات تلقائياً', 'الإنتاجية'),
                    ('تتبع مستويات مخزون الأدوية', 'المراقبة والتنبيهات'),
                    ('توجيه الإحالات إلى المتخصصين', 'التنسيق التشغيلي'),
                ],
            },
            {
                'type': 'dragdrop',
                'title_en': 'Solution Design Steps',
                'title_ar': 'خطوات تصميم الحل',
                'desc_en': 'Arrange the solution design process in correct order.',
                'desc_ar': 'رتب عملية تصميم الحل بالترتيب الصحيح.',
                'items_en': [
                    'Identify the problem and repetitive task',
                    'Map the current workflow',
                    'Identify where AI adds value',
                    'Design the automated workflow',
                    'Test, refine, and deploy the solution',
                ],
                'items_ar': [
                    'تحديد المشكلة والمهمة المتكررة',
                    'رسم خريطة سير العمل الحالي',
                    'تحديد أين يضيف الذكاء الاصطناعي قيمة',
                    'تصميم سير العمل المؤتمت',
                    'اختبار وتحسين ونشر الحل',
                ],
            },
        ],
        'quiz_en': [
            {'q': 'What is the first step in designing an AI automation solution?', 'opts': ['Deploy the solution','Write the code','Identify the problem and repetitive task','Purchase software licenses'], 'correct': 2},
            {'q': 'Automated appointment scheduling falls under which use case category?', 'opts': ['Monitoring & Alerts','Decision Support','Operational Coordination','Data Analytics'], 'correct': 2},
            {'q': "What does 'inserting AI where it adds value' mean?", 'opts': ['Replacing all human workers','Adding AI capabilities to steps that benefit from intelligence','Using AI for every single task','Eliminating workflows entirely'], 'correct': 1},
            {'q': "Which category does 'flagging abnormal lab results' belong to?", 'opts': ['Communication','Productivity','Decision Support','Operational Coordination'], 'correct': 2},
            {'q': 'What is the final step in the solution design process?', 'opts': ['Identify the problem','Map the workflow','Design the automation','Test, refine, and deploy the solution'], 'correct': 3},
        ],
        'quiz_ar': [
            {'q': 'ما هي الخطوة الأولى في تصميم حل أتمتة الذكاء الاصطناعي؟', 'opts': ['نشر الحل','كتابة الكود','تحديد المشكلة والمهمة المتكررة','شراء تراخيص البرامج'], 'correct': 2},
            {'q': 'جدولة المواعيد الآلية تندرج تحت أي فئة استخدام؟', 'opts': ['المراقبة والتنبيهات','دعم القرار','التنسيق التشغيلي','تحليل البيانات'], 'correct': 2},
            {'q': "ماذا يعني 'إدخال الذكاء الاصطناعي حيث يضيف قيمة'؟", 'opts': ['استبدال جميع العاملين','إضافة قدرات الذكاء الاصطناعي للخطوات التي تستفيد منه','استخدام الذكاء الاصطناعي لكل مهمة','إلغاء سير العمل بالكامل'], 'correct': 1},
            {'q': "أي فئة ينتمي إليها 'الإبلاغ عن نتائج المختبر غير الطبيعية'؟", 'opts': ['التواصل','الإنتاجية','دعم القرار','التنسيق التشغيلي'], 'correct': 2},
            {'q': 'ما هي الخطوة الأخيرة في عملية تصميم الحل؟', 'opts': ['تحديد المشكلة','رسم خريطة سير العمل','تصميم الأتمتة','اختبار وتحسين ونشر الحل'], 'correct': 3},
        ],
    })
    
    return modules

# Save this as a marker
print("Module data defined: 5 modules")
print("Script structure OK, continuing to build_html and packaging functions...")
