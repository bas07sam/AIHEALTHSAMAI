import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { sections, sectionsAr, tools, toolsAr } from '../data/courseData';
import PdfSingleSlide from '../components/PdfSingleSlide';
import MatchActivity from '../components/MatchActivity';
import FlashcardActivity from '../components/FlashcardActivity';
import DragDropActivity from '../components/DragDropActivity';
import QuizComponent from '../components/QuizComponent';
import AnimatedSlide from '../components/AnimatedSlide';
import InteractiveSlide, { INTERACTIVE_SLIDES, WhatsNextSlide } from '../components/InteractiveSlide';
import {
  BookOpen, Workflow, Bot, Code2, Lightbulb, ChevronLeft, ChevronRight,
  CheckCircle2, Home, PlayCircle, FileText, Puzzle, Clock, Video,
  ArrowRight, ArrowLeft, Wrench, Download, Copy, ExternalLink, Sparkles,
  ClipboardCheck, Lock
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

/* ── Helpers ── */

function ModuleVideo({ url, title, comingSoon, t }) {
  if (comingSoon || !url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-lg w-full">
          <div className="w-20 h-20 rounded-2xl bg-slate-200/80 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h4 className="font-display font-semibold text-xl text-slate-600 mb-2">{t.comingSoon}</h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto">{t.comingSoonDesc}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-black aspect-video">
          <iframe
            src={url}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function ToolDemoPage({ tool, toolAr, t, lang, isRTL, onQuizComplete, quizDone, practiceGuide }) {
  const tDesc = lang === 'ar' && toolAr ? toolAr.description : tool.description;
  const tUseCase = lang === 'ar' && toolAr ? toolAr.healthcareUseCase : tool.healthcareUseCase;
  const tSummary = lang === 'ar' && toolAr ? toolAr.summaryPoints : tool.summaryPoints;
  const tQuiz = lang === 'ar' && toolAr ? toolAr.quiz : tool.quiz;
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyPrompt = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Tool header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center shrink-0">
          <Wrench className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">{t.toolDemo}</span>
          <h3 className="font-display font-bold text-lg text-slate-800">{tool.name}</h3>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-display font-semibold text-slate-800 mb-2 text-sm">{t.overview}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{tDesc}</p>
      </div>

      {/* Video */}
      {tool.videoUrl && !tool.comingSoon ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black aspect-video">
          <iframe
            src={tool.videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${tool.name} Demo`}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-600 mb-1">{t.comingSoon}</h4>
          <p className="text-xs text-slate-400">{t.comingSoonDesc}</p>
        </div>
      )}

      {/* Healthcare Use Case */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-4">
        <h4 className="font-display font-semibold text-teal-800 mb-1.5 text-sm">{t.healthcareUseCase}</h4>
        <p className="text-sm text-teal-700 leading-relaxed">{tUseCase}</p>
      </div>

      {/* Demo Prompts - show if tool has demoPrompts */}
      {tool.demoPrompts && tool.demoPrompts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="font-display font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-500" />
            {lang === 'ar' ? 'أوامر العرض التوضيحي' : 'Demo Prompts'}
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            {lang === 'ar' ? 'جرّب هذه الأوامر بنفسك على المنصة:' : 'Try these prompts yourself on the platform:'}
          </p>
          <div className="space-y-3">
            {tool.demoPrompts.map((dp, i) => (
              <div key={i} className="bg-amber-50/60 rounded-lg border border-amber-200/60 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-amber-700">{dp.title}</span>
                  <button
                    onClick={() => copyPrompt(dp.prompt, i)}
                    className="flex items-center gap-1 text-[10px] font-medium text-amber-600 hover:text-amber-800 bg-white px-2 py-1 rounded border border-amber-200 hover:bg-amber-50 transition-all"
                  >
                    {copiedIdx === i ? (
                      <><CheckCircle2 className="w-3 h-3" />{lang === 'ar' ? 'تم النسخ' : 'Copied!'}</>
                    ) : (
                      <><Copy className="w-3 h-3" />{lang === 'ar' ? 'نسخ' : 'Copy'}</>
                    )}
                  </button>
                </div>
                <p className="text-xs text-amber-900/80 bg-white rounded-md border border-amber-100 p-2.5 font-mono leading-relaxed">{dp.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Guide download */}
      {practiceGuide && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-display font-semibold text-indigo-800 text-sm">{t.practiceGuides}</h4>
              <p className="text-xs text-indigo-600 mt-0.5 mb-2">{lang === 'ar' && practiceGuide.descriptionAr ? practiceGuide.descriptionAr : practiceGuide.description}</p>
              <a
                href={lang === 'ar' && practiceGuide.fileAr ? practiceGuide.fileAr : practiceGuide.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                {t.downloadGuide}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-display font-semibold text-slate-800 mb-2 text-sm">{t.keyTakeaways}</h4>
        <div className="space-y-2">
          {tSummary.map((point, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div>
        <h4 className="font-display font-semibold text-sm text-slate-800 mb-2">{t.knowledgeCheck}</h4>
        <QuizComponent
          questions={tQuiz}
          onComplete={onQuizComplete}
          title={`${tool.name} ${lang === 'ar' ? 'اختبار' : 'Quiz'}`}
        />
      </div>
    </div>
  );
}

/* ── Module Quiz Page (end-of-module 5-question quiz with 80% pass threshold) ── */
function ModuleQuizPage({ section, sectionIdx, t, lang, isRTL, onComplete, quizDone, quizPassed, quizScore }) {
  const questions = lang === 'ar' && section.moduleQuizAr ? section.moduleQuizAr : section.moduleQuiz;
  if (!questions || questions.length === 0) return null;

  const sAr = sectionsAr[sectionIdx];
  const sTitle = lang === 'ar' && sAr ? sAr.title : section.title;

  return (
    <div className="max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-3">
          <ClipboardCheck className="w-4 h-4" />
          {t.moduleQuiz}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{sTitle}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{t.moduleQuizDesc}</p>
        <div className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700">{t.moduleQuizPassThreshold}</p>
        </div>
      </div>

      {/* Previous attempt badge */}
      {quizDone && (
        <div className={`mb-4 p-3 rounded-xl border text-center ${quizPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-sm font-semibold ${quizPassed ? 'text-emerald-700' : 'text-red-700'}`}>
            {quizPassed ? t.moduleQuizPassed : t.moduleQuizFailed}
          </p>
          {quizScore !== undefined && (
            <p className={`text-xs mt-1 ${quizPassed ? 'text-emerald-600' : 'text-red-600'}`}>
              {t.moduleQuizScore}: {quizScore}%
            </p>
          )}
        </div>
      )}

      {/* Quiz component */}
      <QuizComponent
        questions={questions}
        onComplete={onComplete}
        title={`${t.moduleQuiz} — ${sTitle}`}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default function ModulePage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { progress, updateSlide, completeSection, completeActivity, isActivityCompleted, isSectionCompleted, completeTool, completeToolQuiz, isToolCompleted, completeVideo, markSlideViewed, completeModuleQuiz, isModuleQuizPassed, isModuleQuizCompleted } = useProgress();
  const { t, isRTL, lang } = useLanguage();
  const contentRef = useRef(null);

  /* ── Resolve section data ── */
  const sectionIdx = sections.findIndex(s => s.id === sectionId);
  const section = sections[sectionIdx];

  /* PDF total pages — discovered at runtime */
  const [pdfTotalPages, setPdfTotalPages] = useState(section?.totalSlides || 0);

  /* ── Build flat page list ── */
  const pages = useMemo(() => {
    if (!section) return [];
    const list = [];

    // 1. Intro Video
    list.push({ type: 'intro-video', icon: PlayCircle, color: 'indigo', label: t.introVideo });

    // 2. Slides — interactive (if available) or PDF, interleaved with animations
    const hasInteractive = !!INTERACTIVE_SLIDES[section.id];
    const slideCount = hasInteractive
      ? INTERACTIVE_SLIDES[section.id].length
      : (pdfTotalPages || section.totalSlides || 0);

    const animationMap = {}; // afterSlide → animation data
    if (section.animations) {
      section.animations.forEach(anim => {
        if (!animationMap[anim.afterSlide]) animationMap[anim.afterSlide] = [];
        animationMap[anim.afterSlide].push(anim);
      });
    }
    for (let i = 0; i < slideCount; i++) {
      if (hasInteractive) {
        const slideData = INTERACTIVE_SLIDES[section.id][i];
        const slideLabel = lang === 'ar' ? slideData.label : (slideData.labelEn || slideData.label);
        list.push({ type: 'interactive-slide', slideIndex: i, sectionId: section.id, icon: Sparkles, color: 'teal', label: slideLabel || `${t.slide} ${i + 1}` });
      } else {
        list.push({ type: 'slide', slideIndex: i, icon: FileText, color: 'cyan', label: `${t.slide} ${i + 1}` });
      }
      // Insert animations that should appear after this slide
      if (animationMap[i]) {
        animationMap[i].forEach(anim => {
          list.push({ type: 'animation', animationId: anim.animationId, animId: anim.id, icon: Sparkles, color: 'rose', label: `${lang === 'ar' ? 'رسوم متحركة' : 'Animation'}` });
        });
      }
    }

    // 3. Conclusion Video
    list.push({ type: 'conclusion-video', icon: Video, color: 'violet', label: t.conclusionVideo });

    // 3b. What's Next slide (only for section-1 which has the WhatsNextSlide component)
    if (section.id === 'section-1') {
      list.push({ type: 'whats-next', icon: ArrowRight, color: 'violet', label: t.whatsNext || 'What\'s Next' });
    }

    // 3c. Module Quiz (end-of-module assessment)
    if (section.moduleQuiz && section.moduleQuiz.length > 0) {
      list.push({ type: 'module-quiz', icon: ClipboardCheck, color: 'emerald', label: t.moduleQuiz || 'Module Quiz' });
    }

    // 4. Interactive Activities — one page per activity
    const sAr = sectionsAr[sectionIdx];
    const arActivityMap = lang === 'ar' && sAr?.activities
      ? Object.fromEntries(sAr.activities.map(a => [a.id, a]))
      : {};
    section.activities.forEach((activity, idx) => {
      const arActivity = arActivityMap[activity.id];
      const localized = arActivity ? { ...activity, ...arActivity } : activity;
      list.push({ type: 'activity', activity: localized, icon: Puzzle, color: 'amber', label: `${t.interactiveActivities} ${idx + 1}` });
    });

    // 5. Tool demos (if any assigned to this module)
    if (section.toolIds?.length) {
      section.toolIds.forEach(toolId => {
        const tool = tools.find(t => t.id === toolId);
        if (!tool) return;
        const toolIdx = tools.findIndex(t => t.id === toolId);
        const toolAr = toolsAr[toolIdx];
        list.push({ type: 'tool-demo', tool, toolAr, icon: Wrench, color: 'orange', label: `${t.toolDemo}: ${tool.name}` });
      });
    }

    return list;
  }, [section, sectionIdx, pdfTotalPages, t, lang]);

  /* ── Current page index ── */
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when section changes, or jump to hash target
  useEffect(() => {
    setPdfTotalPages(section?.totalSlides || 0);
    const hash = location.hash?.replace('#', '');
    if (hash && pages.length > 0) {
      // Find the target page by hash
      const idx = pages.findIndex(p => {
        if (hash === 'intro-video') return p.type === 'intro-video';
        if (hash === 'slides') return (p.type === 'slide' || p.type === 'interactive-slide') && p.slideIndex === 0;
        // Handle individual slide hash: slide-0, slide-1, etc.
        if (hash.startsWith('slide-') && !hash.startsWith('slides')) {
          const slideIdx = parseInt(hash.replace('slide-', ''), 10);
          return (p.type === 'slide' || p.type === 'interactive-slide') && p.slideIndex === slideIdx;
        }
        if (hash === 'conclusion-video') return p.type === 'conclusion-video';
        if (hash === 'whats-next') return p.type === 'whats-next';
        if (hash === 'module-quiz') return p.type === 'module-quiz';
        if (hash === 'activities') return p.type === 'activity';
        if (hash.startsWith('anim-')) return p.type === 'animation' && p.animationId === hash.replace('anim-', '');
        if (hash.startsWith('tool-')) return p.type === 'tool-demo' && p.tool?.id === hash.replace('tool-', '');
        return false;
      });
      setCurrentPage(idx >= 0 ? idx : 0);
    } else {
      setCurrentPage(0);
    }
  }, [sectionId, location.hash]);

  // Mark the initial page as viewed when landing on the module
  useEffect(() => {
    if (!section || pages.length === 0) return;
    const pg = pages[currentPage];
    if (pg?.type === 'slide' || pg?.type === 'interactive-slide') {
      markSlideViewed(sectionId, pg.slideIndex);
    }
    // Mark videos as watched when the user lands directly on them
    if (pg?.type === 'intro-video') completeVideo(sectionId, 'intro');
    if (pg?.type === 'conclusion-video') completeVideo(sectionId, 'conclusion');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  // Track current page changes (e.g., sidebar hash navigation) and mark progress
  useEffect(() => {
    if (!section || pages.length === 0) return;
    const pg = pages[currentPage];
    if (!pg) return;
    if (pg.type === 'intro-video') completeVideo(sectionId, 'intro');
    if (pg.type === 'conclusion-video') completeVideo(sectionId, 'conclusion');
    if (pg.type === 'slide' || pg.type === 'interactive-slide') markSlideViewed(sectionId, pg.slideIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Derive hash from page object for URL sync
  const getHashForPage = useCallback((pg) => {
    if (!pg) return '';
    switch (pg.type) {
      case 'intro-video': return 'intro-video';
      case 'slide': return `slide-${pg.slideIndex}`;
      case 'interactive-slide': return `slide-${pg.slideIndex}`;
      case 'animation': return `anim-${pg.animationId}`;
      case 'conclusion-video': return 'conclusion-video';
      case 'whats-next': return 'whats-next';
      case 'module-quiz': return 'module-quiz';
      case 'activity': return 'activities';
      case 'tool-demo': return `tool-${pg.tool?.id}`;
      default: return '';
    }
  }, []);

  const goToPage = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, pages.length - 1));

    // Mark the page we're LEAVING as done (user viewed/watched it)
    const leaving = pages[currentPage];
    if (leaving) {
      if (leaving.type === 'intro-video') completeVideo(sectionId, 'intro');
      if (leaving.type === 'conclusion-video') completeVideo(sectionId, 'conclusion');
      if (leaving.type === 'slide' || leaving.type === 'interactive-slide') markSlideViewed(sectionId, leaving.slideIndex);
    }

    setCurrentPage(clamped);

    // Mark the page we're ARRIVING at
    const arriving = pages[clamped];
    if (arriving?.type === 'slide' || arriving?.type === 'interactive-slide') {
      markSlideViewed(sectionId, arriving.slideIndex);
      updateSlide(sectionId, arriving.slideIndex);
    }
    // Mark videos as watched when user arrives at them (click/visit)
    if (arriving?.type === 'intro-video') completeVideo(sectionId, 'intro');
    if (arriving?.type === 'conclusion-video') completeVideo(sectionId, 'conclusion');

    // Update hash for sidebar sync (replace, don't push, to avoid back-button noise)
    const newHash = getHashForPage(pages[clamped]);
    if (newHash) {
      window.history.replaceState(null, '', `#${newHash}`);
    }
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pages, currentPage, getHashForPage, sectionId, updateSlide, completeVideo, markSlideViewed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const forward = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const backward = isRTL ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === forward) goToPage(currentPage + 1);
      if (e.key === backward) goToPage(currentPage - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage, isRTL]);

  if (!section) return <div className="text-center py-12 text-slate-500">Module not found.</div>;

  const sAr = sectionsAr[sectionIdx];
  const sTitle = lang === 'ar' && sAr ? sAr.title : section.title;
  const Icon = sectionIcons[sectionIdx];
  const completed = isSectionCompleted(section.id);
  const prevSection = sectionIdx > 0 ? sections[sectionIdx - 1] : null;
  const nextSection = sectionIdx < sections.length - 1 ? sections[sectionIdx + 1] : null;
  const pdfUrl = lang === 'ar' && section.pdfUrlAr ? section.pdfUrlAr : section.pdfUrl;

  const page = pages[currentPage] || pages[0];
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const ForwardIcon = isRTL ? ArrowLeft : ArrowRight;

  const totalPages = pages.length;
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  /* ── Color map ── */
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', activeBg: 'bg-indigo-600' },
    cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200',   activeBg: 'bg-cyan-600' },
    teal:   { bg: 'bg-teal-50',  text: 'text-teal-600',  border: 'border-teal-200',  activeBg: 'bg-teal-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', activeBg: 'bg-violet-600' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  activeBg: 'bg-amber-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', activeBg: 'bg-orange-600' },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-200',   activeBg: 'bg-rose-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', activeBg: 'bg-emerald-600' },
  };
  const c = colorMap[page?.color] || colorMap.cyan;
  const CurrentIcon = page?.icon || FileText;

  /* ── Activity / tool handlers ── */
  const handleActivityComplete = (activityId, score) => {
    completeActivity(activityId, score);
    const allActs = section.activities;
    const allDone = allActs.every(a => a.id === activityId ? true : isActivityCompleted(a.id));
    if (allDone && !completed) completeSection(section.id);
  };

  const handleToolQuizComplete = (toolId) => (score) => {
    completeToolQuiz(toolId, score);
    if (score >= 70) completeTool(toolId);
  };

  const renderActivity = (activity) => {
    const actCompleted = isActivityCompleted(activity.id);
    switch (activity.type) {
      case 'match':
        return <MatchActivity activity={activity} onComplete={(score) => handleActivityComplete(activity.id, score)} completed={actCompleted} />;
      case 'flashcard':
        return <FlashcardActivity activity={activity} onComplete={(score) => handleActivityComplete(activity.id, score)} completed={actCompleted} />;
      case 'dragdrop':
        return <DragDropActivity activity={activity} onComplete={(score) => handleActivityComplete(activity.id, score)} completed={actCompleted} />;
      default:
        return null;
    }
  };

  /* ── Progress segment for mini-map ── */
  const getSegmentType = (idx) => {
    const p = pages[idx];
    if (!p) return 'slide';
    return p.type;
  };
  const segmentColor = (type) => {
    switch (type) {
      case 'intro-video': return 'bg-indigo-400';
      case 'slide': return 'bg-cyan-400';
      case 'interactive-slide': return 'bg-teal-400';
      case 'animation': return 'bg-rose-400';
      case 'conclusion-video': return 'bg-violet-400';
      case 'activity': return 'bg-amber-400';
      case 'tool-demo': return 'bg-orange-400';
      case 'whats-next': return 'bg-violet-400';
      case 'module-quiz': return 'bg-emerald-400';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>

      {/* ═══ COMPACT TOP BAR ═══ */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-cyan-100'}`}>
            {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Icon className="w-4 h-4 text-cyan-600" />}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600">{t.module} {section.number}</span>
            <h1 className="font-display font-bold text-sm sm:text-base text-slate-800 leading-tight truncate">{sTitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text} hidden sm:inline`}>
            {currentPage + 1} / {totalPages}
          </span>
          {prevSection && (
            <button onClick={() => navigate(`/module/${prevSection.id}`)} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all" title={`${t.module} ${prevSection.number}`}>
              <PrevIcon className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all" title={t.home}>
            <Home className="w-3.5 h-3.5" />
          </button>
          {nextSection && (
            <button onClick={() => navigate(`/module/${nextSection.id}`)} className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all" title={`${t.module} ${nextSection.number}`}>
              <NextIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ═══ PROGRESS MINI-MAP ═══ */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-2 flex overflow-hidden">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`flex-1 transition-all duration-300 ${
              i === currentPage
                ? segmentColor(getSegmentType(i))
                : i < currentPage
                  ? 'bg-emerald-300'
                  : 'bg-slate-200'
            } hover:opacity-80`}
            title={pages[i]?.label}
            style={{ minWidth: '2px' }}
          />
        ))}
      </div>

      {/* ═══ MAIN CONTENT CARD ═══ */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Page header strip */}
        <div className={`${c.bg} px-4 py-2 border-b ${c.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${c.activeBg} flex items-center justify-center`}>
              <CurrentIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className={`font-display font-semibold text-sm ${c.text}`}>{page?.label}</h2>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">{currentPage + 1} / {totalPages}</span>
        </div>

        {/* Scrollable content body */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div key={`${sectionId}-${currentPage}`} className="p-4 sm:p-6 animate-slide-content">

            {/* INTRO VIDEO */}
            {page?.type === 'intro-video' && (
              <ModuleVideo
                url={section.introVideoUrl}
                title={`${sTitle} - ${t.introVideo}`}
                comingSoon={!section.introVideoUrl}
                t={t}
              />
            )}

            {/* PDF SLIDE */}
            {page?.type === 'slide' && (
              <PdfSingleSlide
                pdfUrl={pdfUrl}
                pageIndex={page.slideIndex}
                onTotalPages={(n) => {
                  if (n !== pdfTotalPages) setPdfTotalPages(n);
                }}
              />
            )}

            {/* INTERACTIVE SLIDE (replaces PDF for modules with rich content) */}
            {page?.type === 'interactive-slide' && (
              <InteractiveSlide sectionId={page.sectionId} slideIndex={page.slideIndex} />
            )}

            {/* ANIMATION SLIDE */}
            {page?.type === 'animation' && (
              <AnimatedSlide animationId={page.animationId} />
            )}

            {/* CONCLUSION VIDEO */}
            {page?.type === 'conclusion-video' && (
              <ModuleVideo
                url={section.conclusionVideoUrl}
                title={`${sTitle} - ${t.conclusionVideo}`}
                comingSoon={!section.conclusionVideoUrl}
                t={t}
              />
            )}

            {/* WHAT'S NEXT */}
            {page?.type === 'whats-next' && (
              <div className={`max-w-3xl mx-auto ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <WhatsNextSlide />
              </div>
            )}

            {/* MODULE QUIZ */}
            {page?.type === 'module-quiz' && (
              <ModuleQuizPage
                section={section}
                sectionIdx={sectionIdx}
                t={t}
                lang={lang}
                isRTL={isRTL}
                onComplete={(score) => {
                  completeModuleQuiz(section.id, score);
                }}
                quizDone={isModuleQuizCompleted(section.id)}
                quizPassed={isModuleQuizPassed(section.id)}
                quizScore={progress.moduleQuizzes?.[section.id]?.score}
              />
            )}

            {/* ACTIVITY */}
            {page?.type === 'activity' && (
              <div>
                {renderActivity(page.activity)}
              </div>
            )}

            {/* TOOL DEMO */}
            {page?.type === 'tool-demo' && (
              <ToolDemoPage
                tool={page.tool}
                toolAr={page.toolAr}
                t={t}
                lang={lang}
                isRTL={isRTL}
                quizDone={progress.toolQuizzes[page.tool.id]?.completed}
                onQuizComplete={handleToolQuizComplete(page.tool.id)}
                practiceGuide={section.practiceGuides?.find(g => g.toolId === page.tool.id)}
              />
            )}
          </div>
        </div>

        {/* ═══ BOTTOM NAVIGATION BAR ═══ */}
        <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between">
          {/* Previous */}
          <button
            onClick={() => !isFirst && goToPage(currentPage - 1)}
            disabled={isFirst}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              isFirst
                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]'
            }`}
          >
            <PrevIcon className="w-4 h-4" />
            <span>{t.previous}</span>
          </button>

          {/* Center: page counter */}
          <span className="text-xs font-semibold text-slate-400">
            {currentPage + 1} / {totalPages}
          </span>

          {/* Next / Next Module */}
          {!isLast ? (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-sm hover:shadow-md active:scale-[0.98] ${c.activeBg}`}
            >
              <span>{t.next}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          ) : nextSection ? (
            isModuleQuizPassed(section.id) ? (
              <button
                onClick={() => navigate(`/module/${nextSection.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <span>{t.module} {nextSection.number}</span>
                <NextIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title={t.moduleQuizLocked}
              >
                <Lock className="w-4 h-4" />
                <span>{t.module} {nextSection.number}</span>
              </button>
            )
          ) : (
            isModuleQuizPassed(section.id) ? (
              <button
                onClick={() => navigate('/final-exam')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <span>{t.finalExam}</span>
                <ForwardIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title={t.moduleQuizLocked}
              >
                <Lock className="w-4 h-4" />
                <span>{t.finalExam}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
