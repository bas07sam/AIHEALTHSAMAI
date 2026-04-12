#!/usr/bin/env python3
"""
Build per-slide Open edX course export packages (.tar.gz) for each slide/topic.

Each package is a proper Open edX course export with:
  - course.xml (root pointer)
  - course/course.xml (course structure with chapters)
  - chapter/*.xml
  - sequential/*.xml
  - vertical/*.xml
  - html/*.xml + html/*_content.html
  - policies/course/policy.json + grading_policy.json
  - static/<scorm-zip> + static/<module-folder>/index.html

This mirrors the structure of the working full-course-openedx.tar.gz
so Open edX can import each slide as a standalone mini-course.
"""

import os, zipfile, json, io, base64, tarfile, shutil, re
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'scorm-per-slide-openedx')

# ─── Compress images to JPEG base64 ───
def img_to_base64(path, max_w=600, quality=45):
    if not os.path.exists(path):
        return None
    img = Image.open(path).convert('RGB')
    ratio = max_w / img.width if img.width > max_w else 1
    if ratio < 1:
        img = img.resize((int(img.width*ratio), int(img.height*ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=quality, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

# Load module images
print("Loading images...")
MODULE_IMAGES = {}
img_map = {
    1: 'public/images/module1-intro-ai-automation.png',
    2: 'public/images/module2-workflow-thinking.png',
    3: 'public/images/module3-ai-agents.png',
    4: 'public/images/module4-vibe-coding.png',
    5: 'public/images/module5-designing-solutions.png',
}
for mod_num, path in img_map.items():
    full = os.path.join(BASE_DIR, path)
    b64 = img_to_base64(full)
    if b64:
        MODULE_IMAGES[mod_num] = b64
        print(f"  Module {mod_num} image: {len(b64)//1024}KB base64")

# Module 1 slide images
SLIDE_IMAGES = {}
slide_img_map = {
    'automation-concept': 'scorm-module1/images/slide-automation-concept.png',
    'why-automation': 'scorm-module1/images/slide-why-automation.png',
    'trad-vs-ai': 'scorm-module1/images/slide-trad-vs-ai.png',
    'automation-types': 'scorm-module1/images/slide-automation-types.png',
    'task-automation': 'scorm-module1/images/slide-task-automation.png',
    'process-automation': 'scorm-module1/images/slide-process-automation.png',
    'intelligent-automation': 'scorm-module1/images/slide-intelligent-automation.png',
}
for key, path in slide_img_map.items():
    full = os.path.join(BASE_DIR, path)
    b64 = img_to_base64(full)
    if b64:
        SLIDE_IMAGES[key] = b64
        print(f"  Slide image '{key}': {len(b64)//1024}KB base64")


# ══════════════════════════════════════════════════════════════
# COURSE CONTENT - same as in build_per_slide_scorm.py
# ══════════════════════════════════════════════════════════════

MODULES = [
    # ── MODULE 1: Introduction to AI Automation ──
    {
        'number': 1,
        'title': 'Introduction to AI Automation',
        'title_ar': 'مقدمة في أتمتة الذكاء الاصطناعي',
        'intro_video': 'https://www.youtube.com/embed/NMTqEMZxrNI',
        'conclusion_video': 'https://www.youtube.com/embed/ct0SsiLSgfo',
        'slides': [
            {
                'id': 'm1-s1', 'title': 'Introduction to AI Automation',
                'title_ar': 'مقدمة في أتمتة الذكاء الاصطناعي',
                'type': 'intro', 'image_key': 'module_1',
                'content_en': '<p class="slide-subtitle">Fundamentals, Types, and the Difference Between Traditional and AI Systems</p><div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Define what automation means</li><li>Distinguish between traditional and AI automation</li><li>Identify the three core types of automation</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#AutomationBasics</span><span class="chip">#TraditionalAutomation</span><span class="chip">#AIAutomation</span><span class="chip">#TaskAutomation</span><span class="chip">#ProcessAutomation</span><span class="chip">#IntelligentAutomation</span></div>',
                'content_ar': '<p class="slide-subtitle">الأساسيات والأنواع والفرق بين الأنظمة التقليدية والذكاء الاصطناعي</p><div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تعريف معنى الأتمتة</li><li>التمييز بين الأتمتة التقليدية وأتمتة الذكاء الاصطناعي</li><li>تحديد الأنواع الثلاثة الأساسية للأتمتة</li></ul></div>',
                'has_video': True, 'video_type': 'intro',
            },
            {
                'id': 'm1-s2', 'title': 'What is Automation?',
                'title_ar': 'ما هي الأتمتة؟', 'type': 'content', 'image_key': 'automation-concept',
                'content_en': '<div class="info-box cyan"><strong>Definition:</strong> Automation is the use of technology to perform tasks with minimal human intervention, reducing manual effort and increasing efficiency.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Aspects of Automation:</strong><ul style="margin:8px 0 0 16px"><li><strong>Technology-Driven:</strong> Uses software, AI, or machines to execute tasks</li><li><strong>Minimal Human Intervention:</strong> Reduces or eliminates manual steps</li><li><strong>Efficiency Focused:</strong> Speeds up processes while reducing errors</li><li><strong>Scalable:</strong> Can handle increasing workloads without proportional increase in effort</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Examples in Healthcare:</strong> Automated appointment reminders, lab result notifications, inventory tracking, patient follow-up emails.</div>',
                'content_ar': '<div class="info-box cyan"><strong>التعريف:</strong> الأتمتة هي استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري، مما يقلل الجهد اليدوي ويزيد الكفاءة.</div><div class="info-box violet" style="margin-top:12px"><strong>الجوانب الرئيسية للأتمتة:</strong><ul style="margin:8px 0 0 16px"><li><strong>مدفوعة بالتكنولوجيا:</strong> تستخدم البرمجيات أو الذكاء الاصطناعي أو الآلات لتنفيذ المهام</li><li><strong>أقل تدخل بشري:</strong> تقلل أو تلغي الخطوات اليدوية</li><li><strong>تركز على الكفاءة:</strong> تسرع العمليات مع تقليل الأخطاء</li><li><strong>قابلة للتوسع:</strong> يمكنها التعامل مع أحمال عمل متزايدة</li></ul></div>',
            },
            {
                'id': 'm1-s3', 'title': 'Why Automation Matters',
                'title_ar': 'لماذا الأتمتة مهمة', 'type': 'content', 'image_key': 'why-automation',
                'content_en': '<div class="info-box cyan"><strong>Why does automation matter?</strong> In modern work environments, automation addresses key challenges:</div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Saves Time</strong><br>Reduces hours spent on repetitive manual tasks</div><div class="info-box violet"><strong>Reduces Errors</strong><br>Consistent execution without human mistakes</div><div class="info-box amber"><strong>Increases Productivity</strong><br>Frees staff to focus on higher-value work</div><div class="info-box cyan"><strong>Enables Scalability</strong><br>Handles growing workloads without adding staff</div></div><div class="info-box slate" style="margin-top:12px"><strong>Healthcare Impact:</strong> Healthcare environments involve repetitive administrative work, manual follow-ups, documentation burden, fragmented communication, and time-sensitive coordination. Automation can help address all of these.</div>',
                'content_ar': '<div class="info-box cyan"><strong>لماذا الأتمتة مهمة؟</strong> في بيئات العمل الحديثة، تعالج الأتمتة تحديات رئيسية:</div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>توفير الوقت</strong><br>تقليل الساعات المنفقة على المهام اليدوية المتكررة</div><div class="info-box violet"><strong>تقليل الأخطاء</strong><br>تنفيذ متسق بدون أخطاء بشرية</div><div class="info-box amber"><strong>زيادة الإنتاجية</strong><br>تحرير الموظفين للتركيز على العمل الأعلى قيمة</div><div class="info-box cyan"><strong>تمكين التوسع</strong><br>التعامل مع أحمال العمل المتزايدة بدون إضافة موظفين</div></div>',
            },
            {
                'id': 'm1-s4', 'title': 'Traditional vs AI Automation',
                'title_ar': 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي', 'type': 'content', 'image_key': 'trad-vs-ai',
                'content_en': '<div class="grid-2"><div class="info-box violet"><strong>Traditional Automation</strong><br><br><ul style="margin-left:16px"><li>Fixed rules: If X, do Y</li><li>Handles only structured data</li><li>Rigid, predefined workflows</li><li>Cannot handle exceptions</li><li>Good for predictable, repetitive tasks</li></ul></div><div class="info-box emerald"><strong>AI Automation</strong><br><br><ul style="margin-left:16px"><li>Context-aware processing</li><li>Processes unstructured text &amp; images</li><li>Adaptive decision logic</li><li>Handles ambiguity and exceptions</li><li>Learns and improves over time</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>Key Difference:</strong> Traditional automation follows fixed rules. AI automation can interpret, decide, and adapt.</div>',
                'content_ar': '<div class="grid-2"><div class="info-box violet"><strong>الأتمتة التقليدية</strong><br><br><ul style="margin-right:16px"><li>قواعد ثابتة: إذا حدث X، افعل Y</li><li>تتعامل مع البيانات المنظمة فقط</li><li>سير عمل جامد محدد مسبقا</li><li>لا تستطيع التعامل مع الاستثناءات</li></ul></div><div class="info-box emerald"><strong>أتمتة الذكاء الاصطناعي</strong><br><br><ul style="margin-right:16px"><li>معالجة واعية للسياق</li><li>تعالج النصوص والصور غير المنظمة</li><li>منطق قرار تكيفي</li><li>تتعامل مع الغموض والاستثناءات</li></ul></div></div>',
            },
            {
                'id': 'm1-s5', 'title': 'Three Types of Automation',
                'title_ar': 'الأنواع الثلاثة للأتمتة', 'type': 'content', 'image_key': 'automation-types',
                'content_en': '<div class="info-box cyan"><strong>Understanding the three core types of automation helps you identify which approach fits different tasks.</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. Task Automation</strong><br>Automates a single, isolated action.<br><em>Examples: Send confirmation email, create calendar entry, save to spreadsheet.</em></div><div class="info-box violet" style="margin-bottom:8px"><strong>2. Process Automation</strong><br>Connects multiple steps into a unified workflow.<br><em>Examples: HR onboarding flow, order processing pipeline.</em></div><div class="info-box amber"><strong>3. Intelligent Automation</strong><br>Combines automation with AI capabilities like predicting, classifying, and recommending.<br><em>Examples: Classify &amp; route tickets, summarize text, detect anomalies.</em></div></div>',
                'content_ar': '<div class="info-box cyan"><strong>فهم الأنواع الثلاثة الأساسية للأتمتة يساعدك في تحديد النهج المناسب للمهام المختلفة.</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. أتمتة المهام</strong><br>أتمتة إجراء واحد منفصل.</div><div class="info-box violet" style="margin-bottom:8px"><strong>2. أتمتة العمليات</strong><br>ربط خطوات متعددة في سير عمل موحد.</div><div class="info-box amber"><strong>3. الأتمتة الذكية</strong><br>تجمع بين الأتمتة وقدرات الذكاء الاصطناعي.</div></div>',
            },
            {
                'id': 'm1-s6', 'title': 'Task Automation Deep Dive',
                'title_ar': 'أتمتة المهام بالتفصيل', 'type': 'content', 'image_key': 'task-automation',
                'content_en': '<div class="info-box emerald"><strong>Task Automation</strong> automates a single, isolated action — the simplest form of automation.</div><div class="info-box cyan" style="margin-top:12px"><strong>Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Single action, not connected to other steps</li><li>Rule-based: follows simple if/then logic</li><li>Quick to set up and easy to maintain</li><li>Great starting point for automation beginners</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Send appointment confirmation email</li><li>Create calendar event when booking is made</li><li>Auto-save patient intake form data to spreadsheet</li><li>Send reminder SMS 24 hours before appointment</li></ul></div>',
                'content_ar': '<div class="info-box emerald"><strong>أتمتة المهام</strong> تؤتمت إجراء واحدا منفصلا — أبسط أشكال الأتمتة.</div><div class="info-box cyan" style="margin-top:12px"><strong>الخصائص:</strong><ul style="margin:8px 0 0 16px"><li>إجراء واحد، غير مرتبط بخطوات أخرى</li><li>قائم على القواعد: يتبع منطق إذا/ثم بسيط</li><li>سريع الإعداد وسهل الصيانة</li></ul></div>',
            },
            {
                'id': 'm1-s7', 'title': 'Process Automation Deep Dive',
                'title_ar': 'أتمتة العمليات بالتفصيل', 'type': 'content', 'image_key': 'process-automation',
                'content_en': '<div class="info-box violet"><strong>Process Automation</strong> connects multiple automated steps into a unified workflow.</div><div class="info-box cyan" style="margin-top:12px"><strong>Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Multiple connected steps in sequence</li><li>May include conditions and branching</li><li>Data flows from one step to the next</li><li>Reduces handoffs between systems and people</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example — HR Onboarding:</strong><ol style="margin:8px 0 0 16px"><li>New employee fills out form → System creates account</li><li>IT receives notification → Provisions access</li><li>HR sends welcome packet → Calendar is updated</li><li>Training modules are assigned → Progress tracking begins</li></ol></div>',
                'content_ar': '<div class="info-box violet"><strong>أتمتة العمليات</strong> تربط خطوات آلية متعددة في سير عمل موحد.</div><div class="info-box cyan" style="margin-top:12px"><strong>الخصائص:</strong><ul style="margin:8px 0 0 16px"><li>خطوات متعددة مترابطة بالتتابع</li><li>قد تتضمن شروطا وتفرعات</li><li>تتدفق البيانات من خطوة إلى التالية</li></ul></div>',
            },
            {
                'id': 'm1-s8', 'title': 'Intelligent Automation Deep Dive',
                'title_ar': 'الأتمتة الذكية بالتفصيل', 'type': 'content', 'image_key': 'intelligent-automation',
                'content_en': '<div class="info-box amber"><strong>Intelligent Automation</strong> combines automation with AI capabilities like understanding, predicting, classifying, and recommending.</div><div class="info-box cyan" style="margin-top:12px"><strong>AI Capabilities Added:</strong><ul style="margin:8px 0 0 16px"><li><strong>Understanding:</strong> Reads and interprets unstructured text, images, voice</li><li><strong>Predicting:</strong> Forecasts outcomes based on patterns in data</li><li><strong>Classifying:</strong> Categorizes items (e.g., urgent vs routine)</li><li><strong>Recommending:</strong> Suggests next best actions</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Classify and route patient support tickets using AI</li><li>Summarize clinical notes automatically</li><li>Detect anomalies in lab results</li><li>Predict no-show risk for appointments</li></ul></div>',
                'content_ar': '<div class="info-box amber"><strong>الأتمتة الذكية</strong> تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل الفهم والتنبؤ والتصنيف والتوصية.</div><div class="info-box cyan" style="margin-top:12px"><strong>قدرات الذكاء الاصطناعي المضافة:</strong><ul style="margin:8px 0 0 16px"><li><strong>الفهم:</strong> يقرأ ويفسر النصوص والصور والصوت غير المنظمة</li><li><strong>التنبؤ:</strong> يتوقع النتائج بناء على أنماط البيانات</li><li><strong>التصنيف:</strong> يصنف العناصر</li><li><strong>التوصية:</strong> يقترح أفضل الإجراءات التالية</li></ul></div>',
            },
            {
                'id': 'm1-s9', 'title': 'Module 1 Summary & Key Takeaways',
                'title_ar': 'ملخص الوحدة الأولى والنقاط الرئيسية', 'type': 'summary',
                'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Automation</strong> = Using technology to perform tasks with minimal human intervention</li><li><strong>Traditional Automation</strong> follows fixed rules; <strong>AI Automation</strong> adapts and learns</li><li><strong>Task Automation:</strong> Single actions (send email, save data)</li><li><strong>Process Automation:</strong> Multi-step workflows (onboarding, order processing)</li><li><strong>Intelligent Automation:</strong> AI-enhanced (classify, predict, summarize)</li></ul></div>',
                'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>الأتمتة</strong> = استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري</li><li><strong>الأتمتة التقليدية</strong> تتبع قواعد ثابتة; <strong>أتمتة الذكاء الاصطناعي</strong> تتكيف وتتعلم</li><li><strong>أتمتة المهام:</strong> إجراءات منفردة</li><li><strong>أتمتة العمليات:</strong> سير عمل متعدد الخطوات</li><li><strong>الأتمتة الذكية:</strong> معززة بالذكاء الاصطناعي</li></ul></div>',
                'has_video': True, 'video_type': 'conclusion',
            },
        ],
        'quiz': [
            {'q': 'What is the main purpose of automation?', 'q_ar': 'ما هو الهدف الرئيسي للأتمتة؟', 'opts': ['To replace all human workers', 'To use technology to perform tasks with minimal human intervention', 'To eliminate technology from workflows', 'To slow down processes'], 'opts_ar': ['استبدال جميع العمال البشريين', 'استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري', 'إلغاء التكنولوجيا من سير العمل', 'إبطاء العمليات'], 'correct': 1},
            {'q': 'Which type of automation focuses on a single isolated action?', 'q_ar': 'أي نوع من الأتمتة يركز على إجراء واحد معزول؟', 'opts': ['Process Automation', 'Intelligent Automation', 'Task Automation', 'Manual Automation'], 'opts_ar': ['أتمتة العمليات', 'الأتمتة الذكية', 'أتمتة المهام', 'الأتمتة اليدوية'], 'correct': 2},
            {'q': 'What distinguishes AI automation from traditional automation?', 'q_ar': 'ما الذي يميز أتمتة الذكاء الاصطناعي عن الأتمتة التقليدية؟', 'opts': ['AI automation is slower', 'AI automation uses context-aware, adaptive logic', 'AI automation only follows fixed rules', 'AI automation requires no technology'], 'opts_ar': ['أتمتة الذكاء الاصطناعي أبطأ', 'تستخدم منطقا تكيفيا واعيا للسياق', 'تتبع قواعد ثابتة فقط', 'لا تحتاج تكنولوجيا'], 'correct': 1},
            {'q': 'Which is an example of Process Automation?', 'q_ar': 'أي مما يلي مثال على أتمتة العمليات؟', 'opts': ['Sending a confirmation email', 'An HR onboarding workflow connecting multiple steps', 'Classifying support tickets using AI', 'Saving data to a spreadsheet'], 'opts_ar': ['إرسال بريد تأكيد', 'سير عمل تهيئة الموارد البشرية يربط خطوات متعددة', 'تصنيف تذاكر الدعم بالذكاء الاصطناعي', 'حفظ البيانات في جدول'], 'correct': 1},
            {'q': 'Intelligent Automation combines automation with:', 'q_ar': 'الأتمتة الذكية تجمع بين الأتمتة و:', 'opts': ['Manual labor only', 'Fixed rule-based logic only', 'AI capabilities like understanding, predicting, and classifying', 'Hardware upgrades'], 'opts_ar': ['العمل اليدوي فقط', 'المنطق الثابت القائم على القواعد فقط', 'قدرات الذكاء الاصطناعي مثل الفهم والتنبؤ والتصنيف', 'ترقيات الأجهزة'], 'correct': 2},
        ],
    },
    # ── MODULE 2: Workflow Thinking ──
    {
        'number': 2,
        'title': 'Workflow Thinking',
        'title_ar': 'التفكير في سير العمل',
        'intro_video': 'https://www.youtube.com/embed/DlQRa1ibt20',
        'conclusion_video': 'https://www.youtube.com/embed/D2thFBOajKU',
        'slides': [
            {'id': 'm2-s1', 'title': 'Introduction to Workflow Thinking', 'title_ar': 'مقدمة في التفكير بسير العمل', 'type': 'intro', 'image_key': 'module_2', 'has_video': True, 'video_type': 'intro',
             'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Understand workflow structure and components</li><li>Identify triggers, actions, conditions, and outputs</li><li>Map a process into a structured workflow</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#WorkflowThinking</span><span class="chip">#TriggersAndActions</span><span class="chip">#Conditions</span><span class="chip">#ProcessMapping</span></div>',
             'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>فهم هيكل ومكونات سير العمل</li><li>تحديد المحفزات والإجراءات والشروط والمخرجات</li><li>تخطيط عملية في سير عمل منظم</li></ul></div>'},
            {'id': 'm2-s2', 'title': 'What is a Workflow?', 'title_ar': 'ما هو سير العمل؟', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>A Workflow</strong> is a structured sequence of steps that defines how a task or process is executed from start to finish.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Has a clear starting point (trigger)</li><li>Follows a defined sequence of steps</li><li>May include decision points (conditions)</li><li>Produces a clear output or result</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> Patient appointment booking — from request to confirmation.</div>',
             'content_ar': '<div class="info-box cyan"><strong>سير العمل</strong> هو تسلسل منظم من الخطوات يحدد كيفية تنفيذ مهمة أو عملية من البداية إلى النهاية.</div>'},
            {'id': 'm2-s3', 'title': 'Triggers', 'title_ar': 'المحفزات', 'type': 'content',
             'content_en': '<div class="info-box emerald"><strong>Trigger:</strong> The event or condition that starts a workflow automatically.</div><div class="info-box cyan" style="margin-top:12px"><strong>Types of Triggers:</strong><ul style="margin:8px 0 0 16px"><li><strong>Event-based:</strong> A form is submitted, email received, file uploaded</li><li><strong>Schedule-based:</strong> Run every day at 9 AM, weekly on Monday</li><li><strong>Condition-based:</strong> When inventory drops below threshold</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Patient submits appointment request online</li><li>New lab result is uploaded to the system</li><li>Daily shift change at 7:00 AM</li></ul></div>',
             'content_ar': '<div class="info-box emerald"><strong>المحفز:</strong> الحدث أو الشرط الذي يبدأ سير العمل تلقائيا.</div>'},
            {'id': 'm2-s4', 'title': 'Actions', 'title_ar': 'الإجراءات', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Action:</strong> The task performed by the system within a workflow.</div><div class="info-box cyan" style="margin-top:12px"><strong>Common Action Types:</strong><ul style="margin:8px 0 0 16px"><li><strong>Send notification:</strong> Email, SMS, push alert</li><li><strong>Update record:</strong> Database, spreadsheet, CRM</li><li><strong>Create item:</strong> Calendar event, task, document</li><li><strong>Transfer data:</strong> Move information between systems</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong> Send confirmation to patient, update appointment calendar, create patient record.</div>',
             'content_ar': '<div class="info-box violet"><strong>الإجراء:</strong> المهمة التي ينفذها النظام ضمن سير العمل.</div>'},
            {'id': 'm2-s5', 'title': 'Conditions', 'title_ar': 'الشروط', 'type': 'content',
             'content_en': '<div class="info-box amber"><strong>Condition:</strong> A checkpoint that evaluates whether certain criteria are met before the process continues.</div><div class="info-box cyan" style="margin-top:12px"><strong>How Conditions Work:</strong><ul style="margin:8px 0 0 16px"><li>Evaluate a yes/no or true/false question</li><li>Route the workflow along different paths</li><li>Enable branching logic</li><li>Handle exceptions and special cases</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Healthcare Example:</strong> Is the preferred appointment slot available? Yes: Confirm booking, No: Offer alternatives.</div>',
             'content_ar': '<div class="info-box amber"><strong>الشرط:</strong> نقطة تحقق تقيم ما إذا كانت معايير معينة مستوفاة قبل أن تستمر العملية.</div>'},
            {'id': 'm2-s6', 'title': 'Outputs', 'title_ar': 'المخرجات', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Output:</strong> The final result delivered by a workflow to the user or system.</div><div class="info-box violet" style="margin-top:12px"><strong>Common Output Types:</strong><ul style="margin:8px 0 0 16px"><li><strong>Notification:</strong> Confirmation email, SMS alert</li><li><strong>Document:</strong> Generated report, summary</li><li><strong>Record update:</strong> Database entry, status change</li><li><strong>Dashboard update:</strong> Real-time metrics, status board</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> Appointment confirmation notification sent to the patient with date, time, and location details.</div>',
             'content_ar': '<div class="info-box cyan"><strong>المخرج:</strong> النتيجة النهائية التي يقدمها سير العمل للمستخدم أو النظام.</div>'},
            {'id': 'm2-s7', 'title': 'Building Blocks Together', 'title_ar': 'مكونات البناء معا', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>The Complete Workflow Structure:</strong></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center"><div class="info-box emerald" style="flex:1;min-width:120px;text-align:center"><strong>Trigger</strong><br>Event starts workflow</div><div class="info-box amber" style="flex:1;min-width:120px;text-align:center"><strong>Condition</strong><br>Criteria check</div><div class="info-box violet" style="flex:1;min-width:120px;text-align:center"><strong>Action</strong><br>Task performed</div><div class="info-box cyan" style="flex:1;min-width:120px;text-align:center"><strong>Output</strong><br>Result delivered</div></div><div class="info-box slate" style="margin-top:12px"><strong>Patient Appointment Example:</strong><br>Patient submits request (Trigger) then Check slot availability (Condition) then Send confirmation or alternatives (Action) then Patient receives notification (Output)</div>',
             'content_ar': '<div class="info-box cyan"><strong>هيكل سير العمل الكامل:</strong></div>'},
            {'id': 'm2-s8', 'title': 'Process Mapping', 'title_ar': 'رسم خرائط العمليات', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Process Mapping</strong> is the practice of visually documenting and analyzing the steps in a process.</div><div class="info-box cyan" style="margin-top:12px"><strong>Why Map Processes?</strong><ul style="margin:8px 0 0 16px"><li>Identify bottlenecks and inefficiencies</li><li>Find automation opportunities</li><li>Understand handoffs between people/systems</li><li>Document current state before improving</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Steps to Map a Process:</strong><ol style="margin:8px 0 0 16px"><li>Identify the start and end points</li><li>List all steps in between</li><li>Mark decision points (conditions)</li><li>Identify who/what performs each step</li><li>Highlight areas for automation</li></ol></div>',
             'content_ar': '<div class="info-box violet"><strong>رسم خرائط العمليات</strong> هي ممارسة التوثيق المرئي وتحليل خطوات العملية.</div>'},
            {'id': 'm2-s9', 'title': 'Module 2 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الثانية', 'type': 'summary', 'has_video': True, 'video_type': 'conclusion',
             'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Workflows</strong> are structured sequences of steps (Trigger to Condition to Action to Output)</li><li><strong>Triggers</strong> start workflows (events, schedules, conditions)</li><li><strong>Actions</strong> are tasks performed by the system</li><li><strong>Conditions</strong> check criteria before proceeding</li><li><strong>Outputs</strong> deliver results to users</li><li><strong>Process Mapping</strong> helps identify automation opportunities</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>سير العمل</strong> هي تسلسلات منظمة</li><li><strong>المحفزات</strong> تبدأ سير العمل</li><li><strong>الإجراءات</strong> هي المهام التي ينفذها النظام</li><li><strong>الشروط</strong> تتحقق من المعايير</li><li><strong>المخرجات</strong> تقدم النتائج</li></ul></div>'},
        ],
        'quiz': [
            {'q': 'What is the first element in a typical workflow?', 'q_ar': 'ما هو العنصر الأول في سير العمل النموذجي؟', 'opts': ['Action', 'Output', 'Trigger', 'Condition'], 'opts_ar': ['الإجراء', 'المخرج', 'المحفز', 'الشرط'], 'correct': 2},
            {'q': "What does a Condition do in a workflow?", 'q_ar': "ماذا يفعل الشرط في سير العمل؟", 'opts': ['Starts the workflow', 'Checks criteria before proceeding', 'Delivers the final result', 'Performs the main task'], 'opts_ar': ['يبدأ سير العمل', 'يتحقق من المعايير قبل المتابعة', 'يقدم النتيجة النهائية', 'ينفذ المهمة الرئيسية'], 'correct': 1},
            {'q': 'Which component represents the task performed by the system?', 'q_ar': 'أي مكون يمثل المهمة التي ينفذها النظام؟', 'opts': ['Trigger', 'Condition', 'Action', 'Output'], 'opts_ar': ['المحفز', 'الشرط', 'الإجراء', 'المخرج'], 'correct': 2},
            {'q': 'What would be the trigger in a patient appointment workflow?', 'q_ar': 'ما هو المحفز في سير عمل مواعيد المرضى؟', 'opts': ['Doctor reviews the chart', 'Patient submits appointment request', 'System sends confirmation', 'Appointment is added to calendar'], 'opts_ar': ['يراجع الطبيب الملف', 'يقدم المريض طلب موعد', 'يرسل النظام تأكيدا', 'يتم إضافة الموعد للتقويم'], 'correct': 1},
            {'q': 'Why is workflow thinking important for automation?', 'q_ar': 'لماذا يعد التفكير بسير العمل مهما للأتمتة؟', 'opts': ['It makes tasks slower', 'It helps break processes into structured, automatable steps', 'It eliminates the need for technology', 'It only works for simple tasks'], 'opts_ar': ['يجعل المهام أبطأ', 'يساعد في تقسيم العمليات إلى خطوات منظمة قابلة للأتمتة', 'يلغي الحاجة للتكنولوجيا', 'يعمل فقط للمهام البسيطة'], 'correct': 1},
        ],
    },
    # ── MODULE 3: AI Agents ──
    {
        'number': 3,
        'title': 'AI Agents',
        'title_ar': 'وكلاء الذكاء الاصطناعي',
        'intro_video': 'https://www.youtube.com/embed/gzjvTUctEDE',
        'conclusion_video': 'https://www.youtube.com/embed/Tlo1Q-CzXFk',
        'slides': [
            {'id': 'm3-s1', 'title': 'Introduction to AI Agents', 'title_ar': 'مقدمة في وكلاء الذكاء الاصطناعي', 'type': 'intro', 'image_key': 'module_3', 'has_video': True, 'video_type': 'intro',
             'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Define what AI agents are</li><li>Explain how AI agents differ from standard automation</li><li>Identify where AI agents add value in workflows</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#AIAgents</span><span class="chip">#AgentCapabilities</span><span class="chip">#DecisionSupport</span><span class="chip">#IntelligentWorkflows</span></div>',
             'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تعريف ماهية وكلاء الذكاء الاصطناعي</li><li>شرح كيف يختلفون عن الأتمتة العادية</li><li>تحديد أين يضيفون قيمة في سير العمل</li></ul></div>'},
            {'id': 'm3-s2', 'title': 'What is an AI Agent?', 'title_ar': 'ما هو وكيل الذكاء الاصطناعي؟', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>An AI Agent</strong> is a system that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li><strong>Autonomous:</strong> Can act without step-by-step human guidance</li><li><strong>Goal-oriented:</strong> Works toward defined objectives</li><li><strong>Context-aware:</strong> Understands situation and adapts</li><li><strong>Intelligent:</strong> Uses AI to reason and decide</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>وكيل الذكاء الاصطناعي</strong> هو نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل.</div>'},
            {'id': 'm3-s3', 'title': 'AI Agents vs Standard Automation', 'title_ar': 'وكلاء الذكاء الاصطناعي مقابل الأتمتة العادية', 'type': 'content',
             'content_en': '<div class="grid-2"><div class="info-box violet"><strong>Standard Automation</strong><ul style="margin:8px 0 0 16px"><li>Follows fixed, predefined steps</li><li>Cannot handle exceptions</li><li>Same output every time</li><li>No learning or adaptation</li></ul></div><div class="info-box emerald"><strong>AI Agents</strong><ul style="margin:8px 0 0 16px"><li>Can interpret and decide</li><li>Handles ambiguity and exceptions</li><li>Adapts based on context</li><li>Learns and improves</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>Key Insight:</strong> AI agents bring human-like reasoning to automated workflows, handling complexity that rule-based systems cannot.</div>',
             'content_ar': '<div class="grid-2"><div class="info-box violet"><strong>الأتمتة العادية</strong><ul style="margin:8px 0 0 16px"><li>تتبع خطوات ثابتة محددة مسبقا</li><li>لا تستطيع التعامل مع الاستثناءات</li></ul></div><div class="info-box emerald"><strong>وكلاء الذكاء الاصطناعي</strong><ul style="margin:8px 0 0 16px"><li>يمكنهم التفسير واتخاذ القرارات</li><li>يتعاملون مع الغموض والاستثناءات</li></ul></div></div>'},
            {'id': 'm3-s4', 'title': 'Natural Language Understanding', 'title_ar': 'فهم اللغة الطبيعية', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Natural Language Understanding (NLU)</strong> allows AI agents to read, interpret, and derive meaning from human language.</div><div class="info-box violet" style="margin-top:12px"><strong>What NLU Enables:</strong><ul style="margin:8px 0 0 16px"><li>Reading and understanding patient messages</li><li>Extracting key information from free-text notes</li><li>Classifying intent (complaint, question, request)</li><li>Processing multilingual communications</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> An AI agent reads a patient message like "I have been having chest pain since yesterday and I am worried" and extracts: symptom (chest pain), duration (since yesterday), urgency level (high).</div>',
             'content_ar': '<div class="info-box cyan"><strong>فهم اللغة الطبيعية (NLU)</strong> يسمح لوكلاء الذكاء الاصطناعي بقراءة وتفسير واستخلاص المعنى من اللغة البشرية.</div>'},
            {'id': 'm3-s5', 'title': 'Goal-Oriented Behavior', 'title_ar': 'السلوك الموجه نحو الهدف', 'type': 'content',
             'content_en': '<div class="info-box emerald"><strong>Goal-Oriented Behavior</strong> means AI agents work toward defined objectives rather than just following fixed rules.</div><div class="info-box cyan" style="margin-top:12px"><strong>How It Works:</strong><ul style="margin:8px 0 0 16px"><li>Agent receives a goal</li><li>Evaluates current situation and available options</li><li>Chooses the best path to achieve the goal</li><li>Adapts if the initial approach does not work</li></ul></div>',
             'content_ar': '<div class="info-box emerald"><strong>السلوك الموجه نحو الهدف</strong> يعني أن وكلاء الذكاء الاصطناعي يعملون نحو أهداف محددة بدلا من مجرد اتباع قواعد ثابتة.</div>'},
            {'id': 'm3-s6', 'title': 'Decision Making & Adaptive Execution', 'title_ar': 'اتخاذ القرار والتنفيذ التكيفي', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Decision Making:</strong> AI agents can analyze information, weigh options, and choose the best course of action.</div><div class="info-box emerald" style="margin-top:12px"><strong>Adaptive Execution:</strong> AI agents adjust their workflow based on new data and changing conditions.</div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> An AI agent triaging patient messages can prioritize based on urgency keywords, route urgent cases directly to on-call physician, route routine questions to scheduling system, and escalate ambiguous cases for human review.</div>',
             'content_ar': '<div class="info-box violet"><strong>اتخاذ القرار:</strong> يمكن لوكلاء الذكاء الاصطناعي تحليل المعلومات وموازنة الخيارات واختيار أفضل مسار عمل.</div>'},
            {'id': 'm3-s7', 'title': 'Multi-Step Reasoning', 'title_ar': 'الاستدلال متعدد الخطوات', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Multi-Step Reasoning</strong> allows AI agents to break complex tasks into sub-tasks, execute them sequentially, and adjust based on intermediate results.</div><div class="info-box violet" style="margin-top:12px"><strong>How It Works:</strong><ol style="margin:8px 0 0 16px"><li>Receive complex request</li><li>Break it into smaller sub-tasks</li><li>Execute each sub-task in order</li><li>Check results at each step</li><li>Adjust next steps based on what happened</li></ol></div>',
             'content_ar': '<div class="info-box cyan"><strong>الاستدلال متعدد الخطوات</strong> يسمح لوكلاء الذكاء الاصطناعي بتقسيم المهام المعقدة إلى مهام فرعية وتنفيذها بالتتابع.</div>'},
            {'id': 'm3-s8', 'title': 'Context Awareness', 'title_ar': 'الوعي بالسياق', 'type': 'content',
             'content_en': '<div class="info-box emerald"><strong>Context Awareness</strong> means AI agents can remember previous interactions and use that information to make better decisions.</div><div class="info-box cyan" style="margin-top:12px"><strong>Types of Context:</strong><ul style="margin:8px 0 0 16px"><li><strong>Conversation history:</strong> Remembers what was discussed before</li><li><strong>Patient history:</strong> Knows previous diagnoses, medications, allergies</li><li><strong>System state:</strong> Aware of current workloads, schedules, availability</li><li><strong>Environmental context:</strong> Time of day, department policies, seasonal patterns</li></ul></div>',
             'content_ar': '<div class="info-box emerald"><strong>الوعي بالسياق</strong> يعني أن وكلاء الذكاء الاصطناعي يمكنهم تذكر التفاعلات السابقة واستخدام تلك المعلومات لاتخاذ قرارات أفضل.</div>'},
            {'id': 'm3-s9', 'title': 'Tool Use & Integration', 'title_ar': 'استخدام الأدوات والتكامل', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Tool Use</strong> means AI agents can interact with external tools, APIs, and systems to complete tasks.</div><div class="info-box cyan" style="margin-top:12px"><strong>Common Agent Tools:</strong><ul style="margin:8px 0 0 16px"><li><strong>APIs:</strong> Connect to databases, calendars, email systems</li><li><strong>Search:</strong> Look up information in knowledge bases</li><li><strong>Communication:</strong> Send emails, SMS, notifications</li><li><strong>Calculation:</strong> Process data, generate reports</li></ul></div>',
             'content_ar': '<div class="info-box violet"><strong>استخدام الأدوات</strong> يعني أن وكلاء الذكاء الاصطناعي يمكنهم التفاعل مع الأدوات الخارجية وواجهات برمجة التطبيقات.</div>'},
            {'id': 'm3-s10', 'title': 'Decision Support in Healthcare', 'title_ar': 'دعم القرار في الرعاية الصحية', 'type': 'content',
             'content_en': '<div class="info-box amber"><strong>Decision Support:</strong> AI agents analyze data, identify patterns, and recommend actions to support human decision-making.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Applications:</strong><ul style="margin:8px 0 0 16px"><li>Flagging abnormal lab results for physician review</li><li>Suggesting treatment options based on clinical guidelines</li><li>Prioritizing patient cases by urgency</li><li>Identifying drug interaction risks</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Important:</strong> AI agents support decisions — they do not replace clinical judgment.</div>',
             'content_ar': '<div class="info-box amber"><strong>دعم القرار:</strong> يقوم وكلاء الذكاء الاصطناعي بتحليل البيانات وتحديد الأنماط والتوصية بالإجراءات لدعم اتخاذ القرارات البشرية.</div>'},
            {'id': 'm3-s11', 'title': 'Where AI Agents Add Value', 'title_ar': 'أين يضيف وكلاء الذكاء الاصطناعي قيمة', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>AI agents add the most value where workflows involve:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Complex Decisions</strong><br>Multiple factors to consider, no single right answer</div><div class="info-box violet"><strong>Unstructured Data</strong><br>Free text, images, voice that need interpretation</div><div class="info-box amber"><strong>Dynamic Conditions</strong><br>Situations that change and require adaptation</div><div class="info-box slate"><strong>Human Collaboration</strong><br>Supporting (not replacing) human expertise</div></div>',
             'content_ar': '<div class="info-box cyan"><strong>يضيف وكلاء الذكاء الاصطناعي أكبر قيمة عندما يتضمن سير العمل:</strong></div>'},
            {'id': 'm3-s12', 'title': 'Module 3 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الثالثة', 'type': 'summary', 'has_video': True, 'video_type': 'conclusion',
             'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>AI Agents</strong> understand goals, interpret context, and take autonomous actions</li><li>They differ from standard automation by being adaptive and intelligent</li><li>Key capabilities: NLU, goal-oriented behavior, multi-step reasoning, context awareness, tool use</li><li>In healthcare: decision support, triage, referral processing, patient communication</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>وكلاء الذكاء الاصطناعي</strong> يفهمون الأهداف ويفسرون السياق ويتخذون إجراءات مستقلة</li><li>يختلفون عن الأتمتة العادية بكونهم تكيفيين وذكيين</li></ul></div>'},
        ],
        'quiz': [
            {'q': 'What is an AI agent?', 'q_ar': 'ما هو وكيل الذكاء الاصطناعي؟', 'opts': ['A simple rule-based script', 'A system that can understand goals, interpret context, and take autonomous actions', 'A database management tool', 'A type of spreadsheet'], 'opts_ar': ['برنامج بسيط قائم على القواعد', 'نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ إجراءات مستقلة', 'أداة إدارة قواعد البيانات', 'نوع من جداول البيانات'], 'correct': 1},
            {'q': 'How do AI agents differ from standard automation?', 'q_ar': 'كيف يختلف وكلاء الذكاء الاصطناعي عن الأتمتة العادية؟', 'opts': ['They are identical', 'AI agents can interpret, decide, and adapt', 'Standard automation is more intelligent', 'AI agents cannot handle data'], 'opts_ar': ['هم متطابقون', 'يمكنهم التفسير واتخاذ القرارات والتكيف', 'الأتمتة العادية أكثر ذكاء', 'لا يمكنهم معالجة البيانات'], 'correct': 1},
            {'q': 'Which capability allows AI agents to understand patient messages?', 'q_ar': 'أي قدرة تسمح لوكلاء الذكاء الاصطناعي بفهم رسائل المرضى؟', 'opts': ['Data Storage', 'Natural Language Understanding', 'File Management', 'Network Security'], 'opts_ar': ['تخزين البيانات', 'فهم اللغة الطبيعية', 'إدارة الملفات', 'أمن الشبكات'], 'correct': 1},
            {'q': "What is goal-oriented behavior in AI agents?", 'q_ar': "ما هو السلوك الموجه بالأهداف؟", 'opts': ['Following fixed rules', 'Working toward defined objectives and adapting', 'Only processing structured data', 'Running on a schedule'], 'opts_ar': ['اتباع قواعد ثابتة', 'العمل نحو أهداف محددة والتكيف', 'معالجة البيانات المهيكلة فقط', 'التشغيل وفق جدول'], 'correct': 1},
            {'q': 'What is multi-step reasoning?', 'q_ar': 'ما هو الاستدلال متعدد الخطوات؟', 'opts': ['Running one step repeatedly', 'Breaking complex tasks into sub-tasks and adjusting based on results', 'Only answering yes/no questions', 'Storing data in multiple locations'], 'opts_ar': ['تشغيل خطوة واحدة بشكل متكرر', 'تقسيم المهام المعقدة إلى مهام فرعية والتعديل بناء على النتائج', 'الإجابة فقط بنعم/لا', 'تخزين البيانات في مواقع متعددة'], 'correct': 1},
        ],
    },
    # ── MODULE 4: Vibe Coding ──
    {
        'number': 4,
        'title': 'Vibe Coding',
        'title_ar': 'البرمجة بالوصف',
        'intro_video': 'https://www.youtube.com/embed/O8OfQm_SotM',
        'conclusion_video': 'https://www.youtube.com/embed/KT4i4wvTNOE',
        'slides': [
            {'id': 'm4-s1', 'title': 'Introduction to Vibe Coding', 'title_ar': 'مقدمة في البرمجة بالوصف', 'type': 'intro', 'image_key': 'module_4', 'has_video': True, 'video_type': 'intro',
             'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Understand what vibe coding is</li><li>Explain prompt-driven development workflow</li><li>Recognize benefits of rapid prototyping with AI</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#VibeCoding</span><span class="chip">#PromptDrivenDevelopment</span><span class="chip">#RapidPrototyping</span></div>',
             'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>فهم ماهية البرمجة بالوصف</li><li>شرح سير عمل التطوير القائم على الأوامر</li><li>إدراك فوائد النمذجة السريعة</li></ul></div>'},
            {'id': 'm4-s2', 'title': 'What is Vibe Coding?', 'title_ar': 'ما هي البرمجة بالوصف؟', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Vibe Coding</strong> is creating digital solutions by describing what you want in natural language, then letting AI generate the code. No traditional programming required.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Natural language as the primary input</li><li>AI generates the code and application</li><li>Iterative refinement through conversation</li><li>Accessible to non-programmers</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>البرمجة بالوصف</strong> هي إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود.</div>'},
            {'id': 'm4-s3', 'title': 'Describe, Generate, Refine', 'title_ar': 'صف، ولد، حسن', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>The Core Loop of Vibe Coding:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. Describe</strong><br>Write a clear natural language description of what you want to build.</div><div class="info-box violet" style="margin-bottom:8px"><strong>2. Generate</strong><br>AI reads your prompt and generates the initial code/application.</div><div class="info-box amber"><strong>3. Refine</strong><br>Review the output, identify what needs improvement, and provide follow-up prompts.</div></div>',
             'content_ar': '<div class="info-box cyan"><strong>الحلقة الأساسية للبرمجة بالوصف:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. صف</strong><br>اكتب وصفا واضحا بلغة طبيعية لما تريد بناءه.</div><div class="info-box violet" style="margin-bottom:8px"><strong>2. ولد</strong><br>يقرأ الذكاء الاصطناعي أمرك ويولد الكود الأولي.</div><div class="info-box amber"><strong>3. حسن</strong><br>راجع المخرج وقدم أوامر متابعة لتحسين النتيجة.</div></div>'},
            {'id': 'm4-s4', 'title': 'Prompt-Driven Development', 'title_ar': 'التطوير القائم على الأوامر', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Prompt-Driven Development</strong> means writing natural language instructions to guide AI in building applications.</div><div class="info-box cyan" style="margin-top:12px"><strong>Tips for Effective Prompts:</strong><ul style="margin:8px 0 0 16px"><li><strong>Be specific:</strong> "Create a form with name, age, and email fields"</li><li><strong>Describe behavior:</strong> "When submitted, show a confirmation message"</li><li><strong>Include constraints:</strong> "Mobile-friendly, clean design, blue theme"</li><li><strong>Iterate gradually:</strong> Start simple, then add features one at a time</li></ul></div>',
             'content_ar': '<div class="info-box violet"><strong>التطوير القائم على الأوامر</strong> يعني كتابة تعليمات بلغة طبيعية لتوجيه الذكاء الاصطناعي في بناء التطبيقات.</div>'},
            {'id': 'm4-s5', 'title': 'Rapid Prototyping with AI', 'title_ar': 'النمذجة السريعة مع الذكاء الاصطناعي', 'type': 'content',
             'content_en': '<div class="info-box emerald"><strong>Rapid Prototyping</strong> means quickly creating working prototypes of ideas using AI tools.</div><div class="info-box cyan" style="margin-top:12px"><strong>Benefits:</strong><ul style="margin:8px 0 0 16px"><li><strong>Speed:</strong> From idea to working prototype in minutes</li><li><strong>Accessibility:</strong> No coding skills required</li><li><strong>Low cost:</strong> Test ideas before investing in full development</li><li><strong>Fast feedback:</strong> Show stakeholders working demos quickly</li></ul></div>',
             'content_ar': '<div class="info-box emerald"><strong>النمذجة السريعة</strong> تعني إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي.</div>'},
            {'id': 'm4-s6', 'title': 'Iteration & Refinement', 'title_ar': 'التكرار والتحسين', 'type': 'content',
             'content_en': '<div class="info-box amber"><strong>Iteration</strong> is the process of repeatedly refining your prompts and the generated output until the solution meets requirements.</div><div class="info-box cyan" style="margin-top:12px"><strong>The Iteration Process:</strong><ol style="margin:8px 0 0 16px"><li>Review the generated output</li><li>Identify what works and what needs improvement</li><li>Write a specific follow-up prompt addressing the issues</li><li>Review the updated output</li><li>Repeat until satisfied</li></ol></div>',
             'content_ar': '<div class="info-box amber"><strong>التكرار</strong> هو عملية تحسين الأوامر والمخرجات المولدة بشكل متكرر حتى يلبي الحل المتطلبات.</div>'},
            {'id': 'm4-s7', 'title': 'Vibe Coding Tools Overview', 'title_ar': 'نظرة عامة على أدوات البرمجة بالوصف', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Tools for Vibe Coding:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Lovable</strong><br>Build complete web apps from natural language prompts.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Replit</strong><br>Cloud-based development environment with AI assistance.</div><div class="info-box amber"><strong>Claude Code</strong><br>AI coding assistant for prompt-driven development.</div></div>',
             'content_ar': '<div class="info-box cyan"><strong>أدوات البرمجة بالوصف:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Lovable</strong><br>بناء تطبيقات ويب كاملة من الأوامر النصية.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Replit</strong><br>بيئة تطوير سحابية مع مساعدة الذكاء الاصطناعي.</div><div class="info-box amber"><strong>Claude Code</strong><br>مساعد برمجة لتطوير قائم على الأوامر.</div></div>'},
            {'id': 'm4-s8', 'title': 'Healthcare Applications of Vibe Coding', 'title_ar': 'تطبيقات البرمجة بالوصف في الرعاية الصحية', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Vibe Coding in Healthcare:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Patient Tracking App</strong><br>Track diabetic patient glucose readings with alerts.</div><div class="info-box violet"><strong>Clinical Report Generator</strong><br>Enter symptoms, generate clinical summaries.</div><div class="info-box amber"><strong>Medication Adherence Tracker</strong><br>Record and monitor patient medication compliance.</div><div class="info-box slate"><strong>Patient Feedback Form</strong><br>Quick prototype for collecting patient satisfaction data.</div></div>',
             'content_ar': '<div class="info-box cyan"><strong>البرمجة بالوصف في الرعاية الصحية:</strong></div>'},
            {'id': 'm4-s9', 'title': 'Module 4 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الرابعة', 'type': 'summary', 'has_video': True, 'video_type': 'conclusion',
             'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Vibe Coding:</strong> Create solutions using natural language</li><li><strong>Core Loop:</strong> Describe, Generate, Refine</li><li><strong>Prompt-Driven Development:</strong> Write clear instructions, AI builds the app</li><li><strong>Rapid Prototyping:</strong> From idea to working prototype in minutes</li><li><strong>Tools:</strong> Lovable, Replit, Claude Code</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>البرمجة بالوصف:</strong> إنشاء حلول بلغة طبيعية</li><li><strong>الحلقة الأساسية:</strong> صف، ولد، حسن</li><li><strong>التطوير بالأوامر:</strong> اكتب تعليمات واضحة</li></ul></div>'},
        ],
        'quiz': [
            {'q': 'What is vibe coding?', 'q_ar': 'ما هي البرمجة بالوصف؟', 'opts': ['A new programming language', 'Creating solutions using natural language prompts instead of traditional coding', 'A type of database system', 'A testing framework'], 'opts_ar': ['لغة برمجة جديدة', 'إنشاء حلول بأوامر نصية بدلا من البرمجة التقليدية', 'نوع من أنظمة قواعد البيانات', 'إطار عمل للاختبار'], 'correct': 1},
            {'q': 'What is the core loop of vibe coding?', 'q_ar': 'ما هي الحلقة الأساسية للبرمجة بالوصف؟', 'opts': ['Plan, Code, Test', 'Describe, Generate, Refine', 'Design, Build, Deploy', 'Research, Develop, Publish'], 'opts_ar': ['خطط، برمج، اختبر', 'صف، ولد، حسن', 'صمم، ابن، انشر', 'ابحث، طور، انشر'], 'correct': 1},
            {'q': 'Does vibe coding require extensive programming experience?', 'q_ar': 'هل تتطلب البرمجة بالوصف خبرة واسعة؟', 'opts': ['Yes, advanced coding skills are mandatory', 'No, it uses natural language prompts', 'Only Python knowledge is needed', 'Only for experienced developers'], 'opts_ar': ['نعم، مهارات متقدمة إلزامية', 'لا، تستخدم أوامر نصية', 'فقط معرفة بايثون', 'فقط للمطورين المحترفين'], 'correct': 1},
            {'q': 'What is rapid prototyping?', 'q_ar': 'ما هي النمذجة السريعة؟', 'opts': ['Writing code very fast manually', 'Quickly creating working prototypes using AI tools', 'Skipping testing entirely', 'Copying existing applications'], 'opts_ar': ['كتابة الكود بسرعة يدويا', 'إنشاء نماذج عاملة بسرعة بأدوات الذكاء الاصطناعي', 'تخطي الاختبار تماما', 'نسخ التطبيقات الموجودة'], 'correct': 1},
            {'q': 'Why is iteration important in vibe coding?', 'q_ar': 'لماذا يعد التكرار مهما؟', 'opts': ['It is not important', 'It refines prompts and output until the solution meets requirements', 'It makes the process slower', 'It replaces testing'], 'opts_ar': ['ليس مهما', 'يحسن الأوامر والمخرجات حتى يلبي الحل المتطلبات', 'يجعل العملية أبطأ', 'يحل محل الاختبار'], 'correct': 1},
        ],
    },
    # ── MODULE 5: Designing AI Automation Solutions ──
    {
        'number': 5,
        'title': 'Designing AI Automation Solutions & Common Use Cases',
        'title_ar': 'تصميم حلول أتمتة الذكاء الاصطناعي وحالات الاستخدام الشائعة',
        'intro_video': 'https://www.youtube.com/embed/1VY0m0YKcDs',
        'conclusion_video': 'https://www.youtube.com/embed/d733jOBdz04',
        'slides': [
            {'id': 'm5-s1', 'title': 'Introduction to Designing AI Solutions', 'title_ar': 'مقدمة في تصميم حلول الذكاء الاصطناعي', 'type': 'intro', 'image_key': 'module_5', 'has_video': True, 'video_type': 'intro',
             'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Identify automation opportunities in workflows</li><li>Design AI automation solutions</li><li>Describe common use cases across categories</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#SolutionDesign</span><span class="chip">#AutomationOpportunities</span><span class="chip">#AIUseCases</span></div>',
             'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تحديد فرص الأتمتة</li><li>تصميم حلول أتمتة الذكاء الاصطناعي</li><li>وصف حالات الاستخدام الشائعة</li></ul></div>'},
            {'id': 'm5-s2', 'title': 'Identifying Automation Opportunities', 'title_ar': 'تحديد فرص الأتمتة', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>How to spot automation opportunities:</strong></div><div class="info-box violet" style="margin-top:12px"><strong>Look for tasks that are:</strong><ul style="margin:8px 0 0 16px"><li><strong>Repetitive:</strong> Done the same way many times</li><li><strong>Time-consuming:</strong> Take significant staff time</li><li><strong>Error-prone:</strong> Mistakes happen due to manual handling</li><li><strong>Rule-based:</strong> Follow predictable if/then logic</li><li><strong>Data-heavy:</strong> Involve moving or processing large amounts of data</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>كيفية اكتشاف فرص الأتمتة:</strong></div>'},
            {'id': 'm5-s3', 'title': 'Solution Design Process', 'title_ar': 'عملية تصميم الحل', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>The 5-Step Solution Design Process:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Step 1: Identify the Problem</strong></div><div class="info-box violet" style="margin-bottom:8px"><strong>Step 2: Map the Current Workflow</strong></div><div class="info-box amber" style="margin-bottom:8px"><strong>Step 3: Identify Where AI Adds Value</strong></div><div class="info-box cyan" style="margin-bottom:8px"><strong>Step 4: Design the Automated Workflow</strong></div><div class="info-box slate"><strong>Step 5: Test, Refine, and Deploy</strong></div></div>',
             'content_ar': '<div class="info-box cyan"><strong>عملية تصميم الحل من 5 خطوات:</strong></div>'},
            {'id': 'm5-s4', 'title': 'Operational Coordination', 'title_ar': 'التنسيق التشغيلي', 'type': 'content',
             'content_en': '<div class="info-box emerald"><strong>Operational Coordination</strong> — Automation for scheduling, routing, and resource allocation.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Automated appointment scheduling and rescheduling</li><li>Routing patient referrals to the right specialist</li><li>Bed management and allocation</li><li>Staff scheduling and shift management</li></ul></div>',
             'content_ar': '<div class="info-box emerald"><strong>التنسيق التشغيلي</strong> — الأتمتة للجدولة والتوجيه وتخصيص الموارد.</div>'},
            {'id': 'm5-s5', 'title': 'Communication Automation', 'title_ar': 'أتمتة التواصل', 'type': 'content',
             'content_en': '<div class="info-box violet"><strong>Communication Automation</strong> — Automated workflows for reminders, follow-ups, and notifications.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Patient follow-up reminders after visits</li><li>Appointment confirmation and reminder notifications</li><li>Lab result availability notifications</li><li>Medication refill reminders</li></ul></div>',
             'content_ar': '<div class="info-box violet"><strong>أتمتة التواصل</strong> — سير عمل آلي للتذكيرات والمتابعات والإشعارات.</div>'},
            {'id': 'm5-s6', 'title': 'Decision Support', 'title_ar': 'دعم القرار', 'type': 'content',
             'content_en': '<div class="info-box amber"><strong>Decision Support</strong> — AI-powered analysis to help humans make better, faster decisions.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Flagging abnormal lab results for physician review</li><li>Clinical decision support alerts</li><li>Risk scoring for patient conditions</li><li>Treatment recommendation based on guidelines</li></ul></div>',
             'content_ar': '<div class="info-box amber"><strong>دعم القرار</strong> — تحليل مدعوم بالذكاء الاصطناعي لمساعدة البشر في اتخاذ قرارات أفضل وأسرع.</div>'},
            {'id': 'm5-s7', 'title': 'Productivity Automation', 'title_ar': 'أتمتة الإنتاجية', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Productivity Automation</strong> — Automating routine tasks to free staff for higher-value work.</div><div class="info-box violet" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Auto-generating shift reports</li><li>Automated documentation and note summarization</li><li>Data entry automation</li><li>Template-based report generation</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>أتمتة الإنتاجية</strong> — أتمتة المهام الروتينية لتحرير الموظفين للعمل الأعلى قيمة.</div>'},
            {'id': 'm5-s8', 'title': 'Monitoring & Alerts', 'title_ar': 'المراقبة والتنبيهات', 'type': 'content',
             'content_en': '<div class="info-box slate"><strong>Monitoring &amp; Alerts</strong> — Automated systems that track metrics, detect anomalies, and send alerts.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Tracking medication inventory levels</li><li>Patient vital sign monitoring</li><li>Equipment maintenance alerts</li><li>Compliance deadline tracking</li></ul></div>',
             'content_ar': '<div class="info-box slate"><strong>المراقبة والتنبيهات</strong> — أنظمة آلية تتتبع المقاييس وتكتشف الشذوذ وترسل تنبيهات.</div>'},
            {'id': 'm5-s9', 'title': 'Automation Tools Overview', 'title_ar': 'نظرة عامة على أدوات الأتمتة', 'type': 'content',
             'content_en': '<div class="info-box cyan"><strong>Practical Automation Tools:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>n8n</strong> — Open-source visual workflow automation platform.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Make (Integromat)</strong> — Visual automation with parallel paths and error handling.</div><div class="info-box amber"><strong>Zapier</strong> — Trigger-based automation connecting 5,000+ apps.</div></div>',
             'content_ar': '<div class="info-box cyan"><strong>أدوات الأتمتة العملية:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>n8n</strong> — منصة أتمتة سير عمل مرئية مفتوحة المصدر.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Make</strong> — أتمتة مرئية مع مسارات متوازية.</div><div class="info-box amber"><strong>Zapier</strong> — أتمتة قائمة على المحفزات.</div></div>'},
            {'id': 'm5-s10', 'title': 'Module 5 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الخامسة', 'type': 'summary', 'has_video': True, 'video_type': 'conclusion',
             'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Identify automation opportunities:</strong> repetitive, time-consuming, error-prone tasks</li><li><strong>5-Step Design Process:</strong> Identify, Map, Insert AI, Design, Test &amp; Deploy</li><li><strong>Use Case Categories:</strong> Operational Coordination, Communication, Decision Support, Productivity, Monitoring</li><li><strong>Tools:</strong> n8n, Make, Zapier for workflow automation</li></ul></div>',
             'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>تحديد فرص الأتمتة</strong></li><li><strong>عملية التصميم من 5 خطوات</strong></li><li><strong>فئات حالات الاستخدام</strong></li></ul></div>'},
        ],
        'quiz': [
            {'q': 'What is the first step in designing an AI automation solution?', 'q_ar': 'ما الخطوة الأولى في تصميم حل أتمتة؟', 'opts': ['Deploy the solution', 'Write the code', 'Identify the problem and repetitive task', 'Purchase software licenses'], 'opts_ar': ['نشر الحل', 'كتابة الكود', 'تحديد المشكلة والمهمة المتكررة', 'شراء تراخيص البرامج'], 'correct': 2},
            {'q': 'Automated appointment scheduling falls under which category?', 'q_ar': 'جدولة المواعيد الآلية تندرج تحت أي فئة؟', 'opts': ['Monitoring & Alerts', 'Decision Support', 'Operational Coordination', 'Data Analytics'], 'opts_ar': ['المراقبة والتنبيهات', 'دعم القرار', 'التنسيق التشغيلي', 'تحليل البيانات'], 'correct': 2},
            {'q': "What does inserting AI where it adds value mean?", 'q_ar': "ماذا يعني إدراج الذكاء الاصطناعي حيث يضيف قيمة؟", 'opts': ['Replacing all human workers', 'Adding AI capabilities to steps that benefit from intelligence', 'Using AI for every task', 'Eliminating workflows'], 'opts_ar': ['استبدال جميع العاملين', 'إضافة قدرات الذكاء الاصطناعي للخطوات التي تستفيد منه', 'استخدام الذكاء الاصطناعي لكل مهمة', 'إلغاء سير العمل'], 'correct': 1},
            {'q': "Which category does flagging abnormal lab results belong to?", 'q_ar': "أي فئة ينتمي إليها تمييز نتائج المختبر غير الطبيعية؟", 'opts': ['Communication', 'Productivity', 'Decision Support', 'Operational Coordination'], 'opts_ar': ['التواصل', 'الإنتاجية', 'دعم القرار', 'التنسيق التشغيلي'], 'correct': 2},
            {'q': 'What is the final step in the solution design process?', 'q_ar': 'ما الخطوة الأخيرة في عملية تصميم الحل؟', 'opts': ['Identify the problem', 'Map the workflow', 'Design the automation', 'Test, refine, and deploy'], 'opts_ar': ['تحديد المشكلة', 'رسم خريطة سير العمل', 'تصميم الأتمتة', 'اختبار وتحسين ونشر'], 'correct': 3},
        ],
    },
]


# ══════════════════════════════════════════════════════════════
# CSS (shared)
# ══════════════════════════════════════════════════════════════

CSS = '''
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6;min-height:100vh;padding:12px}
button{cursor:pointer;font-family:inherit;border:none;background:none}
img{max-width:100%;height:auto;display:block;border-radius:12px}
:root{--cyan:#0891b2;--cyan-light:#ecfeff;--cyan-border:#a5f3fc;--emerald:#059669;--emerald-light:#ecfdf5;--violet:#7c3aed;--violet-light:#f5f3ff;--amber:#d97706;--amber-light:#fffbeb;--red:#dc2626;--red-light:#fef2f2;--slate:#64748b;--slate-light:#f1f5f9;--white:#fff;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.1)}
[dir="rtl"] body{font-family:'Segoe UI',system-ui,sans-serif}
.app{max-width:900px;margin:0 auto}
.card{background:var(--white);border:1px solid #e2e8f0;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.card-header{padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.card-body{padding:16px;min-height:300px}
.card-footer{padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
.badge-cyan{background:var(--cyan-light);color:var(--cyan)}
.badge-emerald{background:var(--emerald-light);color:var(--emerald)}
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
.quiz-option{width:100%;text-align:left;padding:10px 14px;border-radius:8px;border:2px solid #e2e8f0;font-size:13px;transition:.2s;margin-bottom:6px;display:flex;align-items:center;gap:8px;cursor:pointer}
[dir="rtl"] .quiz-option{text-align:right}
.quiz-option:hover:not(:disabled):not(.correct):not(.wrong){border-color:var(--cyan);background:var(--cyan-light)}
.quiz-option.selected{border-color:var(--cyan);background:var(--cyan-light);font-weight:600}
.quiz-option.correct{border-color:var(--emerald);background:var(--emerald-light);color:#065f46;cursor:default}
.quiz-option.wrong{border-color:var(--red);background:var(--red-light);color:#991b1b;cursor:default}
.quiz-option:disabled{cursor:default}
.quiz-radio{width:16px;height:16px;border-radius:50%;border:2px solid #cbd5e1;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.quiz-option.selected .quiz-radio{border-color:var(--cyan);background:var(--cyan)}
.quiz-option.selected .quiz-radio::after{content:'';width:6px;height:6px;background:#fff;border-radius:50%}
.quiz-result{text-align:center;padding:16px;border-radius:var(--radius);margin-top:12px;font-weight:700;font-size:15px}
.quiz-result.pass{background:var(--emerald-light);border:1px solid #6ee7b7;color:#065f46}
.quiz-result.fail{background:var(--red-light);border:1px solid #fca5a5;color:#991b1b}
.video-container{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius);margin:12px 0;background:#000}
.video-container iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}
.scorm-status{position:fixed;bottom:8px;right:8px;padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;z-index:999}
[dir="rtl"] .scorm-status{right:auto;left:8px}
.scorm-status.connected{background:#d1fae5;color:#065f46}
.scorm-status.disconnected{background:#fee2e2;color:#991b1b}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.animate-in{animation:fadeIn .4s ease forwards}
.section-divider{margin:16px 0;padding:12px;border-radius:var(--radius);background:linear-gradient(135deg,#06b6d4,#0284c7);color:#fff;text-align:center;font-weight:700;font-size:14px}
.hidden{display:none!important}
.topic-list{margin:16px 0;padding:0;list-style:none}
.topic-list li{padding:6px 12px;margin-bottom:4px;border-radius:8px;font-size:12px;display:flex;align-items:center;gap:8px;border:1px solid #e2e8f0}
.topic-list li.current{background:var(--cyan-light);border-color:var(--cyan);font-weight:700;color:var(--cyan)}
.topic-list li .topic-num{width:22px;height:22px;border-radius:50%;background:var(--slate-light);color:var(--slate);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.topic-list li.current .topic-num{background:var(--cyan);color:#fff}
'''

# ══════════════════════════════════════════════════════════════
# SCORM 1.2 JavaScript
# ══════════════════════════════════════════════════════════════

SCORM_JS = '''
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
'''


# ══════════════════════════════════════════════════════════════
# HTML BUILDER with topic list sidebar
# ══════════════════════════════════════════════════════════════

def build_topic_list_html(module, current_idx, lang='en'):
    """Build the topic list showing all topics in the module, highlighting current."""
    items = []
    for i, slide in enumerate(module['slides']):
        cls = ' current' if i == current_idx else ''
        title = slide['title']
        items.append(f'<li class="{cls.strip()}"><span class="topic-num">{i+1}</span>{title}</li>')
    return '<ul class="topic-list" id="topicListEN">' + ''.join(items) + '</ul>'

def build_topic_list_html_ar(module, current_idx):
    items = []
    for i, slide in enumerate(module['slides']):
        cls = ' current' if i == current_idx else ''
        title = slide['title_ar']
        items.append(f'<li class="{cls.strip()}"><span class="topic-num">{i+1}</span>{title}</li>')
    return '<ul class="topic-list" id="topicListAR">' + ''.join(items) + '</ul>'


def build_slide_html(module, slide, slide_idx, quiz_questions):
    """Build a complete self-contained HTML for a single slide/topic."""
    mod_num = module['number']
    mod_title = module['title']
    mod_title_ar = module['title_ar']
    s_title = slide['title']
    s_title_ar = slide['title_ar']

    # Video
    video_url = None
    if slide.get('has_video'):
        if slide.get('video_type') == 'intro':
            video_url = module.get('intro_video')
        elif slide.get('video_type') == 'conclusion':
            video_url = module.get('conclusion_video')

    # Image
    image_b64 = None
    img_key = slide.get('image_key', '')
    if img_key.startswith('module_'):
        mod_n = int(img_key.split('_')[1])
        image_b64 = MODULE_IMAGES.get(mod_n)
    elif img_key in SLIDE_IMAGES:
        image_b64 = SLIDE_IMAGES[img_key]

    content_en = slide.get('content_en', '')
    content_ar = slide.get('content_ar', '')

    # Topic list
    topic_list_en = build_topic_list_html(module, slide_idx)
    topic_list_ar = build_topic_list_html_ar(module, slide_idx)

    # Quiz
    quiz_html = ''
    quiz_js = ''
    if quiz_questions:
        quiz_html = '<div id="quizSection" class="hidden"></div>'
        quiz_js = _build_quiz_js(quiz_questions)

    html = f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module {mod_num}: {s_title}</title>
<style>{CSS}</style>
</head>
<body>
<div class="app">
  <div class="card">
    <div class="card-header">
      <div>
        <span class="badge badge-cyan" id="badgeModule">Module {mod_num}</span>
        <span class="badge badge-violet" id="badgeSlide">Topic {slide_idx + 1} of {len(module['slides'])}</span>
      </div>
      <button class="lang-btn" onclick="toggleLang()" id="langBtn">العربية</button>
    </div>
    <div class="card-body animate-in">
      <h2 class="slide-title" id="slideTitle">{s_title}</h2>
'''

    # Video
    if video_url:
        vl_en = 'Introduction Video' if slide.get('video_type') == 'intro' else 'Conclusion Video'
        vl_ar = 'فيديو المقدمة' if slide.get('video_type') == 'intro' else 'فيديو الخاتمة'
        html += f'''
      <div class="section-divider" id="videoLabel">{vl_en}</div>
      <div class="video-container">
        <iframe src="{video_url}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>
'''

    # Image
    if image_b64:
        html += f'''
      <div style="max-width:500px;margin:12px auto"><img src="{image_b64}" alt="{s_title}"></div>
'''

    # Content
    html += f'''
      <div id="contentEN">{content_en}</div>
      <div id="contentAR" class="hidden">{content_ar}</div>

      <div class="section-divider" id="topicListLabel">All Topics in This Module</div>
      {topic_list_en}
      <div class="hidden" id="topicListARWrap">{topic_list_ar}</div>

      {quiz_html}
    </div>
    <div class="card-footer">
      <span style="font-size:11px;color:var(--slate)" id="footerInfo">Module {mod_num} of 5 &mdash; {mod_title}</span>
'''

    if quiz_questions:
        html += '''
      <button class="btn btn-primary" onclick="showQuiz()" id="quizBtn">Take Quiz</button>
'''

    html += f'''
    </div>
  </div>
</div>
<div class="scorm-status" id="scormStatus"></div>

<script>
{SCORM_JS}

let lang = 'en';

function toggleLang() {{
  lang = lang === 'en' ? 'ar' : 'en';
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = lang === 'ar' ? 'English' : 'العربية';
  document.getElementById('slideTitle').textContent = lang === 'ar' ? {json.dumps(s_title_ar)} : {json.dumps(s_title)};
  document.getElementById('contentEN').classList.toggle('hidden', lang === 'ar');
  document.getElementById('contentAR').classList.toggle('hidden', lang === 'en');
  document.getElementById('badgeModule').textContent = lang === 'ar' ? 'الوحدة {mod_num}' : 'Module {mod_num}';
  document.getElementById('badgeSlide').textContent = lang === 'ar' ? 'الموضوع {slide_idx + 1} من {len(module["slides"])}' : 'Topic {slide_idx + 1} of {len(module["slides"])}';
  document.getElementById('footerInfo').textContent = lang === 'ar' ? 'الوحدة {mod_num} من 5 — {mod_title_ar}' : 'Module {mod_num} of 5 — {mod_title}';
  document.getElementById('topicListLabel').textContent = lang === 'ar' ? 'جميع المواضيع في هذه الوحدة' : 'All Topics in This Module';
  document.getElementById('topicListEN').classList.toggle('hidden', lang === 'ar');
  document.getElementById('topicListARWrap').classList.toggle('hidden', lang === 'en');
'''

    if video_url:
        vl_en = 'Introduction Video' if slide.get('video_type') == 'intro' else 'Conclusion Video'
        vl_ar = 'فيديو المقدمة' if slide.get('video_type') == 'intro' else 'فيديو الخاتمة'
        html += f'''
  var vl = document.getElementById('videoLabel');
  if(vl) vl.textContent = lang === 'ar' ? {json.dumps(vl_ar)} : {json.dumps(vl_en)};
'''

    if quiz_questions:
        html += '''
  var qb = document.getElementById('quizBtn');
  if(qb && !qb.classList.contains('hidden')) qb.textContent = lang === 'ar' ? 'ابدأ الاختبار' : 'Take Quiz';
'''

    html += '''
}
'''

    html += quiz_js

    html += f'''

// Initialize
window.addEventListener('load', function() {{
  SCORM.init();
  SCORM.setStatus('incomplete');
  setTimeout(function() {{
    SCORM.setStatus('completed');
    SCORM.setScore(100, 100, 0);
  }}, 5000);
}});

window.addEventListener('beforeunload', function() {{
  SCORM.finish();
}});
</script>
</body>
</html>'''

    return html


def _build_quiz_js(quiz_questions):
    q_json = json.dumps(quiz_questions)
    return f'''
var QUIZ_DATA = {q_json};
var quizAnswers = {{}};
var quizSubmitted = false;

function showQuiz() {{
  document.getElementById('quizBtn').classList.add('hidden');
  var qs = document.getElementById('quizSection');
  qs.classList.remove('hidden');
  renderQuiz();
}}

function renderQuiz() {{
  var qs = document.getElementById('quizSection');
  var h = '<div class="section-divider">' + (lang==='ar'?'اختبار الموضوع':'Topic Quiz') + '</div>';
  QUIZ_DATA.forEach(function(q, i) {{
    var qText = lang==='ar' ? q.q_ar : q.q;
    var opts = lang==='ar' ? q.opts_ar : q.opts;
    h += '<div style="margin-bottom:16px"><p style="font-weight:700;font-size:14px;margin-bottom:8px">' + (i+1) + '. ' + qText + '</p>';
    opts.forEach(function(o, j) {{
      var cls = 'quiz-option';
      if (quizSubmitted) {{
        if (j === q.correct) cls += ' correct';
        else if (quizAnswers[i] === j) cls += ' wrong';
      }} else if (quizAnswers[i] === j) {{
        cls += ' selected';
      }}
      h += '<button class="' + cls + '"' + (quizSubmitted ? ' disabled' : '') + ' onclick="selectAnswer(' + i + ',' + j + ')"><span class="quiz-radio"></span>' + o + '</button>';
    }});
    h += '</div>';
  }});

  if (!quizSubmitted) {{
    h += '<div style="text-align:center;margin-top:12px"><button class="btn btn-primary" onclick="submitQuiz()">' + (lang==='ar'?'إرسال':'Submit') + '</button></div>';
  }} else {{
    var correct = QUIZ_DATA.filter(function(q,i) {{ return quizAnswers[i] === q.correct; }}).length;
    var pct = Math.round(correct / QUIZ_DATA.length * 100);
    var passed = pct >= 80;
    h += '<div class="quiz-result ' + (passed?'pass':'fail') + '">';
    h += (lang==='ar'?'النتيجة: ':'Score: ') + pct + '% (' + correct + '/' + QUIZ_DATA.length + ')<br>';
    h += passed ? (lang==='ar'?'أحسنت! لقد اجتزت':'Well done! You passed!') : (lang==='ar'?'حاول مرة أخرى':'Try again');
    h += '</div>';
    if (!passed) {{
      h += '<div style="text-align:center;margin-top:12px"><button class="btn btn-outline" onclick="resetQuiz()">' + (lang==='ar'?'حاول مرة أخرى':'Try Again') + '</button></div>';
    }}
    SCORM.setScore(pct, 100, 0);
    SCORM.setStatus(passed ? 'passed' : 'failed');
  }}

  qs.innerHTML = h;
}}

function selectAnswer(qi, oi) {{
  if (quizSubmitted) return;
  quizAnswers[qi] = oi;
  renderQuiz();
}}

function submitQuiz() {{
  if (Object.keys(quizAnswers).length < QUIZ_DATA.length) {{
    alert(lang==='ar'?'يرجى الإجابة على جميع الأسئلة':'Please answer all questions');
    return;
  }}
  quizSubmitted = true;
  renderQuiz();
}}

function resetQuiz() {{
  quizAnswers = {{}};
  quizSubmitted = false;
  renderQuiz();
}}
'''


# ══════════════════════════════════════════════════════════════
# SCORM manifest
# ══════════════════════════════════════════════════════════════

def build_manifest(identifier, title, mastery=80):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{identifier}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org_1"><organization identifier="org_1"><title>{title}</title>
    <item identifier="item_1" identifierref="res_1"><title>{title}</title>
      <adlcp:masteryscore>{mastery}</adlcp:masteryscore></item>
  </organization></organizations>
  <resources><resource identifier="res_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
    <file href="index.html"/></resource></resources>
</manifest>'''


# ══════════════════════════════════════════════════════════════
# Open edX course export builder for each slide
# ══════════════════════════════════════════════════════════════

def safe_id(text):
    """Convert text to a safe XML identifier."""
    return re.sub(r'[^a-zA-Z0-9_]', '_', text)[:60]


def build_openedx_package(module, slide, slide_idx, quiz_questions, scorm_zip_bytes):
    """
    Build a complete Open edX course export tar.gz for one slide.
    Structure:
      course.xml
      course/course.xml
      chapter/<id>.xml
      sequential/<id>.xml
      vertical/<id>.xml
      html/<id>.xml
      html/<id>_content.html
      policies/course/policy.json
      policies/course/grading_policy.json
      static/<scorm>.zip
      static/<folder>/index.html
    """
    mod_num = module['number']
    s_title = slide['title']
    topic_num = slide_idx + 1
    
    course_id = f"M{mod_num}T{topic_num}"
    course_name = f"M{mod_num}_Topic{topic_num}"
    display_name = f"Module {mod_num} - Topic {topic_num}: {s_title}"
    
    chap_id = f"m{mod_num}_t{topic_num}_chapter"
    seq_id = f"m{mod_num}_t{topic_num}_seq"
    vert_id = f"m{mod_num}_t{topic_num}_unit"
    html_id = f"m{mod_num}_t{topic_num}_html"
    scorm_zip_name = f"m{mod_num}-topic{topic_num}-{slide['id']}-scorm.zip"
    static_folder = f"m{mod_num}_topic{topic_num}"
    
    files = {}
    
    # 1. Root course.xml
    files['course.xml'] = f'<course url_name="course" org="HealthAI" course="{course_name}" />\n'
    
    # 2. course/course.xml
    files['course/course.xml'] = f'''<course display_name="{display_name}" language="en" start="2026-01-01T00:00:00Z">
  <chapter url_name="{chap_id}"/>
</course>
'''
    
    # 3. chapter
    files[f'chapter/{chap_id}.xml'] = f'<chapter display_name="Module {mod_num}: {module["title"]}"><sequential url_name="{seq_id}"/></chapter>\n'
    
    # 4. sequential
    files[f'sequential/{seq_id}.xml'] = f'<sequential display_name="Topic {topic_num}: {s_title}"><vertical url_name="{vert_id}"/></sequential>\n'
    
    # 5. vertical
    files[f'vertical/{vert_id}.xml'] = f'<vertical display_name="{display_name}"><html url_name="{html_id}"/></vertical>\n'
    
    # 6. html reference
    files[f'html/{html_id}.xml'] = f'<html filename="{html_id}_content" display_name="{display_name}"/>\n'
    
    # 7. html content (iframe to SCORM content)
    files[f'html/{html_id}_content.html'] = f'<iframe src="/static/{static_folder}/index.html" width="100%" height="800" frameborder="0" allowfullscreen></iframe>\n'
    
    # 8. policies
    files['policies/course/policy.json'] = json.dumps({
        "course/course": {
            "display_name": display_name,
            "start": "2026-01-01T00:00:00Z",
            "language": "en"
        }
    })
    
    files['policies/course/grading_policy.json'] = json.dumps({
        "GRADER": [{"type": "Module Quiz", "min_count": 1, "drop_count": 0, "weight": 1.0}],
        "GRADE_CUTOFFS": {"Pass": 0.7}
    })
    
    # 9. static/scorm.zip (the SCORM package)
    # 10. static/<folder>/index.html (extracted HTML)
    
    return files, scorm_zip_name, static_folder


def build_all_packages():
    """Build Open edX course export tar.gz for each slide."""
    
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_packages = []
    
    for module in MODULES:
        mod_num = module['number']
        mod_dir = os.path.join(OUTPUT_DIR, f'module{mod_num}')
        os.makedirs(mod_dir, exist_ok=True)
        
        print(f"\n{'='*60}")
        print(f"Module {mod_num}: {module['title']}")
        print(f"{'='*60}")
        
        for slide_idx, slide in enumerate(module['slides']):
            topic_num = slide_idx + 1
            s_id = slide['id']
            s_title = slide['title']
            
            # Quiz on last slide
            is_last = (slide_idx == len(module['slides']) - 1)
            quiz_qs = module['quiz'] if is_last else None
            
            # Build the HTML content
            html_content = build_slide_html(module, slide, slide_idx, quiz_qs)
            
            # Build SCORM zip in memory
            manifest_title = f"Module {mod_num} - Topic {topic_num}: {s_title}"
            manifest_id = f"M{mod_num}_Topic{topic_num}_{safe_id(s_id)}"
            manifest_xml = build_manifest(manifest_id, manifest_title)
            
            scorm_buf = io.BytesIO()
            with zipfile.ZipFile(scorm_buf, 'w', zipfile.ZIP_DEFLATED) as zf:
                zf.writestr('index.html', html_content)
                zf.writestr('imsmanifest.xml', manifest_xml)
            scorm_zip_bytes = scorm_buf.getvalue()
            
            # Build Open edX package structure
            edx_files, scorm_zip_name, static_folder = build_openedx_package(
                module, slide, slide_idx, quiz_qs, scorm_zip_bytes
            )
            
            # Create tar.gz
            tar_name = f"m{mod_num}-topic{topic_num}-{s_id}-openedx.tar.gz"
            tar_path = os.path.join(mod_dir, tar_name)
            
            with tarfile.open(tar_path, 'w:gz') as tar:
                # Add XML/JSON files
                for filepath, content in edx_files.items():
                    data = content.encode('utf-8')
                    info = tarfile.TarInfo(name=filepath)
                    info.size = len(data)
                    tar.addfile(info, io.BytesIO(data))
                
                # Add SCORM zip to static/
                info = tarfile.TarInfo(name=f'static/{scorm_zip_name}')
                info.size = len(scorm_zip_bytes)
                tar.addfile(info, io.BytesIO(scorm_zip_bytes))
                
                # Add index.html to static/<folder>/
                html_bytes = html_content.encode('utf-8')
                info = tarfile.TarInfo(name=f'static/{static_folder}/index.html')
                info.size = len(html_bytes)
                tar.addfile(info, io.BytesIO(html_bytes))
            
            size_kb = os.path.getsize(tar_path) / 1024
            has_vid = 'V' if slide.get('has_video') else ' '
            has_quiz = 'Q' if quiz_qs else ' '
            has_img = 'I' if slide.get('image_key') else ' '
            print(f"  [{has_vid}{has_img}{has_quiz}] Topic {topic_num}: {s_title:45s} -> {tar_name} ({size_kb:.1f} KB)")
            
            all_packages.append({
                'module': mod_num,
                'topic': topic_num,
                'title': s_title,
                'title_ar': slide['title_ar'],
                'tar_name': tar_name,
                'tar_path': tar_path,
                'size_kb': size_kb,
                'has_video': bool(slide.get('has_video')),
                'has_quiz': bool(quiz_qs),
                'has_image': bool(slide.get('image_key')),
            })
    
    return all_packages


def build_combined_tar(all_packages):
    """Create a combined tar.gz with all per-slide packages."""
    combined_path = os.path.join(OUTPUT_DIR, 'all-per-slide-openedx.tar.gz')
    with tarfile.open(combined_path, 'w:gz') as tar:
        for pkg in all_packages:
            arcname = f"module{pkg['module']}/{pkg['tar_name']}"
            tar.add(pkg['tar_path'], arcname=arcname)
    
    size_kb = os.path.getsize(combined_path) / 1024
    print(f"\nCombined archive: all-per-slide-openedx.tar.gz ({size_kb:.1f} KB)")
    return combined_path


# Also build SCORM-only zips (for direct SCORM XBlock upload)
def build_scorm_zips(all_packages_data):
    """Also generate simple SCORM .zip files alongside the Open edX tar.gz."""
    scorm_dir = os.path.join(OUTPUT_DIR, 'scorm-zips')
    os.makedirs(scorm_dir, exist_ok=True)
    
    for module in MODULES:
        mod_num = module['number']
        mod_scorm_dir = os.path.join(scorm_dir, f'module{mod_num}')
        os.makedirs(mod_scorm_dir, exist_ok=True)
        
        for slide_idx, slide in enumerate(module['slides']):
            topic_num = slide_idx + 1
            s_id = slide['id']
            is_last = (slide_idx == len(module['slides']) - 1)
            quiz_qs = module['quiz'] if is_last else None
            
            html_content = build_slide_html(module, slide, slide_idx, quiz_qs)
            manifest_title = f"Module {mod_num} - Topic {topic_num}: {slide['title']}"
            manifest_id = f"M{mod_num}_Topic{topic_num}_{safe_id(s_id)}"
            manifest_xml = build_manifest(manifest_id, manifest_title)
            
            zip_name = f"m{mod_num}-topic{topic_num}-{s_id}.zip"
            zip_path = os.path.join(mod_scorm_dir, zip_name)
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                zf.writestr('index.html', html_content)
                zf.writestr('imsmanifest.xml', manifest_xml)
    
    print(f"\nSCORM zips also saved to: {scorm_dir}/")


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

print("\nBuilding per-slide Open edX course export packages...")
print("Each package is a proper Open edX .tar.gz with course.xml, chapter/, sequential/, etc.\n")

all_packages = build_all_packages()

print(f"\nSummary:")
total = len(all_packages)
total_size = sum(p['size_kb'] for p in all_packages)
vids = sum(1 for p in all_packages if p['has_video'])
quizzes = sum(1 for p in all_packages if p['has_quiz'])
imgs = sum(1 for p in all_packages if p['has_image'])
print(f"  Total packages: {total}")
print(f"  Total size: {total_size:.1f} KB")
print(f"  With videos: {vids}")
print(f"  With quizzes: {quizzes}")
print(f"  With images: {imgs}")

# Topic listing
print(f"\nComplete Topic Listing:")
current_mod = 0
for pkg in all_packages:
    if pkg['module'] != current_mod:
        current_mod = pkg['module']
        mod = next(m for m in MODULES if m['number'] == current_mod)
        print(f"\n  Module {current_mod}: {mod['title']} ({mod['title_ar']})")
        print(f"  {'='*60}")
    v = 'V' if pkg['has_video'] else ' '
    q = 'Q' if pkg['has_quiz'] else ' '
    print(f"    [{v}{q}] Topic {pkg['topic']:2d}: {pkg['title']}")

# Build combined archive
combined = build_combined_tar(all_packages)

# Also build SCORM zips
build_scorm_zips(all_packages)

print(f"\nAll {total} Open edX per-slide packages built successfully!")
print(f"Output: {OUTPUT_DIR}/")
print(f"  - Per-slide tar.gz: module1/ to module5/ (each is a valid Open edX course import)")
print(f"  - Combined archive: all-per-slide-openedx.tar.gz")
print(f"  - SCORM zips: scorm-zips/ (for direct SCORM XBlock upload)")
print(f"\nTo import into Open edX: Studio > Import > Upload any .tar.gz file")
