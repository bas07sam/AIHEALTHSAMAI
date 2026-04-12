import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Zap, Cpu, ArrowRight, ArrowLeft, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, RotateCcw, Lightbulb, Target,
  Clock, FileText, Cog, Brain, Sparkles, Bot, Eye,
  Send, Database, AlertTriangle, TrendingUp, Layers,
  Play, Pause
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   InteractiveSlide — Replaces PDF slides with rich interactive
   content for Module 1: Introduction to AI Automation
   Fully bilingual: Arabic + English
   ═══════════════════════════════════════════════════════════════ */

/* ── Slide 1: Title / Cover ── */
function Slide1() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const tags = isAr ? ['الكفاءة', 'الذكاء', 'سير العمل', 'التوسع'] : ['Efficiency', 'Intelligence', 'Workflow', 'Scalability'];

  return (
    <div className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-6">
        <Cpu className="w-4 h-4" /> {isAr ? 'الوحدة الأولى' : 'Module 1'}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-relaxed">
        {isAr ? 'مدخل إلى' : 'Introduction to'}<br />
        <span className={`bg-clip-text text-transparent ${isAr ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-600 to-teal-600`}>
          {isAr ? 'أتمتة الذكاء الاصطناعي' : 'AI Automation'}
        </span>
      </h1>
      <p className="text-lg text-slate-500 mb-4 max-w-lg mx-auto">
        {isAr ? 'الأساسيات، الأنواع، والفرق بين الأنظمة التقليدية والذكاء الاصطناعي' : 'Fundamentals, Types, and the Difference Between Traditional and AI Systems'}
      </p>
      <div className="max-w-md mx-auto mb-6">
        <img src="/images/slide-automation-concept.png" alt={isAr ? 'مفهوم الأتمتة' : 'Automation Concept'} className="rounded-xl shadow-md border border-slate-200 w-full" />
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {tags.map((tag, i) => (
          <span key={i} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium border border-slate-200"
            style={{ animationDelay: `${i * 150}ms`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 2: What is Automation? ── */
function Slide2() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [step, setStep] = useState(0);
  const manual = isAr
    ? ['استقبال الطلب يدوياً', 'إدخال البيانات في النظام', 'مراجعة البيانات', 'إرسال تأكيد بالبريد', 'تحديث السجل']
    : ['Receive request manually', 'Enter data into system', 'Review data', 'Send confirmation email', 'Update records'];
  const auto = isAr
    ? ['استقبال الطلب تلقائياً', 'إدخال + مراجعة + تأكيد + تحديث (تلقائي)']
    : ['Receive request automatically', 'Enter + Review + Confirm + Update (automatic)'];

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % (manual.length + auto.length + 2)), 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-5">
        <h3 className="font-bold text-cyan-800 text-lg mb-1">{isAr ? 'ما هي الأتمتة؟' : 'What is Automation?'}</h3>
        <p className="text-cyan-700 text-sm leading-relaxed">
          {isAr
            ? <>الأتمتة تعني استخدام التكنولوجيا لأداء المهام <strong>بأقل تدخل بشري</strong>.</>
            : <>Automation means using technology to perform tasks with <strong>minimal human intervention</strong>.</>}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
        <p className="text-slate-600 text-sm italic text-center mb-4">
          {isAr
            ? '\u201Cبدلاً من إكمال كل خطوة يدوياً، يقوم النظام بمعالجة العمل تلقائياً\u201D'
            : '\u201CInstead of completing each step manually, the system processes work automatically\u201D'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Manual */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-bold text-red-700 text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {isAr ? 'العملية اليدوية' : 'Manual Process'}
          </h4>
          <div className="space-y-2">
            {manual.map((s, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-300 ${step === i ? 'bg-red-100 ring-2 ring-red-300 scale-[1.02]' : 'bg-white border border-red-100'}`}>
                <span className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                <span className="text-red-800">{s}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-red-400 mt-2 text-center">{isAr ? '⏱ 5 خطوات يدوية' : '⏱ 5 manual steps'}</p>
        </div>

        {/* Automated */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <h4 className="font-bold text-emerald-700 text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> {isAr ? 'سير العمل المؤتمت' : 'Automated Workflow'}
          </h4>
          <div className="space-y-2">
            {auto.map((s, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-300 ${step >= manual.length && step - manual.length === i ? 'bg-emerald-100 ring-2 ring-emerald-300 scale-[1.02]' : 'bg-white border border-emerald-100'}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                <span className="text-emerald-800">{s}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 text-center">{isAr ? '⚡ خطوتان فقط!' : '⚡ Only 2 steps!'}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Slide 3: Why Automation Matters ── */
function Slide3() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [activeIdx, setActiveIdx] = useState(null);
  const reasons = isAr ? [
    { icon: Clock, title: 'توفير الوقت', desc: 'تقليل الجهد اليدوي، مما يسمح بإنجاز المهام بشكل فوري.', color: 'bg-blue-500' },
    { icon: AlertTriangle, title: 'تقليل الأخطاء', desc: 'القضاء على الأخطاء البشرية مثل الأخطاء المطبعية أو نسيان الخطوات.', color: 'bg-red-500' },
    { icon: CheckCircle2, title: 'تحسين الاتساق', desc: 'ضمان أن كل عملية تتبع نفس المعايير بدقة.', color: 'bg-emerald-500' },
    { icon: TrendingUp, title: 'تسريع العمليات', desc: 'تسريع سير العمل عن طريق إزالة نقاط الاختناق والتأخير.', color: 'bg-amber-500' },
    { icon: Lightbulb, title: 'التركيز على القيمة', desc: 'تمكين الأفراد من التركيز على الاستراتيجية، والإبداع، وحل المشكلات.', color: 'bg-violet-500' },
  ] : [
    { icon: Clock, title: 'Save Time', desc: 'Reduce manual effort, allowing tasks to be completed instantly.', color: 'bg-blue-500' },
    { icon: AlertTriangle, title: 'Reduce Errors', desc: 'Eliminate human mistakes such as typos or missed steps.', color: 'bg-red-500' },
    { icon: CheckCircle2, title: 'Improve Consistency', desc: 'Ensure every process follows the same standards precisely.', color: 'bg-emerald-500' },
    { icon: TrendingUp, title: 'Speed Up Processes', desc: 'Accelerate workflows by removing bottlenecks and delays.', color: 'bg-amber-500' },
    { icon: Lightbulb, title: 'Focus on Value', desc: 'Enable people to focus on strategy, creativity, and problem-solving.', color: 'bg-violet-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">{isAr ? 'لماذا الأتمتة مهمة؟' : 'Why Does Automation Matter?'}</h2>
      <p className="text-xs text-slate-400 text-center mb-4">{isAr ? 'اضغط على كل سبب لمعرفة المزيد' : 'Click each reason to learn more'}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Reasons list */}
        <div className="space-y-2.5">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            const isActive = activeIdx === i;
            return (
              <button key={i} onClick={() => setActiveIdx(isActive ? null : i)}
                className={`w-full ${isAr ? 'text-right' : 'text-left'} p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${isActive ? 'bg-white shadow-md border-cyan-300 ring-1 ring-cyan-200' : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-sm'}`}>
                <div className={`w-9 h-9 ${r.color} rounded-xl flex items-center justify-center shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-slate-800 text-sm">{r.title}</span>
                  <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src="/images/slide-why-automation.png" alt={isAr ? 'أهمية الأتمتة' : 'Why Automation Matters'} className="rounded-xl shadow-sm border border-slate-200 w-full max-w-sm" />
        </div>
      </div>

      <div className={`p-3 ${isAr ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl`}>
        <p className="text-xs text-cyan-700 text-center leading-relaxed">
          {isAr
            ? '\u201Cالأتمتة لا تقتصر على إنجاز العمل بشكل أسرع، بل تهدف إلى تحسين الكفاءة، وزيادة الاعتمادية، وتعزيز قابلية التوسع.\u201D'
            : '\u201CAutomation is not just about getting work done faster — it\'s about improving efficiency, reliability, and scalability.\u201D'}
        </p>
      </div>
    </div>
  );
}

/* ── Slide 4: Traditional vs AI Automation (interactive comparison) ── */
function Slide4() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [selected, setSelected] = useState(null);
  const trad = isAr ? {
    title: 'الأتمتة التقليدية', subtitle: 'منطق قائم على القواعد',
    items: ['تتبع قواعد ثابتة ("إذا حدث س، افعل ص")', 'الأفضل للمهام الهيكلية والمكررة', 'قدرة محدودة على التعامل مع الغموض'],
    example: 'إذا تم تقديم النموذج ← أرسل بريداً', color: 'indigo',
  } : {
    title: 'Traditional Automation', subtitle: 'Rule-based logic',
    items: ['Follows fixed rules ("if X, then Y")', 'Best for structured, repetitive tasks', 'Limited ability to handle ambiguity'],
    example: 'If form submitted → Send email', color: 'indigo',
  };
  const ai = isAr ? {
    title: 'أتمتة الذكاء الاصطناعي', subtitle: 'مدركة للسياق',
    items: ['تستخدم الذكاء لاتخاذ القرار', 'تتعامل مع البيانات غير المهيكلة (نصوص/صور)', 'تتكيف مع تغير السياق'],
    example: '1. قراءة وفهم الطلب → 2. تحديد أفضل استجابة', color: 'cyan',
  } : {
    title: 'AI Automation', subtitle: 'Context-aware',
    items: ['Uses intelligence for decision-making', 'Handles unstructured data (text/images)', 'Adapts to changing context'],
    example: '1. Read & understand request → 2. Determine best response', color: 'cyan',
  };

  const renderSide = (data, key) => {
    const isSelected = selected === key;
    const borderColor = data.color === 'indigo' ? 'border-indigo-300 ring-indigo-200' : 'border-cyan-300 ring-cyan-200';
    const bgColor = data.color === 'indigo' ? 'bg-indigo-50' : 'bg-cyan-50';
    const textColor = data.color === 'indigo' ? 'text-indigo-700' : 'text-cyan-700';
    const iconBg = data.color === 'indigo' ? 'bg-indigo-500' : 'bg-cyan-500';

    return (
      <button onClick={() => setSelected(key === selected ? null : key)}
        className={`${isAr ? 'text-right' : 'text-left'} w-full p-4 rounded-xl border-2 transition-all duration-300 ${isSelected ? `${bgColor} ${borderColor} ring-2 shadow-md` : 'bg-white border-slate-200 hover:shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
            {data.color === 'indigo' ? <Cog className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h4 className={`font-bold text-sm ${textColor}`}>{data.title}</h4>
            <p className="text-[10px] text-slate-400">{data.subtitle}</p>
          </div>
        </div>
        <ul className="space-y-1.5 mb-3">
          {data.items.map((item, i) => (
            <li key={i} className={`text-xs leading-relaxed flex items-start gap-1.5 ${isSelected ? textColor : 'text-slate-600'}`}>
              <span className="mt-1">•</span>{item}
            </li>
          ))}
        </ul>
        <div className={`p-2 rounded-lg text-[11px] font-mono ${isSelected ? (data.color === 'indigo' ? 'bg-indigo-100 text-indigo-800' : 'bg-cyan-100 text-cyan-800') : 'bg-slate-100 text-slate-600'}`}>
          <span className="font-bold">{isAr ? 'مثال: ' : 'Example: '}</span>{data.example}
        </div>
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">{isAr ? 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي' : 'Traditional vs AI Automation'}</h2>
      <p className="text-xs text-slate-400 text-center mb-4">{isAr ? 'اضغط على كل جانب للمقارنة' : 'Click each side to compare'}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {renderSide(trad, 'trad')}
        {renderSide(ai, 'ai')}
      </div>
      {/* Illustration */}
      <div className="max-w-sm mx-auto mb-4">
        <img src="/images/slide-trad-vs-ai.png" alt={isAr ? 'الأتمتة التقليدية مقابل الذكاء الاصطناعي' : 'Traditional vs AI Automation'} className="rounded-xl shadow-sm border border-slate-200 w-full" />
      </div>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-xs text-amber-700">
          {isAr
            ? <><strong>💡 المهام المتوقعة</strong> تستخدم القواعد. <strong>المهام المتنوعة والمعقدة</strong> تتطلب الذكاء الاصطناعي.</>
            : <><strong>💡 Predictable tasks</strong> use rules. <strong>Diverse, complex tasks</strong> require AI.</>}
        </p>
      </div>
    </div>
  );
}

/* ── Slide 5: Types of Automation Overview ── */
function Slide5() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [activeType, setActiveType] = useState(0);
  const types = isAr ? [
    { num: 1, title: 'أتمتة المهام', desc: 'تركز على إجراء واحد معزول أو مهمة محددة.', badge: 'خطوة واحدة', icon: FileText, color: 'cyan', gradient: 'from-cyan-500 to-cyan-600' },
    { num: 2, title: 'أتمتة العمليات', desc: 'تربط خطوات متعددة معاً في سير عمل موحد.', badge: 'تدفق متعدد الخطوات', icon: Layers, color: 'violet', gradient: 'from-violet-500 to-violet-600' },
    { num: 3, title: 'الأتمتة الذكية', desc: 'تجمع بين الأتمتة وقدرات الذكاء الاصطناعي لاتخاذ القرارات.', badge: 'أتمتة + ذكاء اصطناعي', icon: Brain, color: 'amber', gradient: 'from-amber-500 to-amber-600' },
  ] : [
    { num: 1, title: 'Task Automation', desc: 'Focuses on a single isolated action or specific task.', badge: 'Single step', icon: FileText, color: 'cyan', gradient: 'from-cyan-500 to-cyan-600' },
    { num: 2, title: 'Process Automation', desc: 'Links multiple steps together into a unified workflow.', badge: 'Multi-step flow', icon: Layers, color: 'violet', gradient: 'from-violet-500 to-violet-600' },
    { num: 3, title: 'Intelligent Automation', desc: 'Combines automation with AI capabilities for decision-making.', badge: 'Automation + AI', icon: Brain, color: 'amber', gradient: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">{isAr ? 'أنواع الأتمتة: نظرة عامة' : 'Types of Automation: Overview'}</h2>
      <p className="text-xs text-slate-400 text-center mb-5">{isAr ? 'فهم مستويات التعقيد والذكاء الثلاثة في الأتمتة' : 'Understand the three levels of complexity and intelligence in automation'}</p>

      {/* Complexity bar */}
      <div className="flex items-center gap-1 mb-5 px-4">
        <span className="text-[10px] text-slate-400">{isAr ? 'بسيط' : 'Simple'}</span>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {types.map((t, i) => (
            <button key={i} onClick={() => setActiveType(i)}
              className={`flex-1 transition-all duration-500 cursor-pointer ${activeType === i ? `bg-gradient-to-l ${t.gradient} scale-y-125` : 'bg-slate-200 hover:bg-slate-300'}`}
              style={{ borderRadius: i === 0 ? '999px 0 0 999px' : i === 2 ? '0 999px 999px 0' : '' }} />
          ))}
        </div>
        <span className="text-[10px] text-slate-400">{isAr ? 'متقدم' : 'Advanced'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Type cards */}
        <div className="grid grid-cols-1 gap-3">
          {types.map((t, i) => {
            const Icon = t.icon;
            const isActive = activeType === i;
            return (
              <button key={i} onClick={() => setActiveType(i)}
                className={`${isAr ? 'text-right' : 'text-left'} p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${isActive ? `bg-gradient-to-br ${t.gradient} text-white border-transparent shadow-lg scale-[1.02]` : 'bg-white border-slate-200 hover:shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                      {isAr ? `النوع ${t.num}` : `Type ${t.num}`}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{t.badge}</span>
                  </div>
                  <h4 className={`font-bold text-sm mb-0.5 ${isActive ? '' : 'text-slate-800'}`}>{t.title}</h4>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src="/images/slide-automation-types.png" alt={isAr ? 'أنواع الأتمتة الثلاثة' : 'Three Types of Automation'} className="rounded-xl shadow-sm border border-slate-200 w-full max-w-sm" />
        </div>
      </div>
    </div>
  );
}

/* ── Slide 6: Task Automation Detail ── */
function Slide6() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [flipped, setFlipped] = useState([]);
  const examples = isAr ? [
    { icon: '📧', title: 'إرسال بريد تأكيد', desc: 'رد تلقائي عند إرسال النموذج' },
    { icon: '📊', title: 'حفظ في جدول البيانات', desc: 'تسجيل الردود فورياً' },
    { icon: '📅', title: 'إنشاء موعد في التقويم', desc: 'جدولة الاجتماعات تلقائياً' },
    { icon: '📄', title: 'إنشاء تقرير', desc: 'تجميع المقاييس اليومية في PDF' },
  ] : [
    { icon: '📧', title: 'Send Confirmation Email', desc: 'Auto-reply when form is submitted' },
    { icon: '📊', title: 'Save to Spreadsheet', desc: 'Log responses instantly' },
    { icon: '📅', title: 'Create Calendar Event', desc: 'Schedule meetings automatically' },
    { icon: '📄', title: 'Generate Report', desc: 'Compile daily metrics into PDF' },
  ];

  const chips = isAr
    ? ['تنفيذ خطوة واحدة', 'نطاق محدد بوضوح', 'سهلة وسريعة التنفيذ', 'تُفعّل بواسطة حدث بسيط']
    : ['Single-step execution', 'Clearly defined scope', 'Easy & fast to implement', 'Triggered by a simple event'];

  const toggleFlip = (i) => {
    setFlipped(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] text-cyan-500 font-bold">{isAr ? 'النوع 1 من 3' : 'Type 1 of 3'}</span>
          <h2 className="text-xl font-bold text-slate-800">{isAr ? 'أتمتة المهام' : 'Task Automation'}</h2>
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 mb-4">
        <p className="text-sm text-cyan-800 leading-relaxed">
          {isAr
            ? <>تركز على تنفيذ <strong>إجراء واحد</strong> أو مهمة محددة. تُعدّ أبسط أشكال الأتمتة.</>
            : <>Focuses on executing a <strong>single action</strong> or specific task. It is the simplest form of automation.</>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {chips.map((c, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                ✓ {c}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mb-3">{isAr ? '🔄 اقلب البطاقات لرؤية الأمثلة' : '🔄 Flip the cards to see examples'}</p>
          <div className="grid grid-cols-2 gap-3">
            {examples.map((ex, i) => (
              <button key={i} onClick={() => toggleFlip(i)}
                className={`relative p-3 rounded-xl border-2 min-h-[90px] text-center transition-all duration-300 ${flipped.includes(i) ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-200 hover:border-cyan-300'}`}>
                {!flipped.includes(i) ? (
                  <>
                    <span className="text-2xl block mb-1">{ex.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{ex.title}</span>
                  </>
                ) : (
                  <span className="text-xs font-medium">{ex.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src="/images/slide-task-automation.png" alt={isAr ? 'أتمتة المهام' : 'Task Automation'} className="rounded-xl shadow-sm border border-slate-200 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

/* ── Slide 7: Process Automation ── */
function Slide7() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [activeFlow, setActiveFlow] = useState(0);
  const flows = isAr ? [
    {
      title: 'سير عمل الموارد البشرية',
      steps: ['إرسال نموذج', 'موافقة', 'إشعار', 'تحديث السجل'],
      colors: ['bg-violet-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'],
    },
    {
      title: 'معالجة الطلبات',
      steps: ['استلام طلب', 'تأكيد الدفع', 'إرسال فاتورة', 'بدء التوصيل'],
      colors: ['bg-cyan-500', 'bg-indigo-500', 'bg-orange-500', 'bg-emerald-500'],
    },
  ] : [
    {
      title: 'HR Workflow',
      steps: ['Submit Form', 'Approval', 'Notification', 'Update Record'],
      colors: ['bg-violet-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500'],
    },
    {
      title: 'Order Processing',
      steps: ['Receive Order', 'Confirm Payment', 'Send Invoice', 'Start Delivery'],
      colors: ['bg-cyan-500', 'bg-indigo-500', 'bg-orange-500', 'bg-emerald-500'],
    },
  ];

  const [animStep, setAnimStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setAnimStep(s => (s + 1) % 5), 1000);
    return () => clearInterval(timer);
  }, [activeFlow]);

  const FlowArrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] text-violet-500 font-bold">{isAr ? 'النوع 2 من 3' : 'Type 2 of 3'}</span>
          <h2 className="text-xl font-bold text-slate-800">{isAr ? 'أتمتة العمليات' : 'Process Automation'}</h2>
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 mb-4">
        <p className="text-sm text-violet-800 leading-relaxed">
          {isAr
            ? <>تربط <strong>عدة خطوات</strong> ضمن سير عمل متكامل، بدلاً من أتمتة مهمة واحدة فقط بشكل منعزل.</>
            : <>Links <strong>multiple steps</strong> into a unified workflow, instead of automating a single task in isolation.</>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          {/* Flow selector */}
          <div className="flex gap-2 mb-4">
            {flows.map((f, i) => (
              <button key={i} onClick={() => { setActiveFlow(i); setAnimStep(0); }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeFlow === i ? 'bg-violet-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f.title}
              </button>
            ))}
          </div>

          {/* Animated flow */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
              {flows[activeFlow].steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`flex-1 p-2 rounded-lg text-center transition-all duration-500 ${animStep > i ? `${flows[activeFlow].colors[i]} text-white shadow-md scale-105` : animStep === i ? `${flows[activeFlow].colors[i]} text-white shadow-lg scale-110 ring-2 ring-offset-1 ring-white` : 'bg-slate-100 text-slate-500'}`}>
                    <span className="text-[10px] font-bold block">{step}</span>
                  </div>
                  {i < flows[activeFlow].steps.length - 1 && (
                    <FlowArrow className={`w-3 h-3 shrink-0 transition-all ${animStep > i ? 'text-violet-500' : 'text-slate-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-2 bg-violet-50 border border-violet-100 rounded-lg text-center">
            <p className="text-[11px] text-violet-600">
              <strong>{isAr ? 'الرسالة الرئيسية:' : 'Key Message:'}</strong> {isAr ? 'أتمتة العمليات تُحسّن كفاءة سير العمل من البداية إلى النهاية.' : 'Process automation improves end-to-end workflow efficiency.'}
            </p>
          </div>
        </div>
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src="/images/slide-process-automation.png" alt={isAr ? 'أتمتة العمليات' : 'Process Automation'} className="rounded-xl shadow-sm border border-slate-200 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

/* ── Slide 8: Intelligent Automation ── */
function Slide8() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const inputs = isAr ? [
    { icon: '📧', label: 'بريد غير مهيكل', type: 'email' },
    { icon: '📷', label: 'صورة طبية', type: 'image' },
    { icon: '💬', label: 'رسالة مريض', type: 'message' },
  ] : [
    { icon: '📧', label: 'Unstructured Email', type: 'email' },
    { icon: '📷', label: 'Medical Image', type: 'image' },
    { icon: '💬', label: 'Patient Message', type: 'message' },
  ];
  const outputs = isAr ? {
    email: { action: 'تصنيف وتوجيه', priority: 'عالية', icon: '🏷️' },
    image: { action: 'تحليل واكتشاف شذوذ', priority: 'حرجة', icon: '🔬' },
    message: { action: 'تلخيص واقتراح إجراء', priority: 'متوسطة', icon: '📝' },
  } : {
    email: { action: 'Classify & Route', priority: 'High', icon: '🏷️' },
    image: { action: 'Analyze & Detect Anomaly', priority: 'Critical', icon: '🔬' },
    message: { action: 'Summarize & Suggest Action', priority: 'Medium', icon: '📝' },
  };

  const chips = isAr
    ? ['تتضمن اتخاذ القرار بالذكاء الاصطناعي', 'تتعامل مع مدخلات معقدة', 'مناسبة حيث لا تكفي القواعد', 'تجمع بين التنفيذ والفهم والذكاء']
    : ['Includes AI decision-making', 'Handles complex inputs', 'Suitable when rules are not enough', 'Combines execution, understanding & intelligence'];

  const handleProcess = (type) => {
    setProcessing(true);
    setResult(null);
    setTimeout(() => {
      setProcessing(false);
      setResult(outputs[type]);
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] text-amber-500 font-bold">{isAr ? 'النوع 3 من 3' : 'Type 3 of 3'}</span>
          <h2 className="text-xl font-bold text-slate-800">{isAr ? 'الأتمتة الذكية' : 'Intelligent Automation'}</h2>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
        <p className="text-sm text-amber-800 leading-relaxed">
          {isAr
            ? <>تجمع بين الأتمتة وقدرات الذكاء الاصطناعي مثل <strong>الفهم، والتنبؤ، والتصنيف</strong>، وتوليد المخرجات.</>
            : <>Combines automation with AI capabilities like <strong>understanding, predicting, classifying</strong>, and generating outputs.</>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          {/* Interactive demo */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-3">
            <p className="text-xs text-slate-500 mb-3 text-center">{isAr ? '🧪 جرّب: اختر مدخلاً لترى كيف يعالجه الذكاء الاصطناعي' : '🧪 Try: Select an input to see how AI processes it'}</p>
            <div className="flex gap-3 justify-center mb-4">
              {inputs.map((inp, i) => (
                <button key={i} onClick={() => handleProcess(inp.type)}
                  className="p-3 rounded-xl border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-center min-w-[90px]">
                  <span className="text-2xl block mb-1">{inp.icon}</span>
                  <span className="text-[10px] text-slate-600 font-medium">{inp.label}</span>
                </button>
              ))}
            </div>

            {/* Processing animation */}
            {processing && (
              <div className="flex items-center justify-center gap-2 p-4">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-amber-600 font-medium">{isAr ? 'الذكاء الاصطناعي يحلل...' : 'AI analyzing...'}</span>
              </div>
            )}

            {/* Result */}
            {result && !processing && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{result.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">{result.action}</p>
                    <p className="text-xs text-emerald-600">{isAr ? 'الأولوية' : 'Priority'}: <strong>{result.priority}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-medium border border-amber-200">
                ✓ {c}
              </span>
            ))}
          </div>
        </div>
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src="/images/slide-intelligent-automation.png" alt={isAr ? 'الأتمتة الذكية' : 'Intelligent Automation'} className="rounded-xl shadow-sm border border-slate-200 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}

/* ── Slide 9: Summary Recap ── */
function Slide9() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [quizAnswers, setQuizAnswers] = useState({});
  const quiz = isAr ? [
    { q: 'الأتمتة تعني:', options: ['كتابة الكود يدوياً', 'استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري', 'إلغاء التكنولوجيا'], correct: 1 },
    { q: 'الأتمتة التقليدية تعتمد على:', options: ['السياق والتكيف', 'قواعد ثابتة (إذا/إذن)', 'التعلم العميق'], correct: 1 },
    { q: 'الأتمتة الذكية تجمع بين:', options: ['الأتمتة + الذكاء الاصطناعي', 'الأتمتة + العمل اليدوي', 'البريد + التقويم'], correct: 0 },
  ] : [
    { q: 'Automation means:', options: ['Writing code manually', 'Using technology to perform tasks with minimal human intervention', 'Eliminating technology'], correct: 1 },
    { q: 'Traditional automation relies on:', options: ['Context and adaptation', 'Fixed rules (if/then)', 'Deep learning'], correct: 1 },
    { q: 'Intelligent automation combines:', options: ['Automation + AI', 'Automation + Manual work', 'Email + Calendar'], correct: 0 },
  ];

  const keyPoints = isAr ? [
    { title: 'ما هي الأتمتة؟', desc: 'استخدام التكنولوجيا لأداء المهام بأقل تدخل بشري.', color: 'bg-cyan-500' },
    { title: 'التقليدية vs الذكية', desc: 'التقليدية تتبع قواعد ثابتة، بينما الذكية تستخدم السياق.', color: 'bg-violet-500' },
    { title: 'الأنواع الثلاثة', desc: '1. المهام  2. العمليات  3. الذكية', color: 'bg-amber-500' },
  ] : [
    { title: 'What is Automation?', desc: 'Using technology to perform tasks with minimal human intervention.', color: 'bg-cyan-500' },
    { title: 'Traditional vs Intelligent', desc: 'Traditional follows fixed rules, while intelligent uses context.', color: 'bg-violet-500' },
    { title: 'Three Types', desc: '1. Task  2. Process  3. Intelligent', color: 'bg-amber-500' },
  ];

  const handleAnswer = (qIdx, aIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const score = Object.keys(quizAnswers).filter(k => quizAnswers[k] === quiz[k].correct).length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">{isAr ? 'ملخص القسم' : 'Section Summary'}</h2>
      <p className="text-xs text-slate-400 text-center mb-4">{isAr ? 'اختبر فهمك بالإجابة على الأسئلة' : 'Test your understanding by answering the questions'}</p>

      {/* Key points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {keyPoints.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
            <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">{item.title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick quiz */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> {isAr ? 'اختبار سريع' : 'Quick Quiz'}
        </h3>
        <div className="space-y-4">
          {quiz.map((q, qi) => (
            <div key={qi}>
              <p className="text-xs font-bold text-slate-700 mb-2">{qi + 1}. {q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const answered = quizAnswers[qi] !== undefined;
                  const isCorrect = oi === q.correct;
                  const isSelected = quizAnswers[qi] === oi;
                  return (
                    <button key={oi} onClick={() => !answered && handleAnswer(qi, oi)}
                      disabled={answered}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                        answered
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                            : isSelected
                              ? 'bg-red-100 border-red-400 text-red-700'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50'
                      }`}>
                      {answered && isCorrect && <CheckCircle2 className="w-3 h-3 inline me-1" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-3 h-3 inline me-1" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {Object.keys(quizAnswers).length === quiz.length && (
          <div className={`mt-3 p-2 rounded-lg text-center text-sm font-bold ${score === quiz.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {score === quiz.length
              ? (isAr ? '🎉 ممتاز! إجابات صحيحة بالكامل!' : '🎉 Excellent! All answers correct!')
              : (isAr ? `النتيجة: ${score}/${quiz.length} — حاول مرة أخرى!` : `Score: ${score}/${quiz.length} — Try again!`)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Slide 10: Coming Up Next ── */
function Slide10() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [hovered, setHovered] = useState(null);
  const preview = isAr ? [
    { icon: Zap, label: 'المحفز', desc: 'عندما يحدث هذا...', color: 'bg-violet-500' },
    { icon: Cog, label: 'الإجراء', desc: 'قم بهذه المهمة...', color: 'bg-cyan-500' },
    { icon: Send, label: 'المخرج', desc: 'النتيجة المتحققة', color: 'bg-emerald-500' },
  ] : [
    { icon: Zap, label: 'Trigger', desc: 'When this happens...', color: 'bg-violet-500' },
    { icon: Cog, label: 'Action', desc: 'Do this task...', color: 'bg-cyan-500' },
    { icon: Send, label: 'Output', desc: 'The achieved result', color: 'bg-emerald-500' },
  ];

  const NextArrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
        <NextArrow className="w-4 h-4" /> {isAr ? 'القادم' : 'Up Next'}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{isAr ? 'التفكير بمنهجية سير العمل' : 'Workflow Thinking'}</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        {isAr
          ? 'الآن بعد أن فهمنا أساسيات الأتمتة، سنتعلم كيف ننظّم الأنشطة المؤتمتة في تسلسلات منطقية.'
          : 'Now that we understand the basics of automation, we will learn how to organize automated activities into logical sequences.'}
      </p>

      <p className="text-xs text-slate-400 mb-4">{isAr ? 'نظرة عامة على الدرس القادم: معادلة سير العمل' : 'Next lesson overview: The Workflow Equation'}</p>

      <div className="flex items-center justify-center gap-4">
        {preview.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex items-center gap-3"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div className={`p-4 rounded-xl transition-all duration-300 ${hovered === i ? `${p.color} text-white shadow-lg scale-110` : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-bold block">{p.label}</span>
                <span className={`text-[10px] block mt-1 ${hovered === i ? 'text-white/80' : 'text-slate-400'}`}>{p.desc}</span>
              </div>
              {i < preview.length - 1 && <NextArrow className="w-4 h-4 text-slate-300" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl inline-block">
        <p className="text-sm text-emerald-700 font-semibold">
          {isAr ? '✅ الأساس اكتمل. جاهز للخطوات التالية!' : '✅ Foundation complete. Ready for the next steps!'}
        </p>
      </div>
    </div>
  );
}

/* ── SLIDES REGISTRY ── */
const INTERACTIVE_SLIDES = {
  'section-1': [
    { component: Slide1, label: 'مدخل إلى أتمتة الذكاء الاصطناعي', labelEn: 'Introduction to AI Automation' },
    { component: Slide2, label: 'ما هي الأتمتة؟', labelEn: 'What is Automation?' },
    { component: Slide3, label: 'أهمية الأتمتة', labelEn: 'Why Automation Matters' },
    { component: Slide4, label: 'التقليدية vs الذكاء الاصطناعي', labelEn: 'Traditional vs AI' },
    { component: Slide5, label: 'أنواع الأتمتة', labelEn: 'Types of Automation' },
    { component: Slide6, label: 'أتمتة المهام', labelEn: 'Task Automation' },
    { component: Slide7, label: 'أتمتة العمليات', labelEn: 'Process Automation' },
    { component: Slide8, label: 'الأتمتة الذكية', labelEn: 'Intelligent Automation' },
    { component: Slide9, label: 'ملخص واختبار', labelEn: 'Summary & Quiz' },
  ],
};

export { INTERACTIVE_SLIDES, Slide10 as WhatsNextSlide };

/* ── Main InteractiveSlide component ── */
export default function InteractiveSlide({ sectionId, slideIndex }) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const slides = INTERACTIVE_SLIDES[sectionId];
  if (!slides || !slides[slideIndex]) return null;

  const SlideComponent = slides[slideIndex].component;
  return (
    <div className={`max-w-3xl mx-auto ${isAr ? 'font-arabic' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      <SlideComponent />
    </div>
  );
}
