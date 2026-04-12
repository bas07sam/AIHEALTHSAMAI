import { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Bot, User, Clock, AlertCircle, Sparkles, BookText, Search, ChevronDown, ChevronRight, ChevronLeft, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { courseInfo, courseInfoAr, sections, sectionsAr, tools, toolsAr, learningOutcomes, learningOutcomesAr, skills, skillsAr, glossary, glossaryAr, moduleColorsAr, moduleOrderAr } from '../data/courseData';

const RATE_LIMIT_KEY = 'healthai-chat-ratelimit';
const MAX_PROMPTS_PER_HOUR = 2;

const buildKnowledgeBase = (lang) => {
  const ci = lang === 'ar' ? courseInfoAr : courseInfo;
  const secs = lang === 'ar' ? sectionsAr : sections;
  const tls = lang === 'ar' ? toolsAr : tools;
  const lo = lang === 'ar' ? learningOutcomesAr : learningOutcomes;
  const sk = lang === 'ar' ? skillsAr : skills;
  const kb = {};
  kb.courseOverview = `${ci.title}: ${ci.description} ${ci.fullDescription}`;
  kb.objective = ci.objective;
  kb.prerequisites = ci.prerequisites;
  kb.targetAudience = ci.targetAudience;
  kb.whyMatters = ci.whyMatters;
  kb.courseDetails = lang === 'ar' 
    ? `المدة: ${ci.duration}، المستوى: ${ci.level}، القطاع: ${ci.sector}، التقديم: ${ci.deliveryMode}، درجة النجاح: ${ci.passingScore}%`
    : `Duration: ${ci.duration}, Level: ${ci.level}, Sector: ${ci.sector}, Delivery: ${ci.deliveryMode}, Passing Score: ${ci.passingScore}%`;
  kb.modules = secs.map((s, i) => ({
    title: s.title, description: s.shortDescription, outcomes: s.outcomes,
    activities: (lang === 'ar' ? s.activities : sections[i].activities).map(a => a.title),
  }));
  kb.tools = tls.map((t, i) => ({
    name: tools[i].name, tagline: t.tagline, description: t.description, healthcareUseCase: t.healthcareUseCase, summaryPoints: t.summaryPoints,
  }));
  kb.learningOutcomes = lo;
  kb.skills = sk;
  return kb;
};

const courseKeywords = [
  'automation', 'ai', 'artificial intelligence', 'workflow', 'trigger', 'action',
  'condition', 'output', 'agent', 'ai agent', 'vibe coding', 'prompt', 'coding',
  'healthcare', 'module', 'section', 'lesson', 'course', 'exam', 'quiz', 'activity',
  'lovable', 'replit', 'claude', 'n8n', 'make', 'zapier', 'tool', 'demo',
  'task automation', 'process automation', 'intelligent automation', 'traditional',
  'decision support', 'monitoring', 'communication', 'productivity', 'operational',
  'certificate', 'pass', 'score', 'learning', 'outcome', 'skill',
  'drag', 'drop', 'flashcard', 'match', 'prototype', 'rapid prototyping',
  'natural language', 'no code', 'low code', 'workflow design', 'solution design',
  'use case', 'healthcare workflow', 'patient', 'appointment', 'referral',
  'onboarding', 'integration', 'api', 'dashboard', 'progress',
  'describe', 'generate', 'refine', 'iterate', 'goal', 'adaptive',
  'classification', 'summarisation', 'recommendation', 'anomaly',
  'rule-based', 'context-aware', 'unstructured data', 'structured data',
  'hr', 'onboarding', 'scheduling', 'inventory', 'lab results',
  'hello', 'hi', 'help', 'what', 'how', 'tell', 'explain', 'can you',
  'sdaia', 'academy', 'glossary', 'dictionary', 'term', 'definition',
];

function isCourseRelated(query) {
  const lower = query.toLowerCase();
  if (/^(hi|hello|hey|good morning|good evening|greetings|salam|thanks|thank you|مرحبا|أهلا|السلام عليكم|شكرا|صباح الخير|مساء الخير)[\s!?.]*$/i.test(lower)) return true;
  if (/course|module|section|lesson|exam|tool|dashboard|progress|certificate|activity|quiz|glossary|dictionary|term|دورة|وحدة|قسم|درس|اختبار|أداة|أدوات|تقدم|شهادة|نشاط|قاموس|مصطلح|أتمتة|ذكاء|سير|عمل|وكيل|برمجة|وصف|محفز|إجراء|شرط|مخرج/i.test(lower)) return true;
  return courseKeywords.some(kw => lower.includes(kw));
}

function generateAnswer(query, lang) {
  const q = query.toLowerCase();
  const ci = lang === 'ar' ? courseInfoAr : courseInfo;
  const lo = lang === 'ar' ? learningOutcomesAr : learningOutcomes;
  const sk = lang === 'ar' ? skillsAr : skills;
  const secs = lang === 'ar' ? sectionsAr : null;
  const tls = lang === 'ar' ? toolsAr : null;
  const isAr = lang === 'ar';
  if (/^(hi|hello|hey|good morning|good evening|greetings|salam|مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير)[\s!?.]*$/i.test(q)) {
    return isAr 
      ? "مرحبًا! أنا **وكيل أكاديمية سدايا**. يمكنني مساعدتك في أي شيء يتعلق بدورة *أتمتة الذكاء الاصطناعي والبرمجة بالوصف*.\n\nاسألني عن الوحدات أو الأدوات أو الأنشطة أو الاختبار أو أي مفهوم في الدورة!\n\n*نصيحة: استخدم تبويب القاموس أعلاه لتصفح جميع المصطلحات الرئيسية.*"
      : "Hello! I'm the **SDAIA Academy Agent**. I can help you with anything related to the *AI Automation and Vibe Coding* course.\n\nAsk me about modules, tools, activities, the exam, or any course concept!\n\n*Tip: Use the Dictionary tab above to browse all key terms.*";
  }
  if (/^(thanks|thank you|cheers|appreciated|شكرا|شكرًا|ممتاز)[\s!?.]*$/i.test(q)) return isAr ? "على الرحب والسعة! لا تتردد في السؤال في أي وقت تحتاج فيه مساعدة بخصوص الدورة." : "You're welcome! Feel free to ask anytime you need help with the course.";
  if (/what.*(course|about)|overview|summary|describe.*course|ما.*الدورة|نظرة.*عامة|ملخص|وصف.*الدورة/i.test(q)) return isAr
    ? `**${ci.title}**\n\n${ci.description}\n\n**المدة:** ${ci.duration} | **المستوى:** ${ci.level} | **التقديم:** ${ci.deliveryMode}\n\nتغطي الدورة 5 وحدات و6 عروض أدوات واختبار نهائي (درجة النجاح: ${ci.passingScore}%).`
    : `**${ci.title}**\n\n${ci.description}\n\n**Duration:** ${ci.duration} | **Level:** ${ci.level} | **Delivery:** ${ci.deliveryMode}\n\nThe course covers 5 modules, 6 tool demonstrations, and a final exam (passing score: ${ci.passingScore}%).`;
  if (/prerequisite|requirement|need.*before|background.*needed|المتطلبات|متطلبات/i.test(q)) return isAr ? `**المتطلبات المسبقة:** ${ci.prerequisites}` : `**Prerequisites:** ${ci.prerequisites}`;
  if (/who.*for|target.*audience|suitable.*for|audience|لمن|الجمهور/i.test(q)) return isAr ? `**الجمهور المستهدف:** ${ci.targetAudience}` : `**Target Audience:** ${ci.targetAudience}`;
  if (/learning.*outcome|what.*learn|outcome|مخرجات|ماذا.*تعلم/i.test(q)) return isAr ? `**مخرجات التعلم:**\n\n${lo.map((o, i) => `${i + 1}. ${o}`).join('\n')}` : `**Learning Outcomes:**\n\n${lo.map((o, i) => `${i + 1}. ${o}`).join('\n')}`;
  if (/skill|competenc|مهارات|كفاءات/i.test(q)) return isAr ? `**المهارات التي ستطورها:**\n\n${sk.map(s => `- ${s}`).join('\n')}` : `**Skills You'll Develop:**\n\n${sk.map(s => `- ${s}`).join('\n')}`;
  if (/exam|final.*assessment|pass.*score|certificate|اختبار|تقييم|درجة.*النجاح|شهادة/i.test(q)) return isAr
    ? `**الاختبار النهائي:**\n- 25 سؤالاً يغطي جميع الوحدات وعروض الأدوات\n- أنواع الأسئلة: اختيار من متعدد، صح/خطأ، وأسئلة سيناريو\n- **درجة النجاح: ${ci.passingScore}%**\n- احصل على شهادة عند النجاح\n- يمكنك إعادة الاختبار إذا لزم الأمر`
    : `**Final Exam:**\n- 25 questions covering all modules and tool demonstrations\n- Question types: Multiple choice, True/False, and Scenario-based\n- **Passing score: ${ci.passingScore}%**\n- Earn a certificate upon passing\n- You can retake the exam if needed`;
  if (/glossary|dictionary|key.*term|definition|قاموس|مصطلح|تعريف/i.test(q)) return isAr ? "يمكنك تصفح جميع **37 مصطلحًا رئيسيًا** وتعريفاتها باستخدام تبويب **القاموس** في أعلى هذه اللوحة. القاموس منظم حسب الوحدة وقابل للبحث!" : "You can browse all **37 key terms** and definitions using the **Dictionary** tab at the top of this panel. The dictionary is organized by module and fully searchable!";

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const sNum = section.number;
    const sTitle = section.title.toLowerCase();
    const keywords = sTitle.split(/\s+/).filter(w => w.length > 3);
    const arSec = secs ? secs[si] : null;
    const arKeywords = arSec ? arSec.title.split(/\s+/).filter(w => w.length > 2) : [];
    if (q.includes(`module ${sNum}`) || q.includes(`section ${sNum}`) || q.includes(`الوحدة ${sNum}`) || q.includes(`وحدة ${sNum}`) || keywords.some(kw => q.includes(kw)) || arKeywords.some(kw => q.includes(kw))) {
      const sec = isAr && arSec ? arSec : section;
      const actLabel = isAr ? 'الأنشطة' : 'Activities';
      const slidesLabel = isAr ? 'الشرائح' : 'Slides';
      const outcomesLabel = isAr ? 'مخرجات التعلم' : 'Learning Outcomes';
      const activities = sec.activities.map(a => `- *${a.title}*`).join('\n');
      return isAr 
        ? `**الوحدة ${sNum}: ${sec.title}**\n\n${sec.shortDescription}\n\n**${outcomesLabel}:**\n${sec.outcomes.map(o => `- ${o}`).join('\n')}\n\n**${actLabel}:**\n${activities}\n\n**${slidesLabel}:** ${section.totalSlides} شريحة`
        : `**Module ${sNum}: ${section.title}**\n\n${section.shortDescription}\n\n**${outcomesLabel}:**\n${section.outcomes.map(o => `- ${o}`).join('\n')}\n\n**${actLabel}:**\n${section.activities.map(a => `- *${a.title}* (${a.type === 'match' ? 'Match the Following' : a.type === 'dragdrop' ? 'Drag & Drop' : 'Flashcards'})`).join('\n')}\n\n**${slidesLabel}:** ${section.totalSlides} slides`;
    }
  }
  for (let ti = 0; ti < tools.length; ti++) {
    const tool = tools[ti];
    const arTool = tls ? tls[ti] : null;
    if (q.includes(tool.name.toLowerCase()) || q.includes(tool.id)) {
      const td = isAr && arTool ? arTool : tool;
      return isAr
        ? `**${tool.name}** — ${td.tagline}\n\n${td.description}\n\n**حالة الاستخدام في الرعاية الصحية:**\n${td.healthcareUseCase}\n\n**النقاط الرئيسية:**\n${td.summaryPoints.map(p => `- ${p}`).join('\n')}`
        : `**${tool.name}** — ${tool.tagline}\n\n${tool.description}\n\n**Healthcare Use Case:**\n${tool.healthcareUseCase}\n\n**Key Points:**\n${tool.summaryPoints.map(p => `- ${p}`).join('\n')}`;
    }
  }
  if (/tool|demo|أداة|أدوات|عرض/i.test(q) && !/module|وحدة/i.test(q)) {
    const toolList = isAr 
      ? tools.map((t, i) => `- **${t.name}** — ${tls[i].tagline}`).join('\n')
      : tools.map(t => `- **${t.name}** — ${t.tagline}`).join('\n');
    return isAr
      ? `**عروض الأدوات (6 أدوات):**\n\n${toolList}\n\nيتضمن كل عرض نظرة عامة وحالة استخدام صحية وفيديو توضيحي واختبار من 3 أسئلة.`
      : `**Tool Demonstrations (6 tools):**\n\n${toolList}\n\nEach tool demo includes an overview, healthcare use case, video demonstration, and a 3-question quiz.`;
  }
  if (/type.*automation|task.*automation|process.*automation|intelligent.*automation|أنواع.*الأتمتة|أتمتة.*المهام|أتمتة.*العمليات|الأتمتة.*الذكية/i.test(q)) return isAr
    ? "**الأنواع الثلاثة للأتمتة:**\n\n1. **أتمتة المهام** — أتمتة إجراء واحد منفصل (مثل: إرسال بريد، إنشاء إدخال في التقويم)\n2. **أتمتة العمليات** — ربط خطوات متعددة في سير عمل موحد (مثل: تهيئة الموارد البشرية، معالجة الطلبات)\n3. **الأتمتة الذكية** — تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل التصنيف والتلخيص والتوصية"
    : "**Three Types of Automation:**\n\n1. **Task Automation** — Automates a single, isolated action (e.g., send email, create calendar entry)\n2. **Process Automation** — Connects multiple steps into a unified workflow (e.g., HR onboarding, order processing)\n3. **Intelligent Automation** — Combines automation with AI capabilities like classifying, summarising, and recommending";
  if (/(traditional|rule.based).*automation|ai.*vs.*traditional|الأتمتة.*التقليدية|تقليدية.*مقابل/i.test(q)) return isAr
    ? "**الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي:**\n\n| التقليدية | أتمتة الذكاء الاصطناعي |\n|---|---|\n| قواعد ثابتة (إذا حدث X، افعل Y) | معالجة واعية للسياق |\n| تتعامل مع البيانات المنظمة فقط | تعالج النصوص والصور غير المنظمة |\n| سير عمل جامد محدد مسبقًا | منطق قرار تكيفي |"
    : "**Traditional vs AI Automation:**\n\n| Traditional | AI Automation |\n|---|---|\n| Fixed rules (If X, do Y) | Context-aware processing |\n| Handles structured data only | Processes unstructured text & images |\n| Rigid predefined workflows | Adaptive decision logic |";
  if (/workflow|trigger.*action|workflow.*component|building.*block|سير.*العمل|محفز|إجراء|مكونات/i.test(q)) return isAr
    ? "**مكونات بناء سير العمل:**\n\n1. **المحفز** — يبدأ سير العمل تلقائيًا (مثل: تقديم نموذج)\n2. **الإجراء** — المهمة التي ينفذها النظام (مثل: إرسال بريد)\n3. **الشرط** — يتحقق من استيفاء المعايير قبل المتابعة\n4. **المخرج** — النتيجة النهائية المقدمة للمستخدم\n\nمعادلة سير العمل: **المحفز ← الإجراء ← المخرج**"
    : "**Workflow Building Blocks:**\n\n1. **Trigger** — Starts the workflow automatically (e.g., form submission)\n2. **Action** — The task performed by the system (e.g., send email)\n3. **Condition** — Checks if criteria are met before proceeding\n4. **Output** — The final result delivered to the user\n\nThe workflow formula: **Trigger → Action → Output**";
  if (/ai.*agent|agent.*capabilit|what.*agent|وكيل|وكلاء.*الذكاء/i.test(q)) return isAr
    ? "**وكلاء الذكاء الاصطناعي** هي أنظمة يمكنها فهم الأهداف وتفسير السياق واتخاذ القرارات واتخاذ إجراءات مستقلة ضمن سير العمل.\n\n**القدرات الرئيسية:**\n- فهم اللغة الطبيعية\n- اتخاذ القرار والسلوك الموجه نحو الهدف\n- التنفيذ التكيفي\n- استخدام الأدوات (استدعاء واجهات برمجة التطبيقات)\n- الوعي بالسياق\n- الاستدلال متعدد الخطوات"
    : "**AI Agents** are systems that can understand goals, interpret context, make decisions, and take autonomous actions within a workflow.\n\n**Key Capabilities:**\n- Natural Language Understanding\n- Decision Making & Goal-Oriented Behavior\n- Adaptive Execution\n- Tool Use (calling APIs, updating records)\n- Context Awareness (remembering interactions)\n- Multi-Step Reasoning";
  if (/vibe.*coding|prompt.*driven|describe.*generate|rapid.*prototyp|البرمجة.*بالوصف|برمجة.*الوصف|نمذجة.*سريعة/i.test(q)) return isAr
    ? "**البرمجة بالوصف** هي إنشاء حلول رقمية عن طريق وصف ما تريده بلغة طبيعية، ثم ترك الذكاء الاصطناعي يولد الكود.\n\n**الحلقة الأساسية:** صف ← ولّد ← حسّن\n\n**الفوائد الرئيسية:**\n- لا تتطلب برمجة تقليدية\n- نمذجة سريعة للأفكار\n- تحسين تكراري من خلال المحادثة\n- متاحة لغير التقنيين"
    : "**Vibe Coding** is creating digital solutions by describing what you want in natural language, then letting AI generate the code.\n\n**Core Loop:** Describe → Generate → Refine\n\n**Key Benefits:**\n- No traditional programming required\n- Rapid prototyping of ideas\n- Iterative refinement through conversation\n- Accessible to non-technical users";
  if (/how many.*(module|section|lesson)|course.*structure|what.*module|كم.*وحدة|هيكل.*الدورة|ما.*الوحدات/i.test(q)) {
    const moduleList = isAr 
      ? sectionsAr.map((s, i) => `${sections[i].number}. ${s.title}`).join('\n')
      : sections.map(s => `${s.number}. ${s.title}`).join('\n');
    return isAr
      ? `**هيكل الدورة:**\n\n**5 وحدات:**\n${moduleList}\n\n**بالإضافة إلى:**\n- 6 عروض أدوات\n- اختبار نهائي (25 سؤال)\n- شهادة عند النجاح`
      : `**Course Structure:**\n\n**5 Modules:**\n${moduleList}\n\n**Plus:**\n- 6 Tool Demonstrations\n- Final Exam (25 questions)\n- Certificate on passing`;
  }
  if (/activit|interactive|match|drag.*drop|flashcard|أنشطة|تفاعلي|مطابقة|سحب.*إفلات|بطاقات/i.test(q)) return isAr
    ? "**الأنشطة التفاعلية:**\n\nتحتوي كل وحدة على **نشاطين** (10 إجمالاً). تشمل أنواع الأنشطة:\n\n1. **طابق التالي** — مطابقة المفاهيم مع الأوصاف\n2. **السحب والإفلات** — ترتيب العناصر بالترتيب الصحيح\n3. **البطاقات التعليمية** — اقلب البطاقات لمراجعة المفاهيم\n\nجميع الأنشطة تتضمن:\n- ملاحظات فورية\n- تتبع الدرجات\n- خيار إعادة المحاولة\n- تصميم متوافق مع الجوال"
    : "**Interactive Activities:**\n\nEach module has **2 activities** (10 total). Activity types include:\n\n1. **Match the Following** — Match concepts to descriptions\n2. **Drag & Drop** — Arrange items in correct order\n3. **Flashcards** — Flip cards to review concepts\n\nAll activities include:\n- Immediate feedback\n- Score tracking\n- Retry/reset option\n- Mobile-friendly design";
  if (/progress|track|navigate|how.*start|where.*start|تقدم|تتبع|كيف.*أبدأ|من أين.*أبدأ/i.test(q)) return isAr
    ? "**كيف تبدأ:**\n\n1. ابدأ بـ **فيديو المقدمة**\n2. أكمل **الوحدات 1-5** بالترتيب\n3. استكشف **عروض الأدوات**\n4. أكمل **الاختبار النهائي** (70% للنجاح)\n\nيتم تتبع تقدمك تلقائيًا. يمكنك رؤية حالة إكمالك في **لوحة المعلومات**."
    : "**Getting Started:**\n\n1. Start with the **Introduction Video**\n2. Work through **Modules 1-5** in order\n3. Explore **Tool Demonstrations**\n4. Complete the **Final Exam** (70% to pass)\n\nYour progress is tracked automatically. You can see your completion status on the **Dashboard**.";
  if (/why.*matter|why.*important|benefit|advantage|لماذا.*مهم|فوائد|مزايا/i.test(q)) return isAr ? `**لماذا هذا مهم:**\n\n${ci.whyMatters}` : `**Why This Matters:**\n\n${ci.whyMatters}`;

  return isAr
    ? `سؤال رائع! بناءً على محتوى دورة **${ci.title}**:\n\nتغطي هذه الدورة أساسيات أتمتة الذكاء الاصطناعي وتصميم سير العمل ووكلاء الذكاء الاصطناعي والبرمجة بالوصف وتصميم الحلول مع أمثلة صحية. تتضمن 5 وحدات و6 عروض أدوات واختبار نهائي.\n\nهل يمكنك أن تكون أكثر تحديدًا؟ يمكنني المساعدة في:\n- محتوى الوحدات وأهدافها\n- عروض الأدوات\n- تفاصيل الاختبار\n- مفاهيم الدورة (الأتمتة، سير العمل، الوكلاء، البرمجة بالوصف)\n- الأنشطة والتقدم`
    : `Great question! Based on the **${ci.title}** course content:\n\nThis course covers AI automation fundamentals, workflow design, AI agents, vibe coding, and solution design with healthcare examples. It includes 5 modules, 6 tool demos, and a final exam.\n\nCould you be more specific? I can help with:\n- Module content & objectives\n- Tool demonstrations\n- Exam details\n- Course concepts (automation, workflows, agents, vibe coding)\n- Activities & progress`;
}

function getRateLimit() {
  try {
    const data = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recent = (data.timestamps || []).filter(t => now - t < oneHour);
    return { count: recent.length, timestamps: recent };
  } catch { return { count: 0, timestamps: [] }; }
}
function recordPrompt() {
  const { timestamps } = getRateLimit();
  timestamps.push(Date.now());
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ timestamps }));
}
function getTimeUntilReset() {
  const { timestamps } = getRateLimit();
  if (timestamps.length === 0) return 0;
  const oldest = Math.min(...timestamps);
  const remaining = 60 * 60 * 1000 - (Date.now() - oldest);
  return Math.max(0, Math.ceil(remaining / 60000));
}

const moduleColors = {
  "Module 1": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  "Module 2": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
  "Module 3": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  "Module 4": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  "Module 5": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
  "Tools": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100" },
  "General": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }
};
const moduleOrder = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Tools", "General"];

function GlossaryTab({ t, isRTL, lang }) {
  const [search, setSearch] = useState('');
  const [expandedModule, setExpandedModule] = useState(null);
  const ExpandIcon = isRTL ? ChevronLeft : ChevronRight;
  const currentGlossary = lang === 'ar' ? glossaryAr : glossary;
  const currentModuleColors = lang === 'ar' ? moduleColorsAr : moduleColors;
  const currentModuleOrder = lang === 'ar' ? moduleOrderAr : moduleOrder;

  const filteredGlossary = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return currentGlossary;
    return currentGlossary.filter(item =>
      item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q)
    );
  }, [search, currentGlossary]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredGlossary.forEach(item => {
      if (!groups[item.module]) groups[item.module] = [];
      groups[item.module].push(item);
    });
    return groups;
  }, [filteredGlossary]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchTerms}
            className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-1">{filteredGlossary.length} {t.termsOf} {currentGlossary.length} {t.terms}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
        {filteredGlossary.length === 0 ? (
          <div className="text-center py-10">
            <BookText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">{t.noTermsFound} "{search}"</p>
          </div>
        ) : (
          currentModuleOrder.filter(mod => grouped[mod]).map(mod => {
            const items = grouped[mod];
            const isExpanded = expandedModule === mod || search.trim() !== '';
            const colors = currentModuleColors[mod] || currentModuleColors["General"] || moduleColors["General"];
            return (
              <div key={mod} className="rounded-lg border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedModule(isExpanded && !search ? null : mod)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50/80 hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <Tag className={`w-3 h-3 ${colors.text}`} />
                    <span className="text-xs font-semibold text-slate-700">{mod}</span>
                    <span className="text-[10px] text-slate-400">{items.length}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ExpandIcon className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {isExpanded && (
                  <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto glossary-scroll">
                    {items.map((item, idx) => (
                      <div key={idx} className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="text-xs font-semibold text-slate-800">{item.term}</h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                            {item.module}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function ChatSupport() {
  const { t, isRTL, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const getInitialMessage = (language) => language === 'ar'
    ? "مرحبًا! أنا **وكيل أكاديمية سدايا**. يمكنني الإجابة على أسئلة حول دورة *أتمتة الذكاء الاصطناعي والبرمجة بالوصف*.\n\nاسألني عن الوحدات أو الأدوات أو الأنشطة أو الاختبار أو أي مفهوم في الدورة!\n\n*ملاحظة: يمكنني الإجابة على سؤالين في الساعة. استخدم تبويب القاموس للمصطلحات الرئيسية.*"
    : "Hello! I'm the **SDAIA Academy Agent**. I can answer questions about the *AI Automation and Vibe Coding* course.\n\nAsk me about modules, tools, activities, the exam, or any course concept!\n\n*Note: I can answer 2 questions per hour. Use the Dictionary tab for key terms.*";
  const [messages, setMessages] = useState([
    { role: 'assistant', text: getInitialMessage(lang) },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open && activeTab === 'chat') inputRef.current?.focus();
  }, [open, activeTab]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setTyping(true);

    setTimeout(() => {
      const { count } = getRateLimit();
      if (count >= MAX_PROMPTS_PER_HOUR) {
        const mins = getTimeUntilReset();
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: `You've reached the limit of **${MAX_PROMPTS_PER_HOUR} questions per hour**. Please try again in about **${mins} minute${mins !== 1 ? 's' : ''}**.\n\nIn the meantime, you can explore the course modules and activities directly!`,
          isRateLimit: true,
        }]);
        setTyping(false);
        return;
      }
      if (!isCourseRelated(text)) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: "I'm sorry, but that question doesn't appear to be related to the **AI Automation and Vibe Coding** course.\n\nI can only help with course-related topics such as:\n- Module content & concepts\n- Tool demonstrations\n- Exam & activities\n- Automation, workflows, AI agents, vibe coding\n\nPlease ask a course-related question!",
          isOffTopic: true,
        }]);
        setTyping(false);
        return;
      }
      const answer = generateAnswer(text, lang);
      recordPrompt();
      const { count: newCount } = getRateLimit();
      const remaining = MAX_PROMPTS_PER_HOUR - newCount;
      setMessages(prev => [...prev, { role: 'assistant', text: answer, remaining }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      let html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      if (html.startsWith('- ')) html = `<span class="flex gap-1.5"><span class="text-cyan-500 shrink-0">•</span><span>${html.slice(2)}</span></span>`;
      if (/^\d+\.\s/.test(html)) html = `<span class="flex gap-1.5"><span class="text-cyan-500 font-semibold shrink-0">${html.match(/^\d+/)[0]}.</span><span>${html.replace(/^\d+\.\s/, '')}</span></span>`;
      return <div key={i} className={line === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
    });
  };

  const { count } = getRateLimit();
  const remaining = MAX_PROMPTS_PER_HOUR - count;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t.chat}
        className={`fixed bottom-6 ${isRTL ? 'left-5' : 'right-5'} z-[9998] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          open
            ? 'bg-slate-700 text-white shadow-slate-400/30'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && remaining > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-white">
            {remaining}
          </span>
        )}
      </button>

      {open && (
        <div className={`fixed bottom-24 ${isRTL ? 'left-5' : 'right-5'} z-[9999] w-[360px] sm:w-[400px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up`}>
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-4 pt-3.5 pb-0 text-white shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm">{t.sdaiaAcademyAgent}</h4>
                <p className="text-[11px] text-cyan-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {t.courseAssistant}
                  <span className="mx-1">·</span>
                  <Clock className="w-3 h-3 inline" />
                  {remaining > 0 ? `${remaining} ${t.left}` : t.limitReached}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-cyan-700'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {t.chat}
              </button>
              <button
                onClick={() => setActiveTab('glossary')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-semibold transition-all ${
                  activeTab === 'glossary'
                    ? 'bg-white text-violet-700'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <BookText className="w-3.5 h-3.5" />
                {t.dictionary}
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">{glossary.length}</span>
              </button>
            </div>
          </div>

          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '260px', maxHeight: '48vh' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-cyan-100'
                        : msg.isRateLimit ? 'bg-amber-100' : msg.isOffTopic ? 'bg-red-100' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    }`}>
                      {msg.role === 'user'
                        ? <User className="w-3.5 h-3.5 text-cyan-700" />
                        : msg.isRateLimit ? <Clock className="w-3.5 h-3.5 text-amber-600" />
                        : msg.isOffTopic ? <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        : <Sparkles className="w-3.5 h-3.5 text-white" />
                      }
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-md'
                        : msg.isRateLimit ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-bl-md'
                        : msg.isOffTopic ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}>
                      {msg.role === 'user' ? msg.text : renderText(msg.text)}
                      {msg.remaining !== undefined && msg.remaining >= 0 && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {msg.remaining} question{msg.remaining !== 1 ? 's' : ''} remaining this hour
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {(lang === 'ar' 
                    ? ['ما هي هذه الدورة؟', 'كم عدد الوحدات؟', 'ما الأدوات المغطاة؟', 'تفاصيل الاختبار']
                    : ['What is this course about?', 'How many modules?', 'What tools are covered?', 'Exam details']
                  ).map(q => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); setTimeout(sendMessage, 50); }}
                      className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full text-[11px] font-medium border border-cyan-100 hover:bg-cyan-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={remaining > 0 ? t.askAboutCourse : t.limitReachedTryLater}
                    disabled={remaining <= 0 || typing}
                    className={`flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || remaining <= 0 || typing}
                    className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                  >
                    <Send className="w-4 h-4 rtl-flip" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'glossary' && (
            <div className="flex-1 overflow-hidden" style={{ minHeight: '320px', maxHeight: '55vh' }}>
              <GlossaryTab t={t} isRTL={isRTL} lang={lang} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
