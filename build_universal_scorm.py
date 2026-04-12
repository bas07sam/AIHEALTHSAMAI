#!/usr/bin/env python3
"""
Universal SCORM 1.2 Builder for Open edX
=========================================

Generates per-slide and per-activity SCORM 1.2 packages from course data.
Designed to be reusable for any bilingual (EN/AR) course.

Outputs:
  - One SCORM .zip per lesson/topic slide (content only, no activities embedded)
  - One SCORM .zip per interactive activity (match, flashcard, drag-drop)
  - One Open edX .tar.gz wrapper per SCORM zip
  - Combined archive files for bulk import

Features:
  - Default language: Arabic (RTL)
  - Bilingual support: Arabic (default) + English toggle
  - SCORM 1.2 API integration with imsmanifest.xml
  - Base64-embedded images (no external dependencies)
  - No videos, no quizzes, no content menus
  - Clean self-contained HTML per package

Usage:
  python3 build_universal_scorm.py

To adapt for another course:
  1. Replace COURSE_INFO with your course metadata
  2. Replace MODULES with your module/slide data
  3. Replace ACTIVITIES with your interactive activities
  4. Update IMAGE_MAP for your image paths
  5. Run the script
"""

import os, zipfile, json, io, base64, tarfile, shutil
from PIL import Image

# ══════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'scorm-output')

# Default language: 'ar' for Arabic, 'en' for English
DEFAULT_LANG = 'ar'

COURSE_INFO = {
    'title_en': 'AI Automation and Vibe Coding',
    'title_ar': 'أتمتة الذكاء الاصطناعي والبرمجة بالوصف',
    'org': 'HealthAI',
    'total_modules': 5,
}


# ══════════════════════════════════════════════════════════════
# IMAGE LOADING
# ══════════════════════════════════════════════════════════════

def img_to_base64(path, max_w=600, quality=45):
    """Compress image and return as base64 data URI."""
    if not os.path.exists(path):
        return None
    img = Image.open(path).convert('RGB')
    ratio = max_w / img.width if img.width > max_w else 1
    if ratio < 1:
        img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=quality, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


print("Loading images...")
MODULE_IMAGES = {}
module_img_map = {
    1: 'public/images/module1-intro-ai-automation.png',
    2: 'public/images/module2-workflow-thinking.png',
    3: 'public/images/module3-ai-agents.png',
    4: 'public/images/module4-vibe-coding.png',
    5: 'public/images/module5-designing-solutions.png',
}
for mod_num, path in module_img_map.items():
    full = os.path.join(BASE_DIR, path)
    b64 = img_to_base64(full)
    if b64:
        MODULE_IMAGES[mod_num] = b64
        print(f"  Module {mod_num} banner: {len(b64) // 1024}KB")

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
        print(f"  Slide '{key}': {len(b64) // 1024}KB")


# ══════════════════════════════════════════════════════════════
# INTERACTIVE ACTIVITIES DATA
# Each activity is keyed by its unique ID
# ══════════════════════════════════════════════════════════════

ACTIVITIES = {
    # ── Module 1 ──
    's1-match': {
        'type': 'match',
        'module': 1,
        'title_en': 'Traditional vs AI Automation',
        'title_ar': 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي',
        'desc_en': 'Match each concept to the correct automation type',
        'desc_ar': 'طابق كل مفهوم مع نوع الأتمتة الصحيح',
        'pairs': [
            {'left_en': 'Fixed rules: If X, do Y', 'left_ar': 'قواعد ثابتة: إذا حدث X، افعل Y', 'right_en': 'Traditional Automation', 'right_ar': 'الأتمتة التقليدية'},
            {'left_en': 'Context-aware processing', 'left_ar': 'معالجة واعية للسياق', 'right_en': 'AI Automation', 'right_ar': 'أتمتة الذكاء الاصطناعي'},
            {'left_en': 'Handles only structured data', 'left_ar': 'تتعامل مع البيانات المنظمة فقط', 'right_en': 'Traditional Automation', 'right_ar': 'الأتمتة التقليدية'},
            {'left_en': 'Processes unstructured text & images', 'left_ar': 'تعالج النصوص والصور غير المنظمة', 'right_en': 'AI Automation', 'right_ar': 'أتمتة الذكاء الاصطناعي'},
            {'left_en': 'Adaptive decision logic', 'left_ar': 'منطق قرار تكيفي', 'right_en': 'AI Automation', 'right_ar': 'أتمتة الذكاء الاصطناعي'},
            {'left_en': 'Rigid predefined workflows', 'left_ar': 'سير عمل جامد محدد مسبقًا', 'right_en': 'Traditional Automation', 'right_ar': 'الأتمتة التقليدية'},
        ]
    },
    's1-flash': {
        'type': 'flashcard',
        'module': 1,
        'title_en': 'Automation Types Flashcards',
        'title_ar': 'بطاقات أنواع الأتمتة',
        'desc_en': 'Review the three types of automation',
        'desc_ar': 'مراجعة الأنواع الثلاثة للأتمتة',
        'cards': [
            {'front_en': 'Task Automation', 'front_ar': 'أتمتة المهام', 'back_en': 'Automates a single, isolated action. Examples: Send confirmation email, create calendar entry, save to spreadsheet.', 'back_ar': 'أتمتة إجراء واحد منفصل. أمثلة: إرسال بريد تأكيد، إنشاء إدخال في التقويم، الحفظ في جدول بيانات.'},
            {'front_en': 'Process Automation', 'front_ar': 'أتمتة العمليات', 'back_en': 'Connects multiple steps into a unified workflow. Examples: HR onboarding flow, order processing pipeline.', 'back_ar': 'ربط خطوات متعددة في سير عمل موحد. أمثلة: تدفق تهيئة الموارد البشرية، خط معالجة الطلبات.'},
            {'front_en': 'Intelligent Automation', 'front_ar': 'الأتمتة الذكية', 'back_en': 'Combines automation with AI capabilities like predicting, classifying, and recommending.', 'back_ar': 'تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التنبؤ والتصنيف والتوصية.'},
            {'front_en': 'Traditional Automation', 'front_ar': 'الأتمتة التقليدية', 'back_en': 'Uses fixed, rule-based logic (If X, do Y). Works well for structured, predictable tasks.', 'back_ar': 'تستخدم منطقًا ثابتًا قائمًا على القواعد (إذا حدث X، افعل Y).'},
            {'front_en': 'AI Automation', 'front_ar': 'أتمتة الذكاء الاصطناعي', 'back_en': 'Context-aware automation that can handle unstructured data, adapt to new situations, and make intelligent decisions.', 'back_ar': 'أتمتة واعية للسياق يمكنها التعامل مع البيانات غير المنظمة والتكيف مع المواقف الجديدة.'},
        ]
    },
    # ── Module 2 ──
    's2-drag': {
        'type': 'dragdrop',
        'module': 2,
        'title_en': 'Build a Workflow Sequence',
        'title_ar': 'بناء تسلسل سير العمل',
        'desc_en': 'Drag and drop the workflow components into the correct order',
        'desc_ar': 'اسحب وأفلت مكونات سير العمل بالترتيب الصحيح',
        'items': [
            {'id': 'trigger', 'text_en': 'Trigger: Patient submits appointment request', 'text_ar': 'المحفز: يقدم المريض طلب موعد', 'order': 1},
            {'id': 'condition', 'text_en': 'Condition: Check if preferred slot is available', 'text_ar': 'الشرط: التحقق من توفر الموعد المفضل', 'order': 2},
            {'id': 'action1', 'text_en': 'Action: Send confirmation or alternative options', 'text_ar': 'الإجراء: إرسال تأكيد أو خيارات بديلة', 'order': 3},
            {'id': 'action2', 'text_en': 'Action: Update calendar and patient record', 'text_ar': 'الإجراء: تحديث التقويم وسجل المريض', 'order': 4},
            {'id': 'output', 'text_en': 'Output: Confirmation notification to patient', 'text_ar': 'المخرج: إشعار تأكيد للمريض', 'order': 5},
        ]
    },
    's2-match': {
        'type': 'match',
        'module': 2,
        'title_en': 'Workflow Building Blocks',
        'title_ar': 'مكونات بناء سير العمل',
        'desc_en': 'Match each workflow component with its definition',
        'desc_ar': 'طابق كل مكون من مكونات سير العمل مع تعريفه',
        'pairs': [
            {'left_en': 'Starts the workflow automatically', 'left_ar': 'يبدأ سير العمل تلقائيًا', 'right_en': 'Trigger', 'right_ar': 'المحفز'},
            {'left_en': 'The task performed by the system', 'left_ar': 'المهمة التي ينفذها النظام', 'right_en': 'Action', 'right_ar': 'الإجراء'},
            {'left_en': 'Checks if criteria are met before proceeding', 'left_ar': 'يتحقق من استيفاء المعايير قبل المتابعة', 'right_en': 'Condition', 'right_ar': 'الشرط'},
            {'left_en': 'The final result delivered to the user', 'left_ar': 'النتيجة النهائية المقدمة للمستخدم', 'right_en': 'Output', 'right_ar': 'المخرج'},
            {'left_en': 'New form submission received', 'left_ar': 'استلام نموذج جديد', 'right_en': 'Trigger', 'right_ar': 'المحفز'},
            {'left_en': 'Send email notification', 'left_ar': 'إرسال إشعار بالبريد الإلكتروني', 'right_en': 'Action', 'right_ar': 'الإجراء'},
        ]
    },
    # ── Module 3 ──
    's3-flash': {
        'type': 'flashcard',
        'module': 3,
        'title_en': 'AI Agent Concepts',
        'title_ar': 'مفاهيم وكلاء الذكاء الاصطناعي',
        'desc_en': 'Review key AI agent concepts and capabilities',
        'desc_ar': 'مراجعة المفاهيم والقدرات الرئيسية لوكلاء الذكاء الاصطناعي',
        'cards': [
            {'front_en': 'AI Agent', 'front_ar': 'وكيل الذكاء الاصطناعي', 'back_en': 'A system that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow.', 'back_ar': 'نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل.'},
            {'front_en': 'Goal-Oriented Behavior', 'front_ar': 'السلوك الموجه نحو الهدف', 'back_en': 'AI agents work toward defined objectives rather than just following fixed rules.', 'back_ar': 'يعمل وكلاء الذكاء الاصطناعي نحو أهداف محددة بدلاً من مجرد اتباع قواعد ثابتة.'},
            {'front_en': 'Agent vs Standard Automation', 'front_ar': 'الوكيل مقابل الأتمتة العادية', 'back_en': 'Standard automation follows fixed steps. AI agents can interpret, decide, and adapt.', 'back_ar': 'تتبع الأتمتة العادية خطوات ثابتة. يمكن لوكلاء الذكاء الاصطناعي التفسير والقرار والتكيف.'},
            {'front_en': 'Decision Support', 'front_ar': 'دعم القرار', 'back_en': 'AI agents can analyze data, identify patterns, and recommend actions to support human decision-making.', 'back_ar': 'يمكن لوكلاء الذكاء الاصطناعي تحليل البيانات وتحديد الأنماط والتوصية بالإجراءات.'},
            {'front_en': 'Multi-Step Reasoning', 'front_ar': 'الاستدلال متعدد الخطوات', 'back_en': 'AI agents can break complex tasks into sub-tasks, execute them sequentially, and adjust based on results.', 'back_ar': 'يمكن لوكلاء الذكاء الاصطناعي تقسيم المهام المعقدة إلى مهام فرعية.'},
        ]
    },
    's3-match': {
        'type': 'match',
        'module': 3,
        'title_en': 'Agent Capabilities Matching',
        'title_ar': 'مطابقة قدرات الوكلاء',
        'desc_en': 'Match each capability with the correct description',
        'desc_ar': 'طابق كل قدرة مع الوصف الصحيح',
        'pairs': [
            {'left_en': 'Reads and understands patient messages', 'left_ar': 'يقرأ ويفهم رسائل المرضى', 'right_en': 'Natural Language Understanding', 'right_ar': 'فهم اللغة الطبيعية'},
            {'left_en': 'Prioritizes tasks based on urgency', 'left_ar': 'يحدد أولويات المهام بناءً على الإلحاح', 'right_en': 'Decision Making', 'right_ar': 'اتخاذ القرار'},
            {'left_en': 'Works toward a defined objective', 'left_ar': 'يعمل نحو هدف محدد', 'right_en': 'Goal-Oriented Behavior', 'right_ar': 'السلوك الموجه نحو الهدف'},
            {'left_en': 'Adjusts workflow based on new data', 'left_ar': 'يعدل سير العمل بناءً على بيانات جديدة', 'right_en': 'Adaptive Execution', 'right_ar': 'التنفيذ التكيفي'},
            {'left_en': 'Calls APIs and updates records', 'left_ar': 'يستدعي واجهات برمجة التطبيقات ويحدث السجلات', 'right_en': 'Tool Use', 'right_ar': 'استخدام الأدوات'},
            {'left_en': 'Remembers previous interactions', 'left_ar': 'يتذكر التفاعلات السابقة', 'right_en': 'Context Awareness', 'right_ar': 'الوعي بالسياق'},
        ]
    },
    # ── Module 4 ──
    's4-drag': {
        'type': 'dragdrop',
        'module': 4,
        'title_en': 'Vibe Coding Workflow',
        'title_ar': 'سير عمل البرمجة بالوصف',
        'desc_en': 'Arrange the vibe coding steps in the correct order',
        'desc_ar': 'رتب خطوات البرمجة بالوصف بالترتيب الصحيح',
        'items': [
            {'id': 'describe', 'text_en': 'Describe what you want to build in natural language', 'text_ar': 'صف ما تريد بناءه بلغة طبيعية', 'order': 1},
            {'id': 'generate', 'text_en': 'AI generates the initial code/app', 'text_ar': 'يولد الذكاء الاصطناعي الكود/التطبيق الأولي', 'order': 2},
            {'id': 'review', 'text_en': 'Review the generated output', 'text_ar': 'راجع المخرجات المولدة', 'order': 3},
            {'id': 'refine', 'text_en': 'Refine with follow-up prompts', 'text_ar': 'حسّن باستخدام أوامر متابعة', 'order': 4},
            {'id': 'iterate', 'text_en': 'Iterate until the solution meets requirements', 'text_ar': 'كرر حتى يلبي الحل المتطلبات', 'order': 5},
        ]
    },
    's4-flash': {
        'type': 'flashcard',
        'module': 4,
        'title_en': 'Vibe Coding Key Concepts',
        'title_ar': 'المفاهيم الأساسية للبرمجة بالوصف',
        'desc_en': 'Review the core concepts of vibe coding',
        'desc_ar': 'مراجعة المفاهيم الأساسية للبرمجة بالوصف',
        'cards': [
            {'front_en': 'Vibe Coding', 'front_ar': 'البرمجة بالوصف', 'back_en': 'Creating digital solutions by describing what you want in natural language, then letting AI generate the code.', 'back_ar': 'إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود.'},
            {'front_en': 'Describe-Generate-Refine', 'front_ar': 'صف-ولّد-حسّن', 'back_en': 'The core vibe coding loop: describe your idea, AI generates a solution, you refine through iteration.', 'back_ar': 'حلقة البرمجة بالوصف الأساسية: صف فكرتك، يولد الذكاء الاصطناعي حلاً، تحسنه من خلال التكرار.'},
            {'front_en': 'Prompt-Driven Development', 'front_ar': 'التطوير القائم على الأوامر', 'back_en': 'Writing natural language instructions to guide AI in building applications.', 'back_ar': 'كتابة تعليمات بلغة طبيعية لتوجيه الذكاء الاصطناعي في بناء التطبيقات.'},
            {'front_en': 'Rapid Prototyping', 'front_ar': 'النمذجة السريعة', 'back_en': 'Quickly creating working prototypes of ideas using AI tools.', 'back_ar': 'إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي.'},
            {'front_en': 'Iteration', 'front_ar': 'التكرار', 'back_en': 'The process of repeatedly refining prompts and output until the solution meets requirements.', 'back_ar': 'عملية تحسين الأوامر والمخرجات المولدة بشكل متكرر حتى يلبي الحل المتطلبات.'},
        ]
    },
    # ── Module 5 ──
    's5-match': {
        'type': 'match',
        'module': 5,
        'title_en': 'Use Case Categories',
        'title_ar': 'فئات حالات الاستخدام',
        'desc_en': 'Match each use case to its category',
        'desc_ar': 'طابق كل حالة استخدام مع فئتها',
        'pairs': [
            {'left_en': 'Automated appointment scheduling', 'left_ar': 'جدولة المواعيد الآلية', 'right_en': 'Operational Coordination', 'right_ar': 'التنسيق التشغيلي'},
            {'left_en': 'Patient follow-up reminders', 'left_ar': 'تذكيرات متابعة المرضى', 'right_en': 'Communication', 'right_ar': 'التواصل'},
            {'left_en': 'Flagging abnormal lab results', 'left_ar': 'تمييز نتائج المختبر غير الطبيعية', 'right_en': 'Decision Support', 'right_ar': 'دعم القرار'},
            {'left_en': 'Auto-generating shift reports', 'left_ar': 'إنشاء تقارير النوبات تلقائيًا', 'right_en': 'Productivity', 'right_ar': 'الإنتاجية'},
            {'left_en': 'Tracking medication inventory levels', 'left_ar': 'تتبع مستويات مخزون الأدوية', 'right_en': 'Monitoring & Alerts', 'right_ar': 'المراقبة والتنبيهات'},
            {'left_en': 'Routing referrals to specialists', 'left_ar': 'توجيه الإحالات إلى المتخصصين', 'right_en': 'Operational Coordination', 'right_ar': 'التنسيق التشغيلي'},
        ]
    },
    's5-drag': {
        'type': 'dragdrop',
        'module': 5,
        'title_en': 'Solution Design Steps',
        'title_ar': 'خطوات تصميم الحل',
        'desc_en': 'Arrange the solution design process in correct order',
        'desc_ar': 'رتب عملية تصميم الحل بالترتيب الصحيح',
        'items': [
            {'id': 'identify', 'text_en': 'Identify the problem and repetitive task', 'text_ar': 'تحديد المشكلة والمهمة المتكررة', 'order': 1},
            {'id': 'map', 'text_en': 'Map the current workflow', 'text_ar': 'رسم خريطة سير العمل الحالي', 'order': 2},
            {'id': 'insert', 'text_en': 'Identify where AI adds value', 'text_ar': 'تحديد أين يضيف الذكاء الاصطناعي قيمة', 'order': 3},
            {'id': 'design', 'text_en': 'Design the automated workflow', 'text_ar': 'تصميم سير العمل الآلي', 'order': 4},
            {'id': 'test', 'text_en': 'Test, refine, and deploy the solution', 'text_ar': 'اختبار الحل وتحسينه ونشره', 'order': 5},
        ]
    },
}


# ══════════════════════════════════════════════════════════════
# COURSE MODULES - Slide content (NO activities embedded here)
# ══════════════════════════════════════════════════════════════

MODULES = [
    # ── MODULE 1: Introduction to AI Automation (9 slides) ──
    {
        'number': 1,
        'title_en': 'Introduction to AI Automation',
        'title_ar': 'مقدمة في أتمتة الذكاء الاصطناعي',
        'slides': [
            {
                'id': 'm1-s1', 'title_en': 'Introduction to AI Automation', 'title_ar': 'مقدمة في أتمتة الذكاء الاصطناعي', 'type': 'intro', 'image_key': 'module_1',
                'content_en': '<p class="slide-subtitle">Fundamentals, Types, and the Difference Between Traditional and AI Systems</p><div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Define what automation means</li><li>Distinguish between traditional and AI automation</li><li>Identify the three core types of automation</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#AutomationBasics</span><span class="chip">#TraditionalAutomation</span><span class="chip">#AIAutomation</span><span class="chip">#TaskAutomation</span><span class="chip">#ProcessAutomation</span><span class="chip">#IntelligentAutomation</span></div>',
                'content_ar': '<p class="slide-subtitle">الأساسيات والأنواع والفرق بين الأنظمة التقليدية والذكاء الاصطناعي</p><div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تعريف معنى الأتمتة</li><li>التمييز بين الأتمتة التقليدية وأتمتة الذكاء الاصطناعي</li><li>تحديد الأنواع الثلاثة الأساسية للأتمتة</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#أساسيات_الأتمتة</span><span class="chip">#الأتمتة_التقليدية</span><span class="chip">#أتمتة_الذكاء_الاصطناعي</span><span class="chip">#أتمتة_المهام</span><span class="chip">#أتمتة_العمليات</span><span class="chip">#الأتمتة_الذكية</span></div>',
            },
            {
                'id': 'm1-s2', 'title_en': 'What is Automation?', 'title_ar': 'ما هي الأتمتة؟', 'type': 'content', 'image_key': 'automation-concept',
                'content_en': '<div class="info-box cyan"><strong>Definition:</strong> Automation is the use of technology to perform tasks with minimal human intervention, reducing manual effort and increasing efficiency.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Aspects of Automation:</strong><ul style="margin:8px 0 0 16px"><li><strong>Technology-Driven:</strong> Uses software, AI, or machines to execute tasks</li><li><strong>Minimal Human Intervention:</strong> Reduces or eliminates manual steps</li><li><strong>Efficiency Focused:</strong> Speeds up processes while reducing errors</li><li><strong>Scalable:</strong> Can handle increasing workloads without proportional increase in effort</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Examples in Healthcare:</strong> Automated appointment reminders, lab result notifications, inventory tracking, patient follow-up emails.</div>',
                'content_ar': '<div class="info-box cyan"><strong>التعريف:</strong> الأتمتة هي استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري، مما يقلل الجهد اليدوي ويزيد الكفاءة.</div><div class="info-box violet" style="margin-top:12px"><strong>الجوانب الرئيسية للأتمتة:</strong><ul style="margin:8px 0 0 16px"><li><strong>مدفوعة بالتكنولوجيا:</strong> تستخدم البرمجيات أو الذكاء الاصطناعي أو الآلات لتنفيذ المهام</li><li><strong>أقل تدخل بشري:</strong> تقلل أو تلغي الخطوات اليدوية</li><li><strong>تركز على الكفاءة:</strong> تسرع العمليات مع تقليل الأخطاء</li><li><strong>قابلة للتوسع:</strong> يمكنها التعامل مع أحمال عمل متزايدة</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong> تذكيرات المواعيد الآلية، إشعارات نتائج المختبر، تتبع المخزون، رسائل المتابعة للمرضى.</div>',
            },
            {
                'id': 'm1-s3', 'title_en': 'Why Automation Matters', 'title_ar': 'لماذا الأتمتة مهمة', 'type': 'content', 'image_key': 'why-automation',
                'content_en': '<div class="info-box cyan"><strong>Why does automation matter?</strong> In modern work environments, automation addresses key challenges:</div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Saves Time</strong><br>Reduces hours spent on repetitive manual tasks</div><div class="info-box violet"><strong>Reduces Errors</strong><br>Consistent execution without human mistakes</div><div class="info-box amber"><strong>Increases Productivity</strong><br>Frees staff to focus on higher-value work</div><div class="info-box cyan"><strong>Enables Scalability</strong><br>Handles growing workloads without adding staff</div></div><div class="info-box slate" style="margin-top:12px"><strong>Healthcare Impact:</strong> Healthcare environments involve repetitive administrative work, manual follow-ups, documentation burden, fragmented communication, and time-sensitive coordination. Automation can help address all of these.</div>',
                'content_ar': '<div class="info-box cyan"><strong>لماذا الأتمتة مهمة؟</strong> في بيئات العمل الحديثة، تعالج الأتمتة تحديات رئيسية:</div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>توفير الوقت</strong><br>تقليل الساعات المنفقة على المهام اليدوية المتكررة</div><div class="info-box violet"><strong>تقليل الأخطاء</strong><br>تنفيذ متسق بدون أخطاء بشرية</div><div class="info-box amber"><strong>زيادة الإنتاجية</strong><br>تحرير الموظفين للتركيز على العمل الأعلى قيمة</div><div class="info-box cyan"><strong>تمكين التوسع</strong><br>التعامل مع أحمال العمل المتزايدة بدون إضافة موظفين</div></div><div class="info-box slate" style="margin-top:12px"><strong>الأثر في الرعاية الصحية:</strong> تتضمن بيئات الرعاية الصحية أعمالاً إدارية متكررة ومتابعات يدوية وعبء توثيق واتصالات مجزأة وتنسيقاً حساساً للوقت. يمكن للأتمتة المساعدة في معالجة كل هذه التحديات.</div>',
            },
            {
                'id': 'm1-s4', 'title_en': 'Traditional vs AI Automation', 'title_ar': 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي', 'type': 'content', 'image_key': 'trad-vs-ai',
                'content_en': '<div class="grid-2"><div class="info-box violet"><strong>Traditional Automation</strong><br><br><ul style="margin-left:16px"><li>Fixed rules: If X, do Y</li><li>Handles only structured data</li><li>Rigid, predefined workflows</li><li>Cannot handle exceptions</li><li>Good for predictable, repetitive tasks</li></ul></div><div class="info-box emerald"><strong>AI Automation</strong><br><br><ul style="margin-left:16px"><li>Context-aware processing</li><li>Processes unstructured text & images</li><li>Adaptive decision logic</li><li>Handles ambiguity and exceptions</li><li>Learns and improves over time</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>Key Difference:</strong> Traditional automation follows fixed rules. AI automation can interpret, decide, and adapt.</div>',
                'content_ar': '<div class="grid-2"><div class="info-box violet"><strong>الأتمتة التقليدية</strong><br><br><ul style="margin-right:16px"><li>قواعد ثابتة: إذا حدث X، افعل Y</li><li>تتعامل مع البيانات المنظمة فقط</li><li>سير عمل جامد محدد مسبقاً</li><li>لا تستطيع التعامل مع الاستثناءات</li><li>جيدة للمهام المتوقعة والمتكررة</li></ul></div><div class="info-box emerald"><strong>أتمتة الذكاء الاصطناعي</strong><br><br><ul style="margin-right:16px"><li>معالجة واعية للسياق</li><li>تعالج النصوص والصور غير المنظمة</li><li>منطق قرار تكيفي</li><li>تتعامل مع الغموض والاستثناءات</li><li>تتعلم وتتحسن مع الوقت</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>الفرق الرئيسي:</strong> الأتمتة التقليدية تتبع قواعد ثابتة. أتمتة الذكاء الاصطناعي يمكنها التفسير واتخاذ القرارات والتكيف.</div>',
            },
            {
                'id': 'm1-s5', 'title_en': 'Three Types of Automation', 'title_ar': 'الأنواع الثلاثة للأتمتة', 'type': 'content', 'image_key': 'automation-types',
                'content_en': '<div class="info-box cyan"><strong>Understanding the three core types of automation helps you identify which approach fits different tasks.</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. Task Automation</strong><br>Automates a single, isolated action.<br><em>Examples: Send confirmation email, create calendar entry, save to spreadsheet.</em></div><div class="info-box violet" style="margin-bottom:8px"><strong>2. Process Automation</strong><br>Connects multiple steps into a unified workflow.<br><em>Examples: HR onboarding flow, order processing pipeline.</em></div><div class="info-box amber"><strong>3. Intelligent Automation</strong><br>Combines automation with AI capabilities like predicting, classifying, and recommending.<br><em>Examples: Classify & route tickets, summarize text, detect anomalies.</em></div></div>',
                'content_ar': '<div class="info-box cyan"><strong>فهم الأنواع الثلاثة الأساسية للأتمتة يساعدك في تحديد النهج المناسب للمهام المختلفة.</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. أتمتة المهام</strong><br>أتمتة إجراء واحد منفصل.<br><em>أمثلة: إرسال بريد تأكيد، إنشاء إدخال في التقويم، الحفظ في جدول بيانات.</em></div><div class="info-box violet" style="margin-bottom:8px"><strong>2. أتمتة العمليات</strong><br>ربط خطوات متعددة في سير عمل موحد.<br><em>أمثلة: تدفق تهيئة الموارد البشرية، خط معالجة الطلبات.</em></div><div class="info-box amber"><strong>3. الأتمتة الذكية</strong><br>تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التنبؤ والتصنيف والتوصية.<br><em>أمثلة: تصنيف وتوجيه التذاكر، تلخيص النصوص، اكتشاف الشذوذ.</em></div></div>',
            },
            {
                'id': 'm1-s6', 'title_en': 'Task Automation Deep Dive', 'title_ar': 'أتمتة المهام بالتفصيل', 'type': 'content', 'image_key': 'task-automation',
                'content_en': '<div class="info-box emerald"><strong>Task Automation</strong> automates a single, isolated action — the simplest form of automation.</div><div class="info-box cyan" style="margin-top:12px"><strong>Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Single action, not connected to other steps</li><li>Rule-based: follows simple if/then logic</li><li>Quick to set up and easy to maintain</li><li>Great starting point for automation beginners</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Send appointment confirmation email</li><li>Create calendar event when booking is made</li><li>Auto-save patient intake form data to spreadsheet</li><li>Send reminder SMS 24 hours before appointment</li></ul></div>',
                'content_ar': '<div class="info-box emerald"><strong>أتمتة المهام</strong> تؤتمت إجراءً واحداً منفصلاً — أبسط أشكال الأتمتة.</div><div class="info-box cyan" style="margin-top:12px"><strong>الخصائص:</strong><ul style="margin:8px 0 0 16px"><li>إجراء واحد، غير مرتبط بخطوات أخرى</li><li>قائم على القواعد: يتبع منطق إذا/ثم بسيط</li><li>سريع الإعداد وسهل الصيانة</li><li>نقطة بداية رائعة لمبتدئي الأتمتة</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>إرسال بريد تأكيد الموعد</li><li>إنشاء حدث تقويم عند الحجز</li><li>حفظ بيانات نموذج استقبال المريض تلقائياً في جدول بيانات</li><li>إرسال رسالة تذكير قبل الموعد بـ 24 ساعة</li></ul></div>',
            },
            {
                'id': 'm1-s7', 'title_en': 'Process Automation Deep Dive', 'title_ar': 'أتمتة العمليات بالتفصيل', 'type': 'content', 'image_key': 'process-automation',
                'content_en': '<div class="info-box violet"><strong>Process Automation</strong> connects multiple automated steps into a unified workflow.</div><div class="info-box cyan" style="margin-top:12px"><strong>Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Multiple connected steps in sequence</li><li>May include conditions and branching</li><li>Data flows from one step to the next</li><li>Reduces handoffs between systems and people</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example — HR Onboarding:</strong><ol style="margin:8px 0 0 16px"><li>New employee fills out form -> System creates account</li><li>IT receives notification -> Provisions access</li><li>HR sends welcome packet -> Calendar is updated</li><li>Training modules are assigned -> Progress tracking begins</li></ol></div>',
                'content_ar': '<div class="info-box violet"><strong>أتمتة العمليات</strong> تربط خطوات آلية متعددة في سير عمل موحد.</div><div class="info-box cyan" style="margin-top:12px"><strong>الخصائص:</strong><ul style="margin:8px 0 0 16px"><li>خطوات متعددة مترابطة بالتتابع</li><li>قد تتضمن شروطاً وتفرعات</li><li>تتدفق البيانات من خطوة إلى التالية</li><li>تقلل التسليمات بين الأنظمة والأشخاص</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>مثال في الرعاية الصحية — تهيئة الموارد البشرية:</strong><ol style="margin:8px 0 0 16px"><li>موظف جديد يملأ النموذج -> النظام ينشئ حساباً</li><li>تقنية المعلومات تستلم إشعاراً -> توفير الوصول</li><li>الموارد البشرية ترسل حزمة ترحيب -> تحديث التقويم</li><li>تعيين وحدات التدريب -> بدء تتبع التقدم</li></ol></div>',
            },
            {
                'id': 'm1-s8', 'title_en': 'Intelligent Automation Deep Dive', 'title_ar': 'الأتمتة الذكية بالتفصيل', 'type': 'content', 'image_key': 'intelligent-automation',
                'content_en': '<div class="info-box amber"><strong>Intelligent Automation</strong> combines automation with AI capabilities like understanding, predicting, classifying, and recommending.</div><div class="info-box cyan" style="margin-top:12px"><strong>AI Capabilities Added:</strong><ul style="margin:8px 0 0 16px"><li><strong>Understanding:</strong> Reads and interprets unstructured text, images, voice</li><li><strong>Predicting:</strong> Forecasts outcomes based on patterns in data</li><li><strong>Classifying:</strong> Categorizes items (e.g., urgent vs routine)</li><li><strong>Recommending:</strong> Suggests next best actions</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Classify and route patient support tickets using AI</li><li>Summarize clinical notes automatically</li><li>Detect anomalies in lab results</li><li>Predict no-show risk for appointments</li></ul></div>',
                'content_ar': '<div class="info-box amber"><strong>الأتمتة الذكية</strong> تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل الفهم والتنبؤ والتصنيف والتوصية.</div><div class="info-box cyan" style="margin-top:12px"><strong>قدرات الذكاء الاصطناعي المضافة:</strong><ul style="margin:8px 0 0 16px"><li><strong>الفهم:</strong> يقرأ ويفسر النصوص والصور والصوت غير المنظمة</li><li><strong>التنبؤ:</strong> يتوقع النتائج بناءً على أنماط البيانات</li><li><strong>التصنيف:</strong> يصنف العناصر (مثل عاجل مقابل روتيني)</li><li><strong>التوصية:</strong> يقترح أفضل الإجراءات التالية</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>تصنيف وتوجيه تذاكر دعم المرضى باستخدام الذكاء الاصطناعي</li><li>تلخيص الملاحظات السريرية تلقائياً</li><li>اكتشاف الشذوذ في نتائج المختبر</li><li>التنبؤ بمخاطر عدم حضور المواعيد</li></ul></div>',
            },
            {
                'id': 'm1-s9', 'title_en': 'Module 1 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الأولى والنقاط الرئيسية', 'type': 'summary',
                'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Automation</strong> = Using technology to perform tasks with minimal human intervention</li><li><strong>Traditional Automation</strong> follows fixed rules; <strong>AI Automation</strong> adapts and learns</li><li><strong>Task Automation:</strong> Single actions (send email, save data)</li><li><strong>Process Automation:</strong> Multi-step workflows (onboarding, order processing)</li><li><strong>Intelligent Automation:</strong> AI-enhanced (classify, predict, summarize)</li></ul></div>',
                'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>الأتمتة</strong> = استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري</li><li><strong>الأتمتة التقليدية</strong> تتبع قواعد ثابتة؛ <strong>أتمتة الذكاء الاصطناعي</strong> تتكيف وتتعلم</li><li><strong>أتمتة المهام:</strong> إجراءات منفردة</li><li><strong>أتمتة العمليات:</strong> سير عمل متعدد الخطوات</li><li><strong>الأتمتة الذكية:</strong> معززة بالذكاء الاصطناعي</li></ul></div>',
            },
        ],
    },
    # ── MODULE 2: Workflow Thinking (9 slides) ──
    {
        'number': 2, 'title_en': 'Workflow Thinking', 'title_ar': 'التفكير في سير العمل',
        'slides': [
            {'id': 'm2-s1', 'title_en': 'Introduction to Workflow Thinking', 'title_ar': 'مقدمة في التفكير بسير العمل', 'type': 'intro', 'image_key': 'module_2', 'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Understand workflow structure and components</li><li>Identify triggers, actions, conditions, and outputs</li><li>Map a process into a structured workflow</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#WorkflowThinking</span><span class="chip">#TriggersAndActions</span><span class="chip">#Conditions</span><span class="chip">#ProcessMapping</span></div>', 'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>فهم هيكل ومكونات سير العمل</li><li>تحديد المحفزات والإجراءات والشروط والمخرجات</li><li>تخطيط عملية في سير عمل منظم</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#التفكير_بسير_العمل</span><span class="chip">#المحفزات_والإجراءات</span><span class="chip">#الشروط</span><span class="chip">#تخطيط_العمليات</span></div>'},
            {'id': 'm2-s2', 'title_en': 'What is a Workflow?', 'title_ar': 'ما هو سير العمل؟', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>A Workflow</strong> is a structured sequence of steps that defines how a task or process is executed from start to finish.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Has a clear starting point (trigger)</li><li>Follows a defined sequence of steps</li><li>May include decision points (conditions)</li><li>Produces a clear output or result</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> Patient appointment booking — from request to confirmation.</div>', 'content_ar': '<div class="info-box cyan"><strong>سير العمل</strong> هو تسلسل منظم من الخطوات يحدد كيفية تنفيذ مهمة أو عملية من البداية إلى النهاية.</div><div class="info-box violet" style="margin-top:12px"><strong>الخصائص الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li>له نقطة بداية واضحة (محفز)</li><li>يتبع تسلسل خطوات محدد</li><li>قد يتضمن نقاط اتخاذ قرار (شروط)</li><li>ينتج مخرجات أو نتائج واضحة</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>مثال في الرعاية الصحية:</strong> حجز موعد المريض — من الطلب إلى التأكيد.</div>'},
            {'id': 'm2-s3', 'title_en': 'Triggers', 'title_ar': 'المحفزات', 'type': 'content', 'content_en': '<div class="info-box emerald"><strong>Trigger:</strong> The event or condition that starts a workflow automatically.</div><div class="info-box cyan" style="margin-top:12px"><strong>Types of Triggers:</strong><ul style="margin:8px 0 0 16px"><li><strong>Event-based:</strong> A form is submitted, email received, file uploaded</li><li><strong>Schedule-based:</strong> Run every day at 9 AM, weekly on Monday</li><li><strong>Condition-based:</strong> When inventory drops below threshold</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Patient submits appointment request online</li><li>New lab result is uploaded to the system</li><li>Daily shift change at 7:00 AM</li></ul></div>', 'content_ar': '<div class="info-box emerald"><strong>المحفز:</strong> الحدث أو الشرط الذي يبدأ سير العمل تلقائياً.</div><div class="info-box cyan" style="margin-top:12px"><strong>أنواع المحفزات:</strong><ul style="margin:8px 0 0 16px"><li><strong>قائمة على الأحداث:</strong> تقديم نموذج، استلام بريد إلكتروني، رفع ملف</li><li><strong>قائمة على الجدول:</strong> التشغيل يومياً في الساعة 9 صباحاً، أسبوعياً يوم الاثنين</li><li><strong>قائمة على الشروط:</strong> عندما ينخفض المخزون تحت الحد المطلوب</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>المريض يقدم طلب موعد عبر الإنترنت</li><li>رفع نتيجة مختبر جديدة إلى النظام</li><li>تغيير النوبة اليومي في الساعة 7:00 صباحاً</li></ul></div>'},
            {'id': 'm2-s4', 'title_en': 'Actions', 'title_ar': 'الإجراءات', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Action:</strong> The task performed by the system within a workflow.</div><div class="info-box cyan" style="margin-top:12px"><strong>Common Action Types:</strong><ul style="margin:8px 0 0 16px"><li><strong>Send notification:</strong> Email, SMS, push alert</li><li><strong>Update record:</strong> Database, spreadsheet, CRM</li><li><strong>Create item:</strong> Calendar event, task, document</li><li><strong>Transfer data:</strong> Move information between systems</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Examples:</strong> Send confirmation to patient, update appointment calendar, create patient record.</div>', 'content_ar': '<div class="info-box violet"><strong>الإجراء:</strong> المهمة التي ينفذها النظام ضمن سير العمل.</div><div class="info-box cyan" style="margin-top:12px"><strong>أنواع الإجراءات الشائعة:</strong><ul style="margin:8px 0 0 16px"><li><strong>إرسال إشعار:</strong> بريد إلكتروني، رسالة نصية، تنبيه</li><li><strong>تحديث سجل:</strong> قاعدة بيانات، جدول بيانات، نظام إدارة العلاقات</li><li><strong>إنشاء عنصر:</strong> حدث تقويم، مهمة، مستند</li><li><strong>نقل بيانات:</strong> نقل المعلومات بين الأنظمة</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong> إرسال تأكيد للمريض، تحديث تقويم المواعيد، إنشاء سجل المريض.</div>'},
            {'id': 'm2-s5', 'title_en': 'Conditions', 'title_ar': 'الشروط', 'type': 'content', 'content_en': '<div class="info-box amber"><strong>Condition:</strong> A checkpoint that evaluates whether certain criteria are met before the process continues.</div><div class="info-box cyan" style="margin-top:12px"><strong>How Conditions Work:</strong><ul style="margin:8px 0 0 16px"><li>Evaluate a yes/no or true/false question</li><li>Route the workflow along different paths</li><li>Enable branching logic</li><li>Handle exceptions and special cases</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Healthcare Example:</strong> Is the preferred appointment slot available? -> <strong>Yes:</strong> Confirm booking -> <strong>No:</strong> Offer alternatives.</div>', 'content_ar': '<div class="info-box amber"><strong>الشرط:</strong> نقطة تحقق تقيّم ما إذا كانت معايير معينة مستوفاة قبل أن تستمر العملية.</div><div class="info-box cyan" style="margin-top:12px"><strong>كيف تعمل الشروط:</strong><ul style="margin:8px 0 0 16px"><li>تقييم سؤال نعم/لا أو صح/خطأ</li><li>توجيه سير العمل عبر مسارات مختلفة</li><li>تمكين المنطق التفرعي</li><li>التعامل مع الاستثناءات والحالات الخاصة</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>مثال في الرعاية الصحية:</strong> هل الموعد المفضل متاح؟ -> <strong>نعم:</strong> تأكيد الحجز -> <strong>لا:</strong> عرض بدائل.</div>'},
            {'id': 'm2-s6', 'title_en': 'Outputs', 'title_ar': 'المخرجات', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Output:</strong> The final result delivered by a workflow to the user or system.</div><div class="info-box violet" style="margin-top:12px"><strong>Common Output Types:</strong><ul style="margin:8px 0 0 16px"><li><strong>Notification:</strong> Confirmation email, SMS alert</li><li><strong>Document:</strong> Generated report, summary</li><li><strong>Record update:</strong> Database entry, status change</li><li><strong>Dashboard update:</strong> Real-time metrics, status board</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> Appointment confirmation notification sent to the patient with date, time, and location details.</div>', 'content_ar': '<div class="info-box cyan"><strong>المخرج:</strong> النتيجة النهائية التي يقدمها سير العمل للمستخدم أو النظام.</div><div class="info-box violet" style="margin-top:12px"><strong>أنواع المخرجات الشائعة:</strong><ul style="margin:8px 0 0 16px"><li><strong>إشعار:</strong> بريد تأكيد، تنبيه رسالة نصية</li><li><strong>مستند:</strong> تقرير مُنشأ، ملخص</li><li><strong>تحديث سجل:</strong> إدخال قاعدة بيانات، تغيير حالة</li><li><strong>تحديث لوحة المعلومات:</strong> مقاييس آنية، لوحة حالة</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>مثال في الرعاية الصحية:</strong> إشعار تأكيد الموعد يُرسل للمريض مع تفاصيل التاريخ والوقت والموقع.</div>'},
            {'id': 'm2-s7', 'title_en': 'Building Blocks Together', 'title_ar': 'مكونات البناء معاً', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>The Complete Workflow Structure:</strong></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center"><div class="info-box emerald" style="flex:1;min-width:120px;text-align:center"><strong>Trigger</strong><br>Event starts workflow</div><span style="font-size:20px">&#8594;</span><div class="info-box amber" style="flex:1;min-width:120px;text-align:center"><strong>Condition</strong><br>Criteria check</div><span style="font-size:20px">&#8594;</span><div class="info-box violet" style="flex:1;min-width:120px;text-align:center"><strong>Action</strong><br>Task performed</div><span style="font-size:20px">&#8594;</span><div class="info-box cyan" style="flex:1;min-width:120px;text-align:center"><strong>Output</strong><br>Result delivered</div></div><div class="info-box slate" style="margin-top:12px"><strong>Patient Appointment Example:</strong><br>Patient submits request (Trigger) -> Check slot availability (Condition) -> Send confirmation or alternatives (Action) -> Patient receives notification (Output)</div>', 'content_ar': '<div class="info-box cyan"><strong>هيكل سير العمل الكامل:</strong></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center"><div class="info-box emerald" style="flex:1;min-width:120px;text-align:center"><strong>المحفز</strong><br>حدث يبدأ سير العمل</div><span style="font-size:20px">&#8592;</span><div class="info-box amber" style="flex:1;min-width:120px;text-align:center"><strong>الشرط</strong><br>فحص المعايير</div><span style="font-size:20px">&#8592;</span><div class="info-box violet" style="flex:1;min-width:120px;text-align:center"><strong>الإجراء</strong><br>تنفيذ المهمة</div><span style="font-size:20px">&#8592;</span><div class="info-box cyan" style="flex:1;min-width:120px;text-align:center"><strong>المخرج</strong><br>تسليم النتيجة</div></div><div class="info-box slate" style="margin-top:12px"><strong>مثال موعد المريض:</strong><br>المريض يقدم طلباً (المحفز) -> التحقق من توفر الموعد (الشرط) -> إرسال تأكيد أو بدائل (الإجراء) -> المريض يتلقى الإشعار (المخرج)</div>'},
            {'id': 'm2-s8', 'title_en': 'Process Mapping', 'title_ar': 'رسم خرائط العمليات', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Process Mapping</strong> is the practice of visually documenting and analyzing the steps in a process.</div><div class="info-box cyan" style="margin-top:12px"><strong>Why Map Processes?</strong><ul style="margin:8px 0 0 16px"><li>Identify bottlenecks and inefficiencies</li><li>Find automation opportunities</li><li>Understand handoffs between people/systems</li><li>Document current state before improving</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Steps to Map a Process:</strong><ol style="margin:8px 0 0 16px"><li>Identify the start and end points</li><li>List all steps in between</li><li>Mark decision points (conditions)</li><li>Identify who/what performs each step</li><li>Highlight areas for automation</li></ol></div>', 'content_ar': '<div class="info-box violet"><strong>رسم خرائط العمليات</strong> هي ممارسة التوثيق المرئي وتحليل خطوات العملية.</div><div class="info-box cyan" style="margin-top:12px"><strong>لماذا نرسم خرائط العمليات؟</strong><ul style="margin:8px 0 0 16px"><li>تحديد الاختناقات وأوجه القصور</li><li>إيجاد فرص الأتمتة</li><li>فهم التسليمات بين الأشخاص/الأنظمة</li><li>توثيق الحالة الحالية قبل التحسين</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>خطوات رسم خريطة العملية:</strong><ol style="margin:8px 0 0 16px"><li>تحديد نقاط البداية والنهاية</li><li>سرد جميع الخطوات بينهما</li><li>وضع علامات على نقاط القرار (الشروط)</li><li>تحديد من/ما ينفذ كل خطوة</li><li>تسليط الضوء على مجالات الأتمتة</li></ol></div>'},
            {'id': 'm2-s9', 'title_en': 'Module 2 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الثانية', 'type': 'summary', 'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Workflows</strong> are structured sequences of steps (Trigger -> Condition -> Action -> Output)</li><li><strong>Triggers</strong> start workflows (events, schedules, conditions)</li><li><strong>Actions</strong> are tasks performed by the system</li><li><strong>Conditions</strong> check criteria before proceeding</li><li><strong>Outputs</strong> deliver results to users</li><li><strong>Process Mapping</strong> helps identify automation opportunities</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>سير العمل</strong> هي تسلسلات منظمة (المحفز -> الشرط -> الإجراء -> المخرج)</li><li><strong>المحفزات</strong> تبدأ سير العمل</li><li><strong>الإجراءات</strong> هي المهام التي ينفذها النظام</li><li><strong>الشروط</strong> تتحقق من المعايير</li><li><strong>المخرجات</strong> تقدم النتائج</li></ul></div>'},
        ],
    },
    # ── MODULE 3: AI Agents (12 slides) ──
    {
        'number': 3, 'title_en': 'AI Agents', 'title_ar': 'وكلاء الذكاء الاصطناعي',
        'slides': [
            {'id': 'm3-s1', 'title_en': 'Introduction to AI Agents', 'title_ar': 'مقدمة في وكلاء الذكاء الاصطناعي', 'type': 'intro', 'image_key': 'module_3', 'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Define what AI agents are</li><li>Explain how AI agents differ from standard automation</li><li>Identify where AI agents add value in workflows</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#AIAgents</span><span class="chip">#AgentCapabilities</span><span class="chip">#DecisionSupport</span><span class="chip">#IntelligentWorkflows</span></div>', 'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تعريف ماهية وكلاء الذكاء الاصطناعي</li><li>شرح كيف يختلفون عن الأتمتة العادية</li><li>تحديد أين يضيفون قيمة في سير العمل</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#وكلاء_الذكاء_الاصطناعي</span><span class="chip">#قدرات_الوكلاء</span><span class="chip">#دعم_القرار</span><span class="chip">#سير_العمل_الذكي</span></div>'},
            {'id': 'm3-s2', 'title_en': 'What is an AI Agent?', 'title_ar': 'ما هو وكيل الذكاء الاصطناعي؟', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>An AI Agent</strong> is a system that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li><strong>Autonomous:</strong> Can act without step-by-step human guidance</li><li><strong>Goal-oriented:</strong> Works toward defined objectives</li><li><strong>Context-aware:</strong> Understands situation and adapts</li><li><strong>Intelligent:</strong> Uses AI to reason and decide</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>وكيل الذكاء الاصطناعي</strong> هو نظام يمكنه فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل.</div><div class="info-box violet" style="margin-top:12px"><strong>الخصائص الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>مستقل:</strong> يمكنه العمل بدون توجيه بشري خطوة بخطوة</li><li><strong>موجه نحو الهدف:</strong> يعمل نحو أهداف محددة</li><li><strong>واعٍ للسياق:</strong> يفهم الموقف ويتكيف</li><li><strong>ذكي:</strong> يستخدم الذكاء الاصطناعي للتفكير واتخاذ القرارات</li></ul></div>'},
            {'id': 'm3-s3', 'title_en': 'AI Agents vs Standard Automation', 'title_ar': 'وكلاء الذكاء الاصطناعي مقابل الأتمتة العادية', 'type': 'content', 'content_en': '<div class="grid-2"><div class="info-box violet"><strong>Standard Automation</strong><ul style="margin:8px 0 0 16px"><li>Follows fixed, predefined steps</li><li>Cannot handle exceptions</li><li>Same output every time</li><li>No learning or adaptation</li></ul></div><div class="info-box emerald"><strong>AI Agents</strong><ul style="margin:8px 0 0 16px"><li>Can interpret and decide</li><li>Handles ambiguity and exceptions</li><li>Adapts based on context</li><li>Learns and improves</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>Key Insight:</strong> AI agents bring human-like reasoning to automated workflows, handling complexity that rule-based systems cannot.</div>', 'content_ar': '<div class="grid-2"><div class="info-box violet"><strong>الأتمتة العادية</strong><ul style="margin:8px 0 0 16px"><li>تتبع خطوات ثابتة محددة مسبقاً</li><li>لا تستطيع التعامل مع الاستثناءات</li><li>نفس المخرج في كل مرة</li><li>لا تعلم أو تكيف</li></ul></div><div class="info-box emerald"><strong>وكلاء الذكاء الاصطناعي</strong><ul style="margin:8px 0 0 16px"><li>يمكنهم التفسير واتخاذ القرارات</li><li>يتعاملون مع الغموض والاستثناءات</li><li>يتكيفون بناءً على السياق</li><li>يتعلمون ويتحسنون</li></ul></div></div><div class="info-box amber" style="margin-top:12px"><strong>الفكرة الرئيسية:</strong> يجلب وكلاء الذكاء الاصطناعي التفكير الشبيه بالبشري إلى سير العمل الآلي، ويتعاملون مع التعقيدات التي لا تستطيع الأنظمة القائمة على القواعد التعامل معها.</div>'},
            {'id': 'm3-s4', 'title_en': 'Natural Language Understanding', 'title_ar': 'فهم اللغة الطبيعية', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Natural Language Understanding (NLU)</strong> allows AI agents to read, interpret, and derive meaning from human language.</div><div class="info-box violet" style="margin-top:12px"><strong>What NLU Enables:</strong><ul style="margin:8px 0 0 16px"><li>Reading and understanding patient messages</li><li>Extracting key information from free-text notes</li><li>Classifying intent (complaint, question, request)</li><li>Processing multilingual communications</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> An AI agent reads a patient message like "I have been having chest pain since yesterday and I am worried" and extracts: symptom (chest pain), duration (since yesterday), urgency level (high).</div>', 'content_ar': '<div class="info-box cyan"><strong>فهم اللغة الطبيعية (NLU)</strong> يسمح لوكلاء الذكاء الاصطناعي بقراءة وتفسير واستخلاص المعنى من اللغة البشرية.</div><div class="info-box violet" style="margin-top:12px"><strong>ما يتيحه فهم اللغة الطبيعية:</strong><ul style="margin:8px 0 0 16px"><li>قراءة وفهم رسائل المرضى</li><li>استخراج المعلومات الرئيسية من الملاحظات النصية الحرة</li><li>تصنيف النية (شكوى، سؤال، طلب)</li><li>معالجة الاتصالات متعددة اللغات</li></ul></div><div class="info-box amber" style="margin-top:12px"><strong>مثال في الرعاية الصحية:</strong> وكيل ذكاء اصطناعي يقرأ رسالة مريض مثل "أعاني من ألم في الصدر منذ الأمس" ويستخرج: العرض (ألم الصدر)، المدة (منذ الأمس)، مستوى الإلحاح (مرتفع).</div>'},
            {'id': 'm3-s5', 'title_en': 'Goal-Oriented Behavior', 'title_ar': 'السلوك الموجه نحو الهدف', 'type': 'content', 'content_en': '<div class="info-box emerald"><strong>Goal-Oriented Behavior</strong> means AI agents work toward defined objectives rather than just following fixed rules.</div><div class="info-box cyan" style="margin-top:12px"><strong>How It Works:</strong><ul style="margin:8px 0 0 16px"><li>Agent receives a goal (e.g., "Schedule patient follow-up")</li><li>Evaluates current situation and available options</li><li>Chooses the best path to achieve the goal</li><li>Adapts if the initial approach does not work</li></ul></div>', 'content_ar': '<div class="info-box emerald"><strong>السلوك الموجه نحو الهدف</strong> يعني أن وكلاء الذكاء الاصطناعي يعملون نحو أهداف محددة بدلاً من مجرد اتباع قواعد ثابتة.</div><div class="info-box cyan" style="margin-top:12px"><strong>كيف يعمل:</strong><ul style="margin:8px 0 0 16px"><li>الوكيل يستلم هدفاً (مثل: "جدولة متابعة المريض")</li><li>يقيّم الوضع الحالي والخيارات المتاحة</li><li>يختار أفضل مسار لتحقيق الهدف</li><li>يتكيف إذا لم ينجح النهج الأولي</li></ul></div>'},
            {'id': 'm3-s6', 'title_en': 'Decision Making & Adaptive Execution', 'title_ar': 'اتخاذ القرار والتنفيذ التكيفي', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Decision Making:</strong> AI agents can analyze information, weigh options, and choose the best course of action.</div><div class="info-box emerald" style="margin-top:12px"><strong>Adaptive Execution:</strong> AI agents adjust their workflow based on new data and changing conditions.</div><div class="info-box amber" style="margin-top:12px"><strong>Healthcare Example:</strong> An AI agent triaging patient messages can:<ul style="margin:8px 0 0 16px"><li>Prioritize based on urgency keywords</li><li>Route urgent cases directly to on-call physician</li><li>Route routine questions to scheduling system</li><li>Escalate ambiguous cases for human review</li></ul></div>', 'content_ar': '<div class="info-box violet"><strong>اتخاذ القرار:</strong> يمكن لوكلاء الذكاء الاصطناعي تحليل المعلومات وموازنة الخيارات واختيار أفضل مسار عمل.</div><div class="info-box emerald" style="margin-top:12px"><strong>التنفيذ التكيفي:</strong> يعدل وكلاء الذكاء الاصطناعي سير عملهم بناءً على بيانات وظروف جديدة.</div><div class="info-box amber" style="margin-top:12px"><strong>مثال في الرعاية الصحية:</strong> وكيل ذكاء اصطناعي يفرز رسائل المرضى يمكنه:<ul style="margin:8px 0 0 16px"><li>تحديد الأولوية بناءً على كلمات الإلحاح</li><li>توجيه الحالات العاجلة مباشرة للطبيب المناوب</li><li>توجيه الأسئلة الروتينية لنظام الجدولة</li><li>تصعيد الحالات الغامضة للمراجعة البشرية</li></ul></div>'},
            {'id': 'm3-s7', 'title_en': 'Multi-Step Reasoning', 'title_ar': 'الاستدلال متعدد الخطوات', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Multi-Step Reasoning</strong> allows AI agents to break complex tasks into sub-tasks, execute them sequentially, and adjust based on intermediate results.</div><div class="info-box violet" style="margin-top:12px"><strong>How It Works:</strong><ol style="margin:8px 0 0 16px"><li>Receive complex request</li><li>Break it into smaller sub-tasks</li><li>Execute each sub-task in order</li><li>Check results at each step</li><li>Adjust next steps based on what happened</li></ol></div>', 'content_ar': '<div class="info-box cyan"><strong>الاستدلال متعدد الخطوات</strong> يسمح لوكلاء الذكاء الاصطناعي بتقسيم المهام المعقدة إلى مهام فرعية وتنفيذها بالتتابع.</div><div class="info-box violet" style="margin-top:12px"><strong>كيف يعمل:</strong><ol style="margin:8px 0 0 16px"><li>استلام طلب معقد</li><li>تقسيمه إلى مهام فرعية أصغر</li><li>تنفيذ كل مهمة فرعية بالترتيب</li><li>فحص النتائج في كل خطوة</li><li>تعديل الخطوات التالية بناءً على النتائج</li></ol></div>'},
            {'id': 'm3-s8', 'title_en': 'Context Awareness', 'title_ar': 'الوعي بالسياق', 'type': 'content', 'content_en': '<div class="info-box emerald"><strong>Context Awareness</strong> means AI agents can remember previous interactions and use that information to make better decisions.</div><div class="info-box cyan" style="margin-top:12px"><strong>Types of Context:</strong><ul style="margin:8px 0 0 16px"><li><strong>Conversation history:</strong> Remembers what was discussed before</li><li><strong>Patient history:</strong> Knows previous diagnoses, medications, allergies</li><li><strong>System state:</strong> Aware of current workloads, schedules, availability</li><li><strong>Environmental context:</strong> Time of day, department policies, seasonal patterns</li></ul></div>', 'content_ar': '<div class="info-box emerald"><strong>الوعي بالسياق</strong> يعني أن وكلاء الذكاء الاصطناعي يمكنهم تذكر التفاعلات السابقة واستخدام تلك المعلومات لاتخاذ قرارات أفضل.</div><div class="info-box cyan" style="margin-top:12px"><strong>أنواع السياق:</strong><ul style="margin:8px 0 0 16px"><li><strong>تاريخ المحادثة:</strong> يتذكر ما تمت مناقشته سابقاً</li><li><strong>تاريخ المريض:</strong> يعرف التشخيصات والأدوية والحساسيات السابقة</li><li><strong>حالة النظام:</strong> واعٍ بأحمال العمل والجداول والتوفر الحالية</li><li><strong>السياق البيئي:</strong> الوقت، سياسات القسم، الأنماط الموسمية</li></ul></div>'},
            {'id': 'm3-s9', 'title_en': 'Tool Use & Integration', 'title_ar': 'استخدام الأدوات والتكامل', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Tool Use</strong> means AI agents can interact with external tools, APIs, and systems to complete tasks.</div><div class="info-box cyan" style="margin-top:12px"><strong>Common Agent Tools:</strong><ul style="margin:8px 0 0 16px"><li><strong>APIs:</strong> Connect to databases, calendars, email systems</li><li><strong>Search:</strong> Look up information in knowledge bases</li><li><strong>Communication:</strong> Send emails, SMS, notifications</li><li><strong>Calculation:</strong> Process data, generate reports</li></ul></div>', 'content_ar': '<div class="info-box violet"><strong>استخدام الأدوات</strong> يعني أن وكلاء الذكاء الاصطناعي يمكنهم التفاعل مع الأدوات الخارجية وواجهات برمجة التطبيقات.</div><div class="info-box cyan" style="margin-top:12px"><strong>أدوات الوكيل الشائعة:</strong><ul style="margin:8px 0 0 16px"><li><strong>واجهات API:</strong> الاتصال بقواعد البيانات والتقويمات وأنظمة البريد</li><li><strong>البحث:</strong> البحث عن المعلومات في قواعد المعرفة</li><li><strong>الاتصال:</strong> إرسال رسائل إلكترونية ورسائل نصية وإشعارات</li><li><strong>الحساب:</strong> معالجة البيانات وإنشاء التقارير</li></ul></div>'},
            {'id': 'm3-s10', 'title_en': 'Decision Support in Healthcare', 'title_ar': 'دعم القرار في الرعاية الصحية', 'type': 'content', 'content_en': '<div class="info-box amber"><strong>Decision Support:</strong> AI agents analyze data, identify patterns, and recommend actions to support human decision-making.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Applications:</strong><ul style="margin:8px 0 0 16px"><li>Flagging abnormal lab results for physician review</li><li>Suggesting treatment options based on clinical guidelines</li><li>Prioritizing patient cases by urgency</li><li>Identifying drug interaction risks</li><li>Recommending follow-up schedules based on patient history</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>Important:</strong> AI agents support decisions — they do not replace clinical judgment.</div>', 'content_ar': '<div class="info-box amber"><strong>دعم القرار:</strong> يقوم وكلاء الذكاء الاصطناعي بتحليل البيانات وتحديد الأنماط والتوصية بالإجراءات لدعم اتخاذ القرارات البشرية.</div><div class="info-box cyan" style="margin-top:12px"><strong>تطبيقات الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>تمييز نتائج المختبر غير الطبيعية لمراجعة الطبيب</li><li>اقتراح خيارات العلاج بناءً على الإرشادات السريرية</li><li>تحديد أولويات حالات المرضى حسب الإلحاح</li><li>تحديد مخاطر التفاعلات الدوائية</li><li>التوصية بجداول المتابعة بناءً على تاريخ المريض</li></ul></div><div class="info-box emerald" style="margin-top:12px"><strong>مهم:</strong> وكلاء الذكاء الاصطناعي يدعمون القرارات — لكنهم لا يحلون محل الحكم السريري.</div>'},
            {'id': 'm3-s11', 'title_en': 'Where AI Agents Add Value', 'title_ar': 'أين يضيف وكلاء الذكاء الاصطناعي قيمة', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>AI agents add the most value where workflows involve:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Complex Decisions</strong><br>Multiple factors to consider, no single right answer</div><div class="info-box violet"><strong>Unstructured Data</strong><br>Free text, images, voice that need interpretation</div><div class="info-box amber"><strong>Dynamic Conditions</strong><br>Situations that change and require adaptation</div><div class="info-box slate"><strong>Human Collaboration</strong><br>Supporting (not replacing) human expertise</div></div>', 'content_ar': '<div class="info-box cyan"><strong>يضيف وكلاء الذكاء الاصطناعي أكبر قيمة عندما يتضمن سير العمل:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>قرارات معقدة</strong><br>عوامل متعددة للنظر فيها، لا توجد إجابة صحيحة واحدة</div><div class="info-box violet"><strong>بيانات غير منظمة</strong><br>نصوص حرة وصور وصوت تحتاج إلى تفسير</div><div class="info-box amber"><strong>ظروف ديناميكية</strong><br>مواقف تتغير وتتطلب التكيف</div><div class="info-box slate"><strong>التعاون البشري</strong><br>دعم (وليس استبدال) الخبرة البشرية</div></div>'},
            {'id': 'm3-s12', 'title_en': 'Module 3 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الثالثة', 'type': 'summary', 'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>AI Agents</strong> understand goals, interpret context, and take autonomous actions</li><li>They differ from standard automation by being adaptive and intelligent</li><li>Key capabilities: NLU, goal-oriented behavior, multi-step reasoning, context awareness, tool use</li><li>In healthcare: decision support, triage, referral processing, patient communication</li><li>AI agents support human decisions — they do not replace clinical judgment</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>وكلاء الذكاء الاصطناعي</strong> يفهمون الأهداف ويفسرون السياق ويتخذون إجراءات مستقلة</li><li>يختلفون عن الأتمتة العادية بكونهم تكيفيين وذكيين</li><li>القدرات الرئيسية: فهم اللغة الطبيعية، السلوك الموجه نحو الهدف، الاستدلال متعدد الخطوات، الوعي بالسياق، استخدام الأدوات</li><li>في الرعاية الصحية: دعم القرار، الفرز، معالجة الإحالات، التواصل مع المرضى</li><li>وكلاء الذكاء الاصطناعي يدعمون القرارات البشرية — لا يحلون محل الحكم السريري</li></ul></div>'},
        ],
    },
    # ── MODULE 4: Vibe Coding (9 slides) ──
    {
        'number': 4, 'title_en': 'Vibe Coding', 'title_ar': 'البرمجة بالوصف',
        'slides': [
            {'id': 'm4-s1', 'title_en': 'Introduction to Vibe Coding', 'title_ar': 'مقدمة في البرمجة بالوصف', 'type': 'intro', 'image_key': 'module_4', 'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Understand what vibe coding is</li><li>Explain prompt-driven development workflow</li><li>Recognize benefits of rapid prototyping with AI</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#VibeCoding</span><span class="chip">#PromptDrivenDevelopment</span><span class="chip">#RapidPrototyping</span></div>', 'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>فهم ماهية البرمجة بالوصف</li><li>شرح سير عمل التطوير القائم على الأوامر</li><li>إدراك فوائد النمذجة السريعة</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#البرمجة_بالوصف</span><span class="chip">#التطوير_بالأوامر</span><span class="chip">#النمذجة_السريعة</span></div>'},
            {'id': 'm4-s2', 'title_en': 'What is Vibe Coding?', 'title_ar': 'ما هي البرمجة بالوصف؟', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Vibe Coding</strong> is creating digital solutions by describing what you want in natural language, then letting AI generate the code. No traditional programming required.</div><div class="info-box violet" style="margin-top:12px"><strong>Key Characteristics:</strong><ul style="margin:8px 0 0 16px"><li>Natural language as the primary input</li><li>AI generates the code and application</li><li>Iterative refinement through conversation</li><li>Accessible to non-programmers</li><li>Rapid prototyping capability</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>البرمجة بالوصف</strong> هي إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود. لا تتطلب برمجة تقليدية.</div><div class="info-box violet" style="margin-top:12px"><strong>الخصائص الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li>اللغة الطبيعية كمدخل أساسي</li><li>الذكاء الاصطناعي يولد الكود والتطبيق</li><li>تحسين تكراري عبر المحادثة</li><li>متاح لغير المبرمجين</li><li>قدرة النمذجة السريعة</li></ul></div>'},
            {'id': 'm4-s3', 'title_en': 'Describe, Generate, Refine', 'title_ar': 'صف، ولّد، حسّن', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>The Core Loop of Vibe Coding:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. Describe</strong><br>Write a clear natural language description of what you want to build.</div><div class="info-box violet" style="margin-bottom:8px"><strong>2. Generate</strong><br>AI reads your prompt and generates the initial code/application.</div><div class="info-box amber"><strong>3. Refine</strong><br>Review the output, provide follow-up prompts to adjust, enhance, or fix the result.</div></div>', 'content_ar': '<div class="info-box cyan"><strong>الحلقة الأساسية للبرمجة بالوصف:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>1. صف</strong><br>اكتب وصفاً واضحاً بلغة طبيعية لما تريد بناءه.</div><div class="info-box violet" style="margin-bottom:8px"><strong>2. ولّد</strong><br>يقرأ الذكاء الاصطناعي أمرك ويولد الكود/التطبيق الأولي.</div><div class="info-box amber"><strong>3. حسّن</strong><br>راجع المخرج وقدم أوامر متابعة لتحسين النتيجة.</div></div>'},
            {'id': 'm4-s4', 'title_en': 'Prompt-Driven Development', 'title_ar': 'التطوير القائم على الأوامر', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Prompt-Driven Development</strong> means writing natural language instructions (prompts) to guide AI in building applications.</div><div class="info-box cyan" style="margin-top:12px"><strong>Tips for Effective Prompts:</strong><ul style="margin:8px 0 0 16px"><li><strong>Be specific:</strong> "Create a form with name, age, and email fields"</li><li><strong>Describe behavior:</strong> "When submitted, show a confirmation message"</li><li><strong>Include constraints:</strong> "Mobile-friendly, clean design, blue theme"</li><li><strong>Iterate gradually:</strong> Start simple, then add features one at a time</li></ul></div>', 'content_ar': '<div class="info-box violet"><strong>التطوير القائم على الأوامر</strong> يعني كتابة تعليمات بلغة طبيعية لتوجيه الذكاء الاصطناعي في بناء التطبيقات.</div><div class="info-box cyan" style="margin-top:12px"><strong>نصائح لأوامر فعالة:</strong><ul style="margin:8px 0 0 16px"><li><strong>كن محدداً:</strong> "أنشئ نموذجاً بحقول الاسم والعمر والبريد"</li><li><strong>صف السلوك:</strong> "عند الإرسال، اعرض رسالة تأكيد"</li><li><strong>حدد القيود:</strong> "متوافق مع الهواتف، تصميم نظيف، لون أزرق"</li><li><strong>تقدم تدريجياً:</strong> ابدأ بسيطاً ثم أضف ميزات تدريجياً</li></ul></div>'},
            {'id': 'm4-s5', 'title_en': 'Rapid Prototyping with AI', 'title_ar': 'النمذجة السريعة مع الذكاء الاصطناعي', 'type': 'content', 'content_en': '<div class="info-box emerald"><strong>Rapid Prototyping</strong> means quickly creating working prototypes of ideas using AI tools.</div><div class="info-box cyan" style="margin-top:12px"><strong>Benefits:</strong><ul style="margin:8px 0 0 16px"><li><strong>Speed:</strong> From idea to working prototype in minutes</li><li><strong>Accessibility:</strong> No coding skills required</li><li><strong>Low cost:</strong> Test ideas before investing in full development</li><li><strong>Fast feedback:</strong> Show stakeholders working demos quickly</li><li><strong>Iteration:</strong> Easy to modify and test different approaches</li></ul></div>', 'content_ar': '<div class="info-box emerald"><strong>النمذجة السريعة</strong> تعني إنشاء نماذج أولية عاملة بسرعة باستخدام أدوات الذكاء الاصطناعي.</div><div class="info-box cyan" style="margin-top:12px"><strong>الفوائد:</strong><ul style="margin:8px 0 0 16px"><li><strong>السرعة:</strong> من الفكرة إلى النموذج العامل في دقائق</li><li><strong>الإتاحة:</strong> لا تحتاج مهارات برمجة</li><li><strong>تكلفة منخفضة:</strong> اختبر الأفكار قبل الاستثمار في التطوير الكامل</li><li><strong>ملاحظات سريعة:</strong> اعرض عروضاً توضيحية عاملة بسرعة لأصحاب المصلحة</li><li><strong>التكرار:</strong> سهل التعديل واختبار نهج مختلفة</li></ul></div>'},
            {'id': 'm4-s6', 'title_en': 'Iteration & Refinement', 'title_ar': 'التكرار والتحسين', 'type': 'content', 'content_en': '<div class="info-box amber"><strong>Iteration</strong> is the process of repeatedly refining your prompts and the generated output until the solution meets requirements.</div><div class="info-box cyan" style="margin-top:12px"><strong>The Iteration Process:</strong><ol style="margin:8px 0 0 16px"><li>Review the generated output</li><li>Identify what works and what needs improvement</li><li>Write a specific follow-up prompt addressing the issues</li><li>Review the updated output</li><li>Repeat until satisfied</li></ol></div>', 'content_ar': '<div class="info-box amber"><strong>التكرار</strong> هو عملية تحسين الأوامر والمخرجات المولدة بشكل متكرر حتى يلبي الحل المتطلبات.</div><div class="info-box cyan" style="margin-top:12px"><strong>عملية التكرار:</strong><ol style="margin:8px 0 0 16px"><li>راجع المخرج المولد</li><li>حدد ما يعمل وما يحتاج تحسين</li><li>اكتب أمر متابعة محدد يعالج المشاكل</li><li>راجع المخرج المحدث</li><li>كرر حتى ترضى عن النتيجة</li></ol></div>'},
            {'id': 'm4-s7', 'title_en': 'Vibe Coding Tools Overview', 'title_ar': 'نظرة عامة على أدوات البرمجة بالوصف', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Tools for Vibe Coding:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Lovable</strong><br>Build complete web apps from natural language prompts. Ideal for rapid prototyping without any coding.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Replit</strong><br>Cloud-based development environment with AI assistance. Build, test, and deploy from your browser.</div><div class="info-box amber"><strong>Claude Code</strong><br>AI coding assistant for prompt-driven development. Generates, explains, and refines code through conversation.</div></div>', 'content_ar': '<div class="info-box cyan"><strong>أدوات البرمجة بالوصف:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Lovable</strong><br>بناء تطبيقات ويب كاملة من الأوامر النصية.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Replit</strong><br>بيئة تطوير سحابية مع مساعدة الذكاء الاصطناعي.</div><div class="info-box amber"><strong>Claude Code</strong><br>مساعد برمجة لتطوير قائم على الأوامر.</div></div>'},
            {'id': 'm4-s8', 'title_en': 'Healthcare Applications of Vibe Coding', 'title_ar': 'تطبيقات البرمجة بالوصف في الرعاية الصحية', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Vibe Coding in Healthcare — Practical Examples:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>Patient Tracking App</strong><br>Track diabetic patient glucose readings with alerts for dangerous values.</div><div class="info-box violet"><strong>Clinical Report Generator</strong><br>Enter symptoms, generate clinical summaries with urgency classification.</div><div class="info-box amber"><strong>Medication Adherence Tracker</strong><br>Record and monitor patient medication compliance with missed-dose alerts.</div><div class="info-box slate"><strong>Patient Feedback Form</strong><br>Quick prototype for collecting and analyzing patient satisfaction data.</div></div>', 'content_ar': '<div class="info-box cyan"><strong>البرمجة بالوصف في الرعاية الصحية — أمثلة عملية:</strong></div><div class="grid-2" style="margin-top:12px"><div class="info-box emerald"><strong>تطبيق تتبع المرضى</strong><br>تتبع قراءات الجلوكوز لمرضى السكري مع تنبيهات للقيم الخطرة.</div><div class="info-box violet"><strong>مولد التقارير السريرية</strong><br>إدخال الأعراض، إنشاء ملخصات سريرية مع تصنيف الإلحاح.</div><div class="info-box amber"><strong>متتبع الالتزام بالدواء</strong><br>تسجيل ومراقبة التزام المريض بالأدوية مع تنبيهات للجرعات الفائتة.</div><div class="info-box slate"><strong>نموذج آراء المرضى</strong><br>نموذج سريع لجمع وتحليل بيانات رضا المرضى.</div></div>'},
            {'id': 'm4-s9', 'title_en': 'Module 4 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الرابعة', 'type': 'summary', 'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Vibe Coding:</strong> Create solutions using natural language — no coding required</li><li><strong>Core Loop:</strong> Describe -> Generate -> Refine</li><li><strong>Prompt-Driven Development:</strong> Write clear instructions, AI builds the app</li><li><strong>Rapid Prototyping:</strong> From idea to working prototype in minutes</li><li><strong>Iteration:</strong> Refine until the solution meets requirements</li><li><strong>Tools:</strong> Lovable, Replit, Claude Code</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>البرمجة بالوصف:</strong> إنشاء حلول بلغة طبيعية — لا تحتاج برمجة</li><li><strong>الحلقة الأساسية:</strong> صف -> ولّد -> حسّن</li><li><strong>التطوير بالأوامر:</strong> اكتب تعليمات واضحة، الذكاء الاصطناعي يبني التطبيق</li><li><strong>النمذجة السريعة:</strong> من الفكرة إلى النموذج في دقائق</li><li><strong>التكرار:</strong> حسّن حتى يلبي الحل المتطلبات</li><li><strong>الأدوات:</strong> Lovable، Replit، Claude Code</li></ul></div>'},
        ],
    },
    # ── MODULE 5: Designing AI Automation Solutions (10 slides) ──
    {
        'number': 5, 'title_en': 'Designing AI Automation Solutions & Common Use Cases', 'title_ar': 'تصميم حلول أتمتة الذكاء الاصطناعي وحالات الاستخدام الشائعة',
        'slides': [
            {'id': 'm5-s1', 'title_en': 'Introduction to Designing AI Solutions', 'title_ar': 'مقدمة في تصميم حلول الذكاء الاصطناعي', 'type': 'intro', 'image_key': 'module_5', 'content_en': '<div class="info-box cyan"><strong>What you will learn:</strong><br><ul style="margin:8px 0 0 16px"><li>Identify automation opportunities in workflows</li><li>Design AI automation solutions</li><li>Describe common use cases across categories</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#SolutionDesign</span><span class="chip">#AutomationOpportunities</span><span class="chip">#AIUseCases</span></div>', 'content_ar': '<div class="info-box cyan"><strong>ما ستتعلمه:</strong><br><ul style="margin:8px 0 0 16px"><li>تحديد فرص الأتمتة</li><li>تصميم حلول أتمتة الذكاء الاصطناعي</li><li>وصف حالات الاستخدام الشائعة</li></ul></div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">#تصميم_الحلول</span><span class="chip">#فرص_الأتمتة</span><span class="chip">#حالات_الاستخدام</span></div>'},
            {'id': 'm5-s2', 'title_en': 'Identifying Automation Opportunities', 'title_ar': 'تحديد فرص الأتمتة', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>How to spot automation opportunities:</strong></div><div class="info-box violet" style="margin-top:12px"><strong>Look for tasks that are:</strong><ul style="margin:8px 0 0 16px"><li><strong>Repetitive:</strong> Done the same way many times</li><li><strong>Time-consuming:</strong> Take significant staff time</li><li><strong>Error-prone:</strong> Mistakes happen due to manual handling</li><li><strong>Rule-based:</strong> Follow predictable if/then logic</li><li><strong>Data-heavy:</strong> Involve moving or processing large amounts of data</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>كيفية اكتشاف فرص الأتمتة:</strong></div><div class="info-box violet" style="margin-top:12px"><strong>ابحث عن المهام التي هي:</strong><ul style="margin:8px 0 0 16px"><li><strong>متكررة:</strong> تُنفذ بنفس الطريقة مرات عديدة</li><li><strong>مستهلكة للوقت:</strong> تأخذ وقتاً كبيراً من الموظفين</li><li><strong>عرضة للأخطاء:</strong> أخطاء تحدث بسبب التعامل اليدوي</li><li><strong>قائمة على القواعد:</strong> تتبع منطق إذا/ثم متوقع</li><li><strong>كثيفة البيانات:</strong> تتضمن نقل أو معالجة كميات كبيرة من البيانات</li></ul></div>'},
            {'id': 'm5-s3', 'title_en': 'Solution Design Process', 'title_ar': 'عملية تصميم الحل', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>The 5-Step Solution Design Process:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>Step 1: Identify the Problem</strong><br>What repetitive or time-consuming task needs automation?</div><div class="info-box violet" style="margin-bottom:8px"><strong>Step 2: Map the Current Workflow</strong><br>Document all steps, people, and systems involved.</div><div class="info-box amber" style="margin-bottom:8px"><strong>Step 3: Identify Where AI Adds Value</strong><br>Find steps that benefit from intelligence, adaptation, or NLU.</div><div class="info-box cyan" style="margin-bottom:8px"><strong>Step 4: Design the Automated Workflow</strong><br>Define triggers, conditions, actions, and outputs.</div><div class="info-box slate"><strong>Step 5: Test, Refine, and Deploy</strong><br>Validate, iterate, and roll out the solution.</div></div>', 'content_ar': '<div class="info-box cyan"><strong>عملية تصميم الحل من 5 خطوات:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>الخطوة 1: تحديد المشكلة</strong><br>ما المهمة المتكررة أو المستهلكة للوقت التي تحتاج أتمتة؟</div><div class="info-box violet" style="margin-bottom:8px"><strong>الخطوة 2: رسم خريطة سير العمل الحالي</strong><br>توثيق جميع الخطوات والأشخاص والأنظمة المعنية.</div><div class="info-box amber" style="margin-bottom:8px"><strong>الخطوة 3: تحديد أين يضيف الذكاء الاصطناعي قيمة</strong><br>إيجاد الخطوات التي تستفيد من الذكاء والتكيف أو فهم اللغة.</div><div class="info-box cyan" style="margin-bottom:8px"><strong>الخطوة 4: تصميم سير العمل الآلي</strong><br>تحديد المحفزات والشروط والإجراءات والمخرجات.</div><div class="info-box slate"><strong>الخطوة 5: اختبار وتحسين ونشر الحل</strong><br>التحقق والتكرار وإطلاق الحل.</div></div>'},
            {'id': 'm5-s4', 'title_en': 'Operational Coordination', 'title_ar': 'التنسيق التشغيلي', 'type': 'content', 'content_en': '<div class="info-box emerald"><strong>Operational Coordination</strong> — Automation for scheduling, routing, and resource allocation.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Automated appointment scheduling and rescheduling</li><li>Routing patient referrals to the right specialist</li><li>Bed management and allocation</li><li>Staff scheduling and shift management</li><li>Supply chain coordination</li></ul></div>', 'content_ar': '<div class="info-box emerald"><strong>التنسيق التشغيلي</strong> — الأتمتة للجدولة والتوجيه وتخصيص الموارد.</div><div class="info-box cyan" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>جدولة المواعيد وإعادة الجدولة الآلية</li><li>توجيه إحالات المرضى للمتخصص المناسب</li><li>إدارة الأسرّة وتخصيصها</li><li>جدولة الموظفين وإدارة النوبات</li><li>تنسيق سلسلة الإمداد</li></ul></div>'},
            {'id': 'm5-s5', 'title_en': 'Communication Automation', 'title_ar': 'أتمتة التواصل', 'type': 'content', 'content_en': '<div class="info-box violet"><strong>Communication Automation</strong> — Automated workflows for reminders, follow-ups, and notifications.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Patient follow-up reminders after visits</li><li>Appointment confirmation and reminder notifications</li><li>Lab result availability notifications</li><li>Medication refill reminders</li><li>Post-discharge check-in messages</li></ul></div>', 'content_ar': '<div class="info-box violet"><strong>أتمتة التواصل</strong> — سير عمل آلي للتذكيرات والمتابعات والإشعارات.</div><div class="info-box cyan" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>تذكيرات متابعة المرضى بعد الزيارات</li><li>إشعارات تأكيد وتذكير المواعيد</li><li>إشعارات توفر نتائج المختبر</li><li>تذكيرات إعادة صرف الأدوية</li><li>رسائل متابعة ما بعد الخروج</li></ul></div>'},
            {'id': 'm5-s6', 'title_en': 'Decision Support', 'title_ar': 'دعم القرار', 'type': 'content', 'content_en': '<div class="info-box amber"><strong>Decision Support</strong> — AI-powered analysis to help humans make better, faster decisions.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Flagging abnormal lab results for physician review</li><li>Clinical decision support alerts</li><li>Risk scoring for patient conditions</li><li>Treatment recommendation based on guidelines</li><li>Predictive analytics for readmission risk</li></ul></div>', 'content_ar': '<div class="info-box amber"><strong>دعم القرار</strong> — تحليل مدعوم بالذكاء الاصطناعي لمساعدة البشر في اتخاذ قرارات أفضل وأسرع.</div><div class="info-box cyan" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>تمييز نتائج المختبر غير الطبيعية لمراجعة الطبيب</li><li>تنبيهات دعم القرار السريري</li><li>تقييم المخاطر لحالات المرضى</li><li>توصية العلاج بناءً على الإرشادات</li><li>تحليلات تنبؤية لمخاطر إعادة الدخول</li></ul></div>'},
            {'id': 'm5-s7', 'title_en': 'Productivity Automation', 'title_ar': 'أتمتة الإنتاجية', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Productivity Automation</strong> — Automating routine tasks to free staff for higher-value work.</div><div class="info-box violet" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Auto-generating shift reports</li><li>Automated documentation and note summarization</li><li>Data entry automation</li><li>Template-based report generation</li><li>Meeting summaries and action item tracking</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>أتمتة الإنتاجية</strong> — أتمتة المهام الروتينية لتحرير الموظفين للعمل الأعلى قيمة.</div><div class="info-box violet" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>إنشاء تقارير النوبات تلقائياً</li><li>التوثيق الآلي وتلخيص الملاحظات</li><li>أتمتة إدخال البيانات</li><li>إنشاء التقارير بالقوالب</li><li>ملخصات الاجتماعات وتتبع بنود العمل</li></ul></div>'},
            {'id': 'm5-s8', 'title_en': 'Monitoring & Alerts', 'title_ar': 'المراقبة والتنبيهات', 'type': 'content', 'content_en': '<div class="info-box slate"><strong>Monitoring & Alerts</strong> — Automated systems that track metrics, detect anomalies, and send alerts.</div><div class="info-box cyan" style="margin-top:12px"><strong>Healthcare Examples:</strong><ul style="margin:8px 0 0 16px"><li>Tracking medication inventory levels</li><li>Patient vital sign monitoring</li><li>Equipment maintenance alerts</li><li>Compliance deadline tracking</li><li>Unusual pattern detection in patient data</li></ul></div>', 'content_ar': '<div class="info-box slate"><strong>المراقبة والتنبيهات</strong> — أنظمة آلية تتتبع المقاييس وتكتشف الشذوذ وترسل تنبيهات.</div><div class="info-box cyan" style="margin-top:12px"><strong>أمثلة في الرعاية الصحية:</strong><ul style="margin:8px 0 0 16px"><li>تتبع مستويات مخزون الأدوية</li><li>مراقبة العلامات الحيوية للمرضى</li><li>تنبيهات صيانة المعدات</li><li>تتبع مواعيد الامتثال النهائية</li><li>اكتشاف الأنماط غير العادية في بيانات المرضى</li></ul></div>'},
            {'id': 'm5-s9', 'title_en': 'Automation Tools Overview', 'title_ar': 'نظرة عامة على أدوات الأتمتة', 'type': 'content', 'content_en': '<div class="info-box cyan"><strong>Practical Automation Tools:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>n8n</strong> — Open-source visual workflow automation platform.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Make (Integromat)</strong> — Visual automation with parallel paths, error handling, and data transformation.</div><div class="info-box amber"><strong>Zapier</strong> — Trigger-based automation connecting 5,000+ apps. Simple if-this-then-that logic.</div></div>', 'content_ar': '<div class="info-box cyan"><strong>أدوات الأتمتة العملية:</strong></div><div style="margin-top:12px"><div class="info-box emerald" style="margin-bottom:8px"><strong>n8n</strong> — منصة أتمتة سير عمل مرئية مفتوحة المصدر.</div><div class="info-box violet" style="margin-bottom:8px"><strong>Make</strong> — أتمتة مرئية مع مسارات متوازية ومعالجة الأخطاء.</div><div class="info-box amber"><strong>Zapier</strong> — أتمتة قائمة على المحفزات تربط أكثر من 5,000 تطبيق.</div></div>'},
            {'id': 'm5-s10', 'title_en': 'Module 5 Summary & Key Takeaways', 'title_ar': 'ملخص الوحدة الخامسة', 'type': 'summary', 'content_en': '<div class="info-box cyan"><strong>Key Takeaways:</strong><ul style="margin:8px 0 0 16px"><li><strong>Identify automation opportunities:</strong> repetitive, time-consuming, error-prone tasks</li><li><strong>5-Step Design Process:</strong> Identify -> Map -> Insert AI -> Design -> Test & Deploy</li><li><strong>Use Case Categories:</strong> Operational Coordination, Communication, Decision Support, Productivity, Monitoring</li><li><strong>Tools:</strong> n8n, Make, Zapier for workflow automation</li></ul></div>', 'content_ar': '<div class="info-box cyan"><strong>النقاط الرئيسية:</strong><ul style="margin:8px 0 0 16px"><li><strong>تحديد فرص الأتمتة:</strong> المهام المتكررة والمستهلكة للوقت والعرضة للأخطاء</li><li><strong>عملية التصميم من 5 خطوات:</strong> حدد -> ارسم -> أدخل الذكاء الاصطناعي -> صمم -> اختبر وانشر</li><li><strong>فئات حالات الاستخدام:</strong> التنسيق التشغيلي، التواصل، دعم القرار، الإنتاجية، المراقبة</li><li><strong>الأدوات:</strong> n8n، Make، Zapier لأتمتة سير العمل</li></ul></div>'},
        ],
    },
]


# ══════════════════════════════════════════════════════════════
# SHARED CSS
# ══════════════════════════════════════════════════════════════

CSS = '''
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
/* Activity styles */
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
# LANGUAGE TOGGLE JS BUILDER
# ══════════════════════════════════════════════════════════════

def build_lang_js(title_en, title_ar, mod_num, mod_title_en, mod_title_ar, slide_idx=None, badge_type='slide'):
    """Build language toggle JS. slide_idx=None for activity-only packages."""
    badge2_en = f'Topic {slide_idx + 1}' if slide_idx is not None else 'Activity'
    badge2_ar = f'الموضوع {slide_idx + 1}' if slide_idx is not None else 'نشاط تفاعلي'
    total = COURSE_INFO['total_modules']
    return f'''
let lang = '{DEFAULT_LANG}';

function applyLang() {{
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = lang === 'ar' ? 'English' : '\\u0627\\u0644\\u0639\\u0631\\u0628\\u064a\\u0629';
  document.getElementById('slideTitle').textContent = lang === 'ar' ? {json.dumps(title_ar)} : {json.dumps(title_en)};
  document.getElementById('contentEN').classList.toggle('hidden', lang === 'ar');
  document.getElementById('contentAR').classList.toggle('hidden', lang === 'en');
  document.getElementById('badgeModule').textContent = lang === 'ar' ? '\\u0627\\u0644\\u0648\\u062d\\u062f\\u0629 {mod_num}' : 'Module {mod_num}';
  document.getElementById('badgeSlide').textContent = lang === 'ar' ? {json.dumps(badge2_ar)} : {json.dumps(badge2_en)};
  document.getElementById('footerInfo').textContent = lang === 'ar' ? '\\u0627\\u0644\\u0648\\u062d\\u062f\\u0629 {mod_num} \\u0645\\u0646 {total} \\u2014 ' + {json.dumps(mod_title_ar)} : 'Module {mod_num} of {total} \\u2014 ' + {json.dumps(mod_title_en)};
  document.dispatchEvent(new Event('langChange'));
}}

function toggleLang() {{
  lang = lang === 'en' ? 'ar' : 'en';
  applyLang();
}}
'''


# ══════════════════════════════════════════════════════════════
# ACTIVITY HTML BUILDERS (for standalone activity SCORM files)
# ══════════════════════════════════════════════════════════════

def build_match_html(activity, idx=0):
    pairs = activity['pairs']
    act_id = f'matchAct{idx}'
    pairs_json = json.dumps(pairs)
    return f'''
<div class="activity-section" id="{act_id}">
  <div class="section-divider" id="{act_id}_title"></div>
  <p class="activity-desc" id="{act_id}_desc"></p>
  <div class="match-grid" id="{act_id}_grid"></div>
  <div style="text-align:center;margin-top:10px">
    <button class="btn btn-primary" id="{act_id}_check" onclick="{act_id}_checkAnswers()"></button>
    <button class="btn btn-outline hidden" id="{act_id}_reset" onclick="{act_id}_resetActivity()"></button>
  </div>
  <div id="{act_id}_result" style="margin-top:8px"></div>
</div>
<script>
(function(){{
  const pairs={pairs_json};
  const titleEN={json.dumps(activity['title_en'])};
  const titleAR={json.dumps(activity['title_ar'])};
  const descEN={json.dumps(activity['desc_en'])};
  const descAR={json.dumps(activity['desc_ar'])};
  let selected=null, answers={{}}, checked=false;
  const rights=[...new Set(pairs.map(p=>p.right_en))];
  function render(){{
    const isAr=lang==='ar';
    document.getElementById('{act_id}_title').textContent=isAr?'\\u2b50 '+titleAR:'\\u2b50 '+titleEN;
    document.getElementById('{act_id}_desc').textContent=isAr?descAR:descEN;
    document.getElementById('{act_id}_check').textContent=isAr?'\\u2714 \\u062a\\u062d\\u0642\\u0642':'\\u2714 Check';
    document.getElementById('{act_id}_reset').textContent=isAr?'\\u0625\\u0639\\u0627\\u062f\\u0629':'Reset';
    const grid=document.getElementById('{act_id}_grid');
    let h='';
    pairs.forEach((p,i)=>{{
      const leftT=isAr?p.left_ar:p.left_en;
      const matchedTo=answers[i];
      let cls='match-left';
      if(checked&&matchedTo!==undefined){{
        const correctR=isAr?p.right_ar:p.right_en;
        cls+=matchedTo===correctR?' correct':' wrong';
      }}else if(matchedTo!==undefined)cls+=' matched';
      h+='<div class="match-item"><div class="'+cls+'" onclick="{act_id}_selectLeft('+i+')">'+leftT+'</div>';
      if(i<rights.length){{
        const rT=isAr?pairs.find(pp=>pp.right_en===rights[i]).right_ar:rights[i];
        h+='<div class="match-right" onclick="{act_id}_selectRight(\\''+rights[i]+'\\')">'+rT+'</div>';
      }}else h+='<div></div>';
      h+='</div>';
    }});
    grid.innerHTML=h;
  }}
  window['{act_id}_selectLeft']=function(i){{if(checked||answers[i]!==undefined)return;selected=i;render();}};
  window['{act_id}_selectRight']=function(r){{
    if(checked||selected===null)return;
    answers[selected]=r;selected=null;render();
  }};
  window['{act_id}_checkAnswers']=function(){{
    if(Object.keys(answers).length<pairs.length)return;
    checked=true;
    document.getElementById('{act_id}_check').classList.add('hidden');
    document.getElementById('{act_id}_reset').classList.remove('hidden');
    const correct=pairs.filter((p,i)=>answers[i]===p.right_en).length;
    const pct=Math.round(correct/pairs.length*100);
    const isAr=lang==='ar';
    const res=document.getElementById('{act_id}_result');
    res.innerHTML='<div class="info-box '+(pct>=80?'emerald':'amber')+'"><strong>'+(isAr?'\\u0627\\u0644\\u0646\\u062a\\u064a\\u062c\\u0629: ':'Score: ')+pct+'%</strong> ('+correct+'/'+pairs.length+')</div>';
    if(pct>=80)SCORM.setScore(pct,100,0);
    render();
  }};
  window['{act_id}_resetActivity']=function(){{
    answers={{}};selected=null;checked=false;
    document.getElementById('{act_id}_check').classList.remove('hidden');
    document.getElementById('{act_id}_reset').classList.add('hidden');
    document.getElementById('{act_id}_result').innerHTML='';
    render();
  }};
  document.addEventListener('langChange',render);
  setTimeout(render,50);
}})();
</script>'''


def build_flashcard_html(activity, idx=0):
    cards = activity['cards']
    act_id = f'flashAct{idx}'
    cards_json = json.dumps(cards)
    return f'''
<div class="activity-section" id="{act_id}">
  <div class="section-divider" id="{act_id}_title"></div>
  <p class="activity-desc" id="{act_id}_desc"></p>
  <div id="{act_id}_card" class="flash-card" onclick="{act_id}_flip()">
    <div class="flash-inner"><div class="flash-front" id="{act_id}_front"></div><div class="flash-back" id="{act_id}_back"></div></div>
  </div>
  <div class="flash-nav">
    <button class="btn btn-outline" onclick="{act_id}_prev()">&larr;</button>
    <span id="{act_id}_counter" style="font-size:12px;color:var(--slate);align-self:center"></span>
    <button class="btn btn-outline" onclick="{act_id}_next()">&rarr;</button>
  </div>
  <p style="font-size:11px;color:var(--slate);text-align:center;margin-top:4px" id="{act_id}_hint"></p>
</div>
<script>
(function(){{
  const cards={cards_json};
  const titleEN={json.dumps(activity['title_en'])};
  const titleAR={json.dumps(activity['title_ar'])};
  const descEN={json.dumps(activity['desc_en'])};
  const descAR={json.dumps(activity['desc_ar'])};
  let ci=0,flipped=false;
  function render(){{
    const isAr=lang==='ar';
    document.getElementById('{act_id}_title').textContent=isAr?'\\U0001f4a1 '+titleAR:'\\U0001f4a1 '+titleEN;
    document.getElementById('{act_id}_desc').textContent=isAr?descAR:descEN;
    document.getElementById('{act_id}_front').textContent=isAr?cards[ci].front_ar:cards[ci].front_en;
    document.getElementById('{act_id}_back').textContent=isAr?cards[ci].back_ar:cards[ci].back_en;
    document.getElementById('{act_id}_counter').textContent=(ci+1)+'/'+cards.length;
    document.getElementById('{act_id}_hint').textContent=isAr?'\\u0627\\u0646\\u0642\\u0631 \\u0644\\u0644\\u0642\\u0644\\u0628':'Click to flip';
    document.getElementById('{act_id}_card').classList.toggle('flipped',flipped);
  }}
  window['{act_id}_flip']=function(){{flipped=!flipped;render();}};
  window['{act_id}_prev']=function(){{ci=(ci-1+cards.length)%cards.length;flipped=false;render();}};
  window['{act_id}_next']=function(){{ci=(ci+1)%cards.length;flipped=false;render();}};
  document.addEventListener('langChange',render);
  setTimeout(render,50);
}})();
</script>'''


def build_dragdrop_html(activity, idx=0):
    items = activity['items']
    act_id = f'dragAct{idx}'
    items_json = json.dumps(items)
    return f'''
<div class="activity-section" id="{act_id}">
  <div class="section-divider" id="{act_id}_title"></div>
  <p class="activity-desc" id="{act_id}_desc"></p>
  <ul class="drag-list" id="{act_id}_list"></ul>
  <div style="text-align:center;margin-top:10px">
    <button class="btn btn-primary" onclick="{act_id}_check()" id="{act_id}_checkBtn"></button>
    <button class="btn btn-outline hidden" onclick="{act_id}_reset()" id="{act_id}_resetBtn"></button>
  </div>
  <div id="{act_id}_result" style="margin-top:8px"></div>
</div>
<script>
(function(){{
  const items={items_json};
  const titleEN={json.dumps(activity['title_en'])};
  const titleAR={json.dumps(activity['title_ar'])};
  const descEN={json.dumps(activity['desc_en'])};
  const descAR={json.dumps(activity['desc_ar'])};
  let order=[...Array(items.length).keys()];
  let checked=false;
  for(let i=order.length-1;i>0;i--){{const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}}
  function render(){{
    const isAr=lang==='ar';
    document.getElementById('{act_id}_title').textContent=isAr?'\\U0001f4cb '+titleAR:'\\U0001f4cb '+titleEN;
    document.getElementById('{act_id}_desc').textContent=isAr?descAR:descEN;
    document.getElementById('{act_id}_checkBtn').textContent=isAr?'\\u2714 \\u062a\\u062d\\u0642\\u0642':'\\u2714 Check Order';
    document.getElementById('{act_id}_resetBtn').textContent=isAr?'\\u0625\\u0639\\u0627\\u062f\\u0629':'Reset';
    const list=document.getElementById('{act_id}_list');
    let h='';
    order.forEach((oi,pos)=>{{
      const item=items[oi];
      let cls='drag-item';
      if(checked)cls+=item.order===(pos+1)?' correct-pos':' wrong-pos';
      h+='<li class="'+cls+'" draggable="true" data-idx="'+pos+'">';
      h+='<span class="drag-handle">\\u2630</span>';
      h+='<span>'+(isAr?item.text_ar:item.text_en)+'</span></li>';
    }});
    list.innerHTML=h;
    if(!checked){{
      const lis=list.querySelectorAll('li');
      let dragIdx=null;
      lis.forEach(li=>{{
        li.addEventListener('dragstart',e=>{{dragIdx=+li.dataset.idx;li.style.opacity='.4';}});
        li.addEventListener('dragend',e=>{{li.style.opacity='1';}});
        li.addEventListener('dragover',e=>e.preventDefault());
        li.addEventListener('drop',e=>{{
          e.preventDefault();const dropIdx=+li.dataset.idx;
          if(dragIdx!==null&&dragIdx!==dropIdx){{[order[dragIdx],order[dropIdx]]=[order[dropIdx],order[dragIdx]];render();}}
        }});
      }});
    }}
  }}
  window['{act_id}_check']=function(){{
    checked=true;
    document.getElementById('{act_id}_checkBtn').classList.add('hidden');
    document.getElementById('{act_id}_resetBtn').classList.remove('hidden');
    const correct=order.filter((oi,pos)=>items[oi].order===(pos+1)).length;
    const pct=Math.round(correct/items.length*100);
    const isAr=lang==='ar';
    document.getElementById('{act_id}_result').innerHTML='<div class="info-box '+(pct>=80?'emerald':'amber')+'"><strong>'+(isAr?'\\u0627\\u0644\\u0646\\u062a\\u064a\\u062c\\u0629: ':'Score: ')+pct+'%</strong> ('+correct+'/'+items.length+')</div>';
    if(pct>=80)SCORM.setScore(pct,100,0);
    render();
  }};
  window['{act_id}_reset']=function(){{
    checked=false;
    for(let i=order.length-1;i>0;i--){{const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}}
    document.getElementById('{act_id}_checkBtn').classList.remove('hidden');
    document.getElementById('{act_id}_resetBtn').classList.add('hidden');
    document.getElementById('{act_id}_result').innerHTML='';
    render();
  }};
  document.addEventListener('langChange',render);
  setTimeout(render,50);
}})();
</script>'''


def get_activity_html(activity):
    """Return the interactive HTML for an activity based on its type."""
    t = activity['type']
    if t == 'match':
        return build_match_html(activity)
    elif t == 'flashcard':
        return build_flashcard_html(activity)
    elif t == 'dragdrop':
        return build_dragdrop_html(activity)
    return ''


# ══════════════════════════════════════════════════════════════
# HTML PAGE TEMPLATE
# ══════════════════════════════════════════════════════════════

def build_page_html(title_en, title_ar, mod_num, mod_title_en, mod_title_ar, slide_idx,
                    content_en, content_ar, image_b64=None, badge_type='slide', extra_badge=None, activity_html=''):
    """Build a complete self-contained HTML page for SCORM packaging."""
    
    # Initial direction based on default lang
    init_dir = 'rtl' if DEFAULT_LANG == 'ar' else 'ltr'
    init_lang = 'ar' if DEFAULT_LANG == 'ar' else 'en'
    init_title = title_ar if DEFAULT_LANG == 'ar' else title_en
    init_btn = 'English' if DEFAULT_LANG == 'ar' else '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
    badge1 = f'\u0627\u0644\u0648\u062d\u062f\u0629 {mod_num}' if DEFAULT_LANG == 'ar' else f'Module {mod_num}'
    if slide_idx is not None:
        badge2 = f'\u0627\u0644\u0645\u0648\u0636\u0648\u0639 {slide_idx + 1}' if DEFAULT_LANG == 'ar' else f'Topic {slide_idx + 1}'
    else:
        badge2 = '\u0646\u0634\u0627\u0637 \u062a\u0641\u0627\u0639\u0644\u064a' if DEFAULT_LANG == 'ar' else 'Activity'
    footer = f'\u0627\u0644\u0648\u062d\u062f\u0629 {mod_num} \u0645\u0646 {COURSE_INFO["total_modules"]} \u2014 {mod_title_ar}' if DEFAULT_LANG == 'ar' else f'Module {mod_num} of {COURSE_INFO["total_modules"]} \u2014 {mod_title_en}'
    
    lang_js = build_lang_js(title_en, title_ar, mod_num, mod_title_en, mod_title_ar, slide_idx, badge_type)
    
    img_html = ''
    if image_b64:
        img_html = f'<div style="max-width:500px;margin:12px auto"><img src="{image_b64}" alt="{title_en}"></div>'
    
    # Content visibility based on default lang
    en_class = 'hidden' if DEFAULT_LANG == 'ar' else ''
    ar_class = '' if DEFAULT_LANG == 'ar' else 'hidden'
    
    extra_badge_html = ''
    if extra_badge:
        extra_badge_html = f'<span class="badge badge-amber">{extra_badge}</span>'
    
    html = f'''<!DOCTYPE html>
<html lang="{init_lang}" dir="{init_dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{init_title}</title>
<style>{CSS}</style>
</head>
<body>
<div class="app">
  <div class="card">
    <div class="card-header">
      <div>
        <span class="badge badge-cyan" id="badgeModule">{badge1}</span>
        <span class="badge badge-violet" id="badgeSlide">{badge2}</span>
      </div>
      <button class="lang-btn" onclick="toggleLang()" id="langBtn">{init_btn}</button>
    </div>
    <div class="card-body animate-in">
      <h2 class="slide-title" id="slideTitle">{init_title}</h2>
      {img_html}
      <div id="contentEN" class="{en_class}">{content_en}</div>
      <div id="contentAR" class="{ar_class}">{content_ar}</div>
      {activity_html}
    </div>
    <div class="card-footer">
      <span style="font-size:11px;color:var(--slate)" id="footerInfo">{footer}</span>
      {extra_badge_html}
    </div>
  </div>
</div>
<div class="scorm-status" id="scormStatus"></div>

<script>
{SCORM_JS}
{lang_js}

window.addEventListener('load', () => {{
  applyLang();
  SCORM.init();
  SCORM.setStatus('incomplete');
  setTimeout(() => {{
    SCORM.setStatus('completed');
    SCORM.setScore(100, 100, 0);
  }}, 5000);
}});

window.addEventListener('beforeunload', () => {{
  SCORM.finish();
}});
</script>
</body>
</html>'''
    return html


# ══════════════════════════════════════════════════════════════
# imsmanifest.xml
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
# Open edX tar.gz wrapper
# ══════════════════════════════════════════════════════════════

def build_openedx_tar(display_name, topic_id, course_id, folder_name, zip_path, zip_name, tar_dir):
    """Build an Open edX .tar.gz course export package wrapping a SCORM zip."""
    course_root = f'<course url_name="course" org="{COURSE_INFO["org"]}" course="{course_id}" />'
    course_xml = f'''<course display_name="{display_name}" language="ar" start="2026-01-01T00:00:00Z">
  <chapter url_name="{topic_id}_chapter"/>
</course>'''
    chapter_xml = f'''<chapter display_name="{display_name}">
  <sequential url_name="{topic_id}_seq"/>
</chapter>'''
    seq_xml = f'''<sequential display_name="{display_name}">
  <vertical url_name="{topic_id}_unit"/>
</sequential>'''
    vert_xml = f'''<vertical display_name="{display_name}">
  <html url_name="{topic_id}_html" display_name="{display_name}"/>
</vertical>'''
    html_xml = f'<html filename="{topic_id}_html_content" display_name="{display_name}"/>'
    html_content = f'''<div>
  <iframe src="/static/{folder_name}/index.html" width="100%" height="800" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
</div>'''
    policy = json.dumps({"course/course": {"display_name": display_name, "start": "2026-01-01T00:00:00Z"}})
    grading = json.dumps({"GRADER": [{"type": "Activity", "min_count": 1, "drop_count": 0, "weight": 1.0}], "GRADE_CUTOFFS": {"Pass": 0.7}})
    
    tar_name = f"{folder_name}-openedx.tar.gz"
    tar_path = os.path.join(tar_dir, tar_name)
    
    with tarfile.open(tar_path, 'w:gz') as tar:
        def add_str(name, content):
            data = content.encode('utf-8')
            info = tarfile.TarInfo(name=name)
            info.size = len(data)
            tar.addfile(info, io.BytesIO(data))
        
        add_str('course.xml', course_root)
        add_str('course/course.xml', course_xml)
        add_str(f'chapter/{topic_id}_chapter.xml', chapter_xml)
        add_str(f'sequential/{topic_id}_seq.xml', seq_xml)
        add_str(f'vertical/{topic_id}_unit.xml', vert_xml)
        add_str(f'html/{topic_id}_html.xml', html_xml)
        add_str(f'html/{topic_id}_html_content.html', html_content)
        add_str('policies/course/policy.json', policy)
        add_str('policies/course/grading_policy.json', grading)
        tar.add(zip_path, arcname=f'static/{zip_name}')
        with zipfile.ZipFile(zip_path, 'r') as zf:
            idx_html = zf.read('index.html')
            info2 = tarfile.TarInfo(name=f'static/{folder_name}/index.html')
            info2.size = len(idx_html)
            tar.addfile(info2, io.BytesIO(idx_html))
    
    return tar_path, tar_name


# ══════════════════════════════════════════════════════════════
# MAIN BUILD
# ══════════════════════════════════════════════════════════════

def build_all():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_packages = []
    
    # ── 1. BUILD SLIDE PACKAGES ──
    print(f"\n{'='*70}")
    print(f"BUILDING SLIDE PACKAGES (content only, no embedded activities)")
    print(f"{'='*70}")
    
    for module in MODULES:
        mod_num = module['number']
        mod_dir = os.path.join(OUTPUT_DIR, f'module{mod_num}')
        os.makedirs(mod_dir, exist_ok=True)
        
        print(f"\n  Module {mod_num}: {module['title_en']} ({len(module['slides'])} slides)")
        print(f"  {'─'*60}")
        
        for slide_idx, slide in enumerate(module['slides']):
            s_id = slide['id']
            
            # Get image
            image_b64 = None
            img_key = slide.get('image_key', '')
            if img_key.startswith('module_'):
                mod_n = int(img_key.split('_')[1])
                image_b64 = MODULE_IMAGES.get(mod_n)
            elif img_key in SLIDE_IMAGES:
                image_b64 = SLIDE_IMAGES[img_key]
            
            # Build HTML
            html = build_page_html(
                title_en=slide['title_en'],
                title_ar=slide['title_ar'],
                mod_num=mod_num,
                mod_title_en=module['title_en'],
                mod_title_ar=module['title_ar'],
                slide_idx=slide_idx,
                content_en=slide.get('content_en', ''),
                content_ar=slide.get('content_ar', ''),
                image_b64=image_b64,
            )
            
            # Build manifest
            safe_title = f"Module {mod_num} - Topic {slide_idx + 1}: {slide['title_en']}"
            manifest_id = f"M{mod_num}_T{slide_idx + 1}_{s_id.replace('-', '_')}"
            manifest = build_manifest(manifest_id, safe_title)
            
            # Create SCORM zip
            folder_name = f"m{mod_num}-topic{slide_idx + 1}-{s_id}"
            zip_name = f"{folder_name}.zip"
            zip_path = os.path.join(mod_dir, zip_name)
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                zf.writestr('index.html', html)
                zf.writestr('imsmanifest.xml', manifest)
            
            # Build Open edX tar
            topic_id = f"m{mod_num}_t{slide_idx + 1}"
            course_id = f"M{mod_num}_Topic{slide_idx + 1}"
            tar_path, tar_name = build_openedx_tar(
                safe_title, topic_id, course_id, folder_name, zip_path, zip_name, mod_dir
            )
            
            size_kb = os.path.getsize(zip_path) / 1024
            has_img = bool(slide.get('image_key'))
            print(f"    {'img' if has_img else '   '} Topic {slide_idx + 1}: {slide['title_en'][:45]:45s} {size_kb:.1f}KB")
            
            all_packages.append({
                'type': 'slide',
                'module': mod_num,
                'topic': slide_idx + 1,
                'title_en': slide['title_en'],
                'title_ar': slide['title_ar'],
                'zip_path': zip_path, 'zip_name': zip_name,
                'tar_path': tar_path, 'tar_name': tar_name,
                'size_kb': size_kb,
            })
    
    # ── 2. BUILD ACTIVITY PACKAGES ──
    print(f"\n{'='*70}")
    print(f"BUILDING ACTIVITY PACKAGES (standalone interactive activities)")
    print(f"{'='*70}")
    
    for act_key, activity in ACTIVITIES.items():
        mod_num = activity['module']
        mod_dir = os.path.join(OUTPUT_DIR, f'module{mod_num}')
        os.makedirs(mod_dir, exist_ok=True)
        
        # Find parent module
        module = next(m for m in MODULES if m['number'] == mod_num)
        
        # Build activity HTML
        act_html = get_activity_html(activity)
        
        # Type label
        type_labels = {'match': 'Matching', 'flashcard': 'Flashcards', 'dragdrop': 'Drag & Drop'}
        type_label = type_labels.get(activity['type'], 'Activity')
        type_label_ar_map = {'match': '\u0645\u0637\u0627\u0628\u0642\u0629', 'flashcard': '\u0628\u0637\u0627\u0642\u0627\u062a', 'dragdrop': '\u0633\u062d\u0628 \u0648\u0625\u0641\u0644\u0627\u062a'}
        type_label_ar = type_label_ar_map.get(activity['type'], '\u0646\u0634\u0627\u0637')
        
        # Brief description as content
        content_en = f'<div class="info-box cyan"><strong>{type_label} Activity:</strong> {activity["desc_en"]}</div>'
        content_ar = f'<div class="info-box cyan"><strong>\u0646\u0634\u0627\u0637 {type_label_ar}:</strong> {activity["desc_ar"]}</div>'
        
        html = build_page_html(
            title_en=activity['title_en'],
            title_ar=activity['title_ar'],
            mod_num=mod_num,
            mod_title_en=module['title_en'],
            mod_title_ar=module['title_ar'],
            slide_idx=None,  # activity, not a slide
            content_en=content_en,
            content_ar=content_ar,
            activity_html=act_html,  # placed outside contentEN/contentAR divs
            extra_badge=f'{type_label} Activity' if DEFAULT_LANG == 'en' else f'\u0646\u0634\u0627\u0637 {type_label_ar}',
        )
        
        # Manifest
        safe_title = f"Module {mod_num} - Activity: {activity['title_en']}"
        manifest_id = f"M{mod_num}_Act_{act_key.replace('-', '_')}"
        manifest = build_manifest(manifest_id, safe_title)
        
        # SCORM zip
        folder_name = f"m{mod_num}-activity-{act_key}"
        zip_name = f"{folder_name}.zip"
        zip_path = os.path.join(mod_dir, zip_name)
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('index.html', html)
            zf.writestr('imsmanifest.xml', manifest)
        
        # Open edX tar
        topic_id = f"m{mod_num}_act_{act_key.replace('-', '_')}"
        course_id = f"M{mod_num}_Act_{act_key.replace('-', '_')}"
        tar_path, tar_name = build_openedx_tar(
            safe_title, topic_id, course_id, folder_name, zip_path, zip_name, mod_dir
        )
        
        size_kb = os.path.getsize(zip_path) / 1024
        print(f"  [{type_label:10s}] M{mod_num}: {activity['title_en'][:45]:45s} {size_kb:.1f}KB")
        
        all_packages.append({
            'type': 'activity',
            'module': mod_num,
            'activity_id': act_key,
            'activity_type': activity['type'],
            'title_en': activity['title_en'],
            'title_ar': activity['title_ar'],
            'zip_path': zip_path, 'zip_name': zip_name,
            'tar_path': tar_path, 'tar_name': tar_name,
            'size_kb': size_kb,
        })
    
    # ── 3. BUILD COMBINED ARCHIVES ──
    print(f"\n{'='*70}")
    print(f"BUILDING COMBINED ARCHIVES")
    print(f"{'='*70}")
    
    zip_tar = os.path.join(OUTPUT_DIR, 'all-scorm-zips.tar.gz')
    with tarfile.open(zip_tar, 'w:gz') as tar:
        for pkg in all_packages:
            arcname = f"module{pkg['module']}/{pkg['zip_name']}"
            tar.add(pkg['zip_path'], arcname=arcname)
    
    edx_tar = os.path.join(OUTPUT_DIR, 'all-openedx-packages.tar.gz')
    with tarfile.open(edx_tar, 'w:gz') as tar:
        for pkg in all_packages:
            arcname = f"module{pkg['module']}/{pkg['tar_name']}"
            tar.add(pkg['tar_path'], arcname=arcname)
    
    z_kb = os.path.getsize(zip_tar) / 1024
    e_kb = os.path.getsize(edx_tar) / 1024
    
    # ── 4. BUILD UNIFIED OPEN EDX COURSE TAR.GZ WITH course.xml ──
    print(f"\n{'='*70}")
    print(f"BUILDING UNIFIED OPEN EDX COURSE PACKAGE")
    print(f"{'='*70}")
    
    unified_tar_path = os.path.join(OUTPUT_DIR, 'openedx-course-complete.tar.gz')
    course_display = COURSE_INFO['title_ar'] if DEFAULT_LANG == 'ar' else COURSE_INFO['title_en']
    course_org = COURSE_INFO['org']
    course_run = 'AI_Automation_2026'
    
    with tarfile.open(unified_tar_path, 'w:gz') as tar:
        def add_str(name, content):
            data = content.encode('utf-8')
            info = tarfile.TarInfo(name=name)
            info.size = len(data)
            tar.addfile(info, io.BytesIO(data))
        
        # Root course.xml (required by Open edX)
        add_str('course.xml', f'<course url_name="course" org="{course_org}" course="{course_run}" />')
        
        # Build chapter references
        chapter_refs = ''
        for module in MODULES:
            mod_num = module['number']
            chapter_refs += f'  <chapter url_name="module{mod_num}_chapter"/>\n'
        
        # course/course.xml
        add_str('course/course.xml', f'''<course display_name="{course_display}" language="ar" start="2026-01-01T00:00:00Z">
{chapter_refs}</course>''')
        
        # Build per-module structure
        for module in MODULES:
            mod_num = module['number']
            mod_title = module['title_ar'] if DEFAULT_LANG == 'ar' else module['title_en']
            
            # Collect all sequentials for this module
            seq_refs = ''
            mod_pkgs = [p for p in all_packages if p['module'] == mod_num]
            
            # Slides first, then activities
            slide_pkgs_mod = [p for p in mod_pkgs if p['type'] == 'slide']
            act_pkgs_mod = [p for p in mod_pkgs if p['type'] == 'activity']
            
            for i, pkg in enumerate(slide_pkgs_mod):
                seq_id = f"m{mod_num}_t{pkg.get('topic', i+1)}_seq"
                seq_refs += f'  <sequential url_name="{seq_id}"/>\n'
            for pkg in act_pkgs_mod:
                seq_id = f"m{mod_num}_act_{pkg.get('activity_id', '').replace('-', '_')}_seq"
                seq_refs += f'  <sequential url_name="{seq_id}"/>\n'
            
            # chapter XML
            add_str(f'chapter/module{mod_num}_chapter.xml',
                    f'<chapter display_name="{mod_title}">\n{seq_refs}</chapter>')
            
            # sequential + vertical + html for each package
            for i, pkg in enumerate(slide_pkgs_mod):
                topic_num = pkg.get('topic', i+1)
                seq_id = f"m{mod_num}_t{topic_num}_seq"
                vert_id = f"m{mod_num}_t{topic_num}_vert"
                html_id = f"m{mod_num}_t{topic_num}_html"
                display = pkg['title_ar'] if DEFAULT_LANG == 'ar' else pkg['title_en']
                folder = pkg['zip_name'].replace('.zip', '')
                
                add_str(f'sequential/{seq_id}.xml',
                        f'<sequential display_name="{display}">\n  <vertical url_name="{vert_id}"/>\n</sequential>')
                add_str(f'vertical/{vert_id}.xml',
                        f'<vertical display_name="{display}">\n  <html url_name="{html_id}" display_name="{display}"/>\n</vertical>')
                add_str(f'html/{html_id}.xml',
                        f'<html filename="{html_id}_content" display_name="{display}"/>')
                add_str(f'html/{html_id}_content.html',
                        f'<div>\n  <iframe src="/static/{folder}/index.html" width="100%" height="800" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n</div>')
                
                # Add SCORM zip contents to static
                with zipfile.ZipFile(pkg['zip_path'], 'r') as zf:
                    for zname in zf.namelist():
                        zdata = zf.read(zname)
                        zi = tarfile.TarInfo(name=f'static/{folder}/{zname}')
                        zi.size = len(zdata)
                        tar.addfile(zi, io.BytesIO(zdata))
            
            for pkg in act_pkgs_mod:
                act_id = pkg.get('activity_id', '').replace('-', '_')
                seq_id = f"m{mod_num}_act_{act_id}_seq"
                vert_id = f"m{mod_num}_act_{act_id}_vert"
                html_id = f"m{mod_num}_act_{act_id}_html"
                display = pkg['title_ar'] if DEFAULT_LANG == 'ar' else pkg['title_en']
                folder = pkg['zip_name'].replace('.zip', '')
                
                add_str(f'sequential/{seq_id}.xml',
                        f'<sequential display_name="{display}">\n  <vertical url_name="{vert_id}"/>\n</sequential>')
                add_str(f'vertical/{vert_id}.xml',
                        f'<vertical display_name="{display}">\n  <html url_name="{html_id}" display_name="{display}"/>\n</vertical>')
                add_str(f'html/{html_id}.xml',
                        f'<html filename="{html_id}_content" display_name="{display}"/>')
                add_str(f'html/{html_id}_content.html',
                        f'<div>\n  <iframe src="/static/{folder}/index.html" width="100%" height="800" frameborder="0" allowfullscreen="allowfullscreen"></iframe>\n</div>')
                
                with zipfile.ZipFile(pkg['zip_path'], 'r') as zf:
                    for zname in zf.namelist():
                        zdata = zf.read(zname)
                        zi = tarfile.TarInfo(name=f'static/{folder}/{zname}')
                        zi.size = len(zdata)
                        tar.addfile(zi, io.BytesIO(zdata))
        
        # Policy files
        policy = json.dumps({
            "course/course": {
                "display_name": course_display,
                "start": "2026-01-01T00:00:00Z",
                "language": "ar"
            }
        }, ensure_ascii=False)
        grading = json.dumps({
            "GRADER": [{"type": "Activity", "min_count": 1, "drop_count": 0, "weight": 1.0}],
            "GRADE_CUTOFFS": {"Pass": 0.7}
        })
        add_str('policies/course/policy.json', policy)
        add_str('policies/course/grading_policy.json', grading)
    
    u_kb = os.path.getsize(unified_tar_path) / 1024
    print(f"  Unified course:    openedx-course-complete.tar.gz ({u_kb:.1f} KB)")
    print(f"  Contains: course.xml + all {len(all_packages)} units/activities + static files")
    
    # ── SUMMARY ──
    slide_pkgs = [p for p in all_packages if p['type'] == 'slide']
    act_pkgs = [p for p in all_packages if p['type'] == 'activity']
    
    print(f"\n{'='*70}")
    print(f"BUILD COMPLETE")
    print(f"{'='*70}")
    print(f"  Default language: {'Arabic (RTL)' if DEFAULT_LANG == 'ar' else 'English (LTR)'}")
    print(f"  Slide packages:    {len(slide_pkgs)}")
    print(f"  Activity packages: {len(act_pkgs)}")
    print(f"  Total packages:    {len(all_packages)}")
    print(f"  SCORM archive:     all-scorm-zips.tar.gz ({z_kb:.1f} KB)")
    print(f"  Open edX archive:  all-openedx-packages.tar.gz ({e_kb:.1f} KB)")
    print(f"  Unified course:    openedx-course-complete.tar.gz ({u_kb:.1f} KB)")
    print(f"\n  Per slide:  content + images + bilingual + SCORM API")
    print(f"  Per activity: standalone interactive + bilingual + SCORM API")
    print(f"  Excluded: videos, quizzes, content menus")
    print(f"\n  Output: {OUTPUT_DIR}/")
    
    return all_packages


if __name__ == '__main__':
    build_all()
