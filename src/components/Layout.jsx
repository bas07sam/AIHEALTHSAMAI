import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { sections, sectionsAr, tools } from '../data/courseData';
import { INTERACTIVE_SLIDES } from '../components/InteractiveSlide';
import {
  BookOpen, Cpu, Workflow, Bot, Code2, Lightbulb, Wrench,
  GraduationCap, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  CheckCircle2, Circle, Home, RotateCcw, Heart, PlayCircle, Globe,
  FileText, Video, Puzzle, Clock, Sparkles, ClipboardCheck, ArrowRight, Lock
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionsExpanded, setSectionsExpanded] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const {
    isSectionCompleted, isToolCompleted, isActivityCompleted,
    isVideoWatched, areSlidesCompleted, isModuleQuizPassed, isModuleQuizCompleted,
    progress, getOverallProgress, resetProgress
  } = useProgress();
  const { t, isRTL, toggleLanguage, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const overallProgress = getOverallProgress();

  const closeSidebar = () => setSidebarOpen(false);

  const toggleModuleExpand = (sectionId) => {
    setExpandedModules(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const ExpandIcon = sectionsExpanded ? ChevronDown : (isRTL ? ChevronLeft : ChevronRight);

  const isModuleActive = (sectionId) => location.pathname === `/module/${sectionId}`;
  const currentHash = location.hash?.replace('#', '') || '';

  /* ── Helper: compute done count for a module's sub-items ── */
  const getModuleProgress = (section) => {
    let done = 0;
    let total = 0;

    // Intro video
    total++;
    if (isVideoWatched(section.id, 'intro')) done++;

    // Slides
    total++;
    if (areSlidesCompleted(section.id, section.totalSlides)) done++;

    // Conclusion video
    total++;
    if (isVideoWatched(section.id, 'conclusion')) done++;

    // Activities
    total++;
    const allActivitiesDone = section.activities.length > 0 &&
      section.activities.every(a => isActivityCompleted(a.id));
    if (allActivitiesDone) done++;

    // Module Quiz
    total++;
    if (progress.moduleQuizzes?.[section.id]?.passed) done++;

    // Tools
    if (section.toolIds?.length) {
      section.toolIds.forEach(toolId => {
        total++;
        if (progress.toolQuizzes[toolId]?.completed) done++;
      });
    }

    return { done, total };
  };

  // Check if a module is accessible (previous module quiz must be passed, or it's module 1)
  const isModuleAccessible = (sectionIdx) => {
    if (sectionIdx === 0) return true; // first module always accessible
    const prevSection = sections[sectionIdx - 1];
    return isModuleQuizPassed(prevSection.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-white z-50 transform transition-transform duration-300 flex flex-col ${isRTL ? 'border-l border-slate-200' : 'border-r border-slate-200'} ${
          sidebarOpen
            ? 'translate-x-0'
            : isRTL
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ [isRTL ? 'right' : 'left']: 0 }}
      >
        {/* Logo area + overall progress */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-800 leading-tight">{t.aiAutomation}</h2>
              <p className="text-[10px] text-slate-500">{t.healthcareLearning}</p>
            </div>
            <button onClick={closeSidebar} className="ms-auto lg:hidden p-1 rounded hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Overall course progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{t.courseProgress}</span>
              <span className="font-bold text-cyan-600 text-sm">{overallProgress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  overallProgress === 100
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            {/* Completion stats row */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
              <span>{Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length}/5 {t.modulesLabel}</span>
              <span className="text-slate-200">|</span>
              <span>{Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length}/10 {t.activitiesLabel}</span>
              <span className="text-slate-200">|</span>
              <span>{Object.keys(progress.toolQuizzes).filter(k => progress.toolQuizzes[k]?.completed).length}/6 {t.toolDemosLabel}</span>
              <span className="text-slate-200">|</span>
              <span>{progress.finalExam?.passed ? '1' : '0'}/1 {t.finalExamLabel}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Home className="w-4 h-4" />
            {t.dashboard}
          </NavLink>

          {/* Course Intro Video */}
          <NavLink to="/introduction" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
            {isSectionCompleted('intro-video') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <PlayCircle className="w-4 h-4 rtl-flip" />
            )}
            {t.introductionVideo}
          </NavLink>

          {/* Sections */}
          <div className="pt-2">
            <button onClick={() => setSectionsExpanded(!sectionsExpanded)} className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>{t.modules}</span>
              <ExpandIcon className="w-3.5 h-3.5" />
            </button>
            {sectionsExpanded && sections.map((section, i) => {
              const SectionIcon = sectionIcons[i];
              const sCompleted = isSectionCompleted(section.id);
              const isActive = isModuleActive(section.id);
              const isExpanded = expandedModules[section.id] || isActive;
              const ModuleChevron = isExpanded ? ChevronDown : (isRTL ? ChevronLeft : ChevronRight);
              const sTitle = lang === 'ar' && sectionsAr[i] ? sectionsAr[i].title : section.title;
              const accessible = isModuleAccessible(i);

              // Module-level progress
              const { done: modDone, total: modTotal } = getModuleProgress(section);
              const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

              // Compute done status for each sub-item
              const introVideoDone = isVideoWatched(section.id, 'intro');
              const slidesDone = areSlidesCompleted(section.id, section.totalSlides);
              const conclusionVideoDone = isVideoWatched(section.id, 'conclusion');
              const allActivitiesDone = section.activities.length > 0 &&
                section.activities.every(a => isActivityCompleted(a.id));

              // Build sub-items with done state
              const subItems = [
                { id: 'intro-video', hash: 'intro-video', label: t.introVideo, icon: PlayCircle, color: 'text-indigo-400', available: !!section.introVideoUrl, done: introVideoDone },
              ];

              // Add individual slide titles if interactive slides exist for this section
              const interactiveSlides = INTERACTIVE_SLIDES[section.id];
              if (interactiveSlides) {
                const viewedSlides = progress.viewedSlides?.[section.id] || [];
                interactiveSlides.forEach((slide, idx) => {
                  const slideLabel = lang === 'ar' ? slide.label : (slide.labelEn || slide.label);
                  const slideViewed = viewedSlides.includes(idx);
                  subItems.push({
                    id: `slide-${idx}`,
                    hash: `slide-${idx}`,
                    label: slideLabel,
                    icon: Sparkles,
                    color: 'text-teal-400',
                    available: true,
                    done: slideViewed,
                    isSlide: true,
                    slideIndex: idx,
                  });
                });
              } else {
                subItems.push({ id: 'slides', hash: 'slides', label: `${t.lessonSlidesPdf} (${section.totalSlides})`, icon: FileText, color: 'text-cyan-400', available: true, done: slidesDone });
              }

              subItems.push(
                { id: 'conclusion-video', hash: 'conclusion-video', label: t.conclusionVideo, icon: Video, color: 'text-violet-400', available: !!section.conclusionVideoUrl, done: conclusionVideoDone },
              );

              // What's Next (only section-1)
              if (section.id === 'section-1') {
                subItems.push({ id: 'whats-next', hash: 'whats-next', label: t.whatsNext || 'What\'s Next', icon: ArrowRight, color: 'text-violet-400', available: true, done: conclusionVideoDone });
              }

              // Module Quiz
              const moduleQuizDone = progress.moduleQuizzes?.[section.id]?.passed || false;
              subItems.push({ id: 'module-quiz', hash: 'module-quiz', label: t.moduleQuiz || 'Module Quiz', icon: ClipboardCheck, color: 'text-emerald-400', available: true, done: moduleQuizDone });

              subItems.push(
                { id: 'activities', hash: 'activities', label: `${t.interactiveActivities} (${section.activities.length})`, icon: Puzzle, color: 'text-amber-400', available: true, done: allActivitiesDone },
              );

              // Add tool demos if this module has them
              if (section.toolIds?.length) {
                section.toolIds.forEach(toolId => {
                  const tool = tools.find(t => t.id === toolId);
                  if (tool) {
                    const toolQuizDone = progress.toolQuizzes[toolId]?.completed || false;
                    subItems.push({
                      id: `tool-${toolId}`,
                      hash: `tool-${toolId}`,
                      label: `${tool.name}`,
                      icon: Wrench,
                      color: 'text-orange-400',
                      available: !tool.comingSoon && !!tool.videoUrl,
                      isTool: true,
                      done: toolQuizDone,
                    });
                  }
                });
              }

              return (
                <div key={section.id}>
                  {/* Module row */}
                  <div className={`flex items-center rounded-lg text-sm transition-all ${!accessible ? 'opacity-60' : ''} ${isActive ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <NavLink
                      to={accessible ? `/module/${section.id}` : '#'}
                      onClick={(e) => { if (!accessible) { e.preventDefault(); return; } closeSidebar(); }}
                      className={`flex items-center gap-2 px-3 py-2 flex-1 min-w-0 ${!accessible ? 'cursor-not-allowed' : ''}`}
                    >
                      {!accessible ? (
                        <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : sCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <SectionIcon className="w-4 h-4 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="truncate text-[13px] block">{section.number}. {sTitle}</span>
                        {/* Module progress bar */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                modPercent === 100 ? 'bg-emerald-400' : 'bg-cyan-400'
                              }`}
                              style={{ width: `${modPercent}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium shrink-0">{modDone}/{modTotal}</span>
                        </div>
                      </div>
                    </NavLink>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleModuleExpand(section.id); }}
                      className="p-1.5 me-1 rounded hover:bg-slate-200/60 transition-all"
                    >
                      <ModuleChevron className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {/* Module sub-sections */}
                  {isExpanded && (
                    <div className={`${isRTL ? 'mr-5 pr-3 border-r-2' : 'ml-5 pl-3 border-l-2'} border-slate-100 mt-0.5 mb-1 space-y-0.5`}>
                      {subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = isActive && currentHash === sub.hash;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              navigate(`/module/${section.id}#${sub.hash}`);
                              closeSidebar();
                            }}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] w-full transition-all cursor-pointer group ${
                              isSubActive
                                ? 'bg-cyan-50 text-cyan-700 font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            {/* Done icon or sub-item icon */}
                            {sub.done ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            ) : (
                              <SubIcon className={`w-3 h-3 ${isSubActive ? 'text-cyan-500' : sub.color} shrink-0`} />
                            )}
                            <span className={`truncate ${sub.done ? 'text-emerald-600' : ''}`}>{sub.label}</span>
                            {!sub.available && (
                              <Clock className="w-3 h-3 text-slate-300 ms-auto shrink-0" title={t.comingSoon} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Exam */}
          <div className="pt-2">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.assessment}</div>
            <NavLink
              to="/final-exam"
              onClick={closeSidebar}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {progress.finalExam?.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <GraduationCap className="w-4 h-4 shrink-0" />
              )}
              <span className="text-[13px]">{t.finalExam}</span>
              {progress.finalExam && (
                <span className={`ms-auto text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  progress.finalExam.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {progress.finalExam.percentage}%
                </span>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Reset + language toggle */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-all lg:hidden"
          >
            <Globe className="w-3.5 h-3.5" />
            {t.langLabel}
          </button>
          <button
            onClick={() => { if (confirm(t.resetConfirm)) { resetProgress(); navigate('/dashboard'); } }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.resetProgress}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600" />
            <h1 className="font-display font-semibold text-slate-800 text-sm sm:text-base">{t.aiAutomationVibeCoding}</h1>
          </div>
          <div className="ms-auto flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200"
              title={t.langLabel}
            >
              <Globe className="w-3.5 h-3.5" />
              {t.langSwitch}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t.selfPaced}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              overallProgress === 100
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-cyan-50 text-cyan-700'
            }`}>
              {overallProgress}% {t.complete}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
