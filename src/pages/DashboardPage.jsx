import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { sections, sectionsAr, tools, toolsAr, courseInfo, courseInfoAr, learningOutcomes } from '../data/courseData';
import {
  BookOpen, Workflow, Bot, Code2, Lightbulb, Wrench, GraduationCap,
  ChevronRight, ChevronLeft, CheckCircle2, Circle, Clock, Target, Users, Award,
  PlayCircle, ArrowRight, ArrowLeft, Lock, Flame, Zap, PartyPopper, Sparkles,
  Download, ExternalLink, FileDown, FileText
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

function getMotivation(progress, overallProgress, t) {
  const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
  const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
  const examPassed = progress.finalExam?.passed;

  if (examPassed && overallProgress === 100) {
    return { icon: PartyPopper, text: t.motiv_complete, color: "text-emerald-300", bg: "bg-emerald-400/20" };
  }
  if (examPassed) {
    return { icon: Award, text: t.motiv_examPassed, color: "text-amber-300", bg: "bg-amber-400/20" };
  }
  if (overallProgress >= 80) {
    return { icon: Flame, text: t.motiv_almostThere, color: "text-orange-300", bg: "bg-orange-400/20" };
  }
  if (overallProgress >= 50) {
    return { icon: Zap, text: t.motiv_halfway, color: "text-yellow-300", bg: "bg-yellow-400/20" };
  }
  if (overallProgress >= 20) {
    return { icon: Sparkles, text: t.motiv_greatStart, color: "text-cyan-200", bg: "bg-cyan-400/20" };
  }
  if (completedSections === 0 && completedTools === 0) {
    return { icon: PlayCircle, text: t.motiv_welcome, color: "text-indigo-200", bg: "bg-indigo-400/20" };
  }
  return { icon: BookOpen, text: t.motiv_progress, color: "text-cyan-200", bg: "bg-cyan-400/20" };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { progress, getOverallProgress, isSectionCompleted, isToolCompleted } = useProgress();
  const { t, isRTL, lang } = useLanguage();
  const overallProgress = getOverallProgress();
  const ci = lang === 'ar' ? courseInfoAr : courseInfo;
  
  const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
  const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
  const completedActivities = Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length;

  const NavChevron = isRTL ? ChevronLeft : ChevronRight;
  const NavArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome header */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-cyan-200 text-sm font-medium mb-1">{t.welcomeTo}</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2">{ci.title}</h1>
          <p className="text-cyan-100 text-sm max-w-xl mb-4">{ci.subtitle}</p>
          
          {/* Motivational message */}
          {(() => {
            const { icon: MotivIcon, text, color, bg } = getMotivation(progress, overallProgress, t);
            return (
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${bg} rounded-xl mb-5 border border-white/10`}>
                <MotivIcon className={`w-4 h-4 ${color} shrink-0 rtl-flip`} />
                <span className={`text-sm font-medium ${color}`}>{text}</span>
              </div>
            );
          })()}
          
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold">{overallProgress}%</span>
                <span className="text-sm text-cyan-200">{t.complete}</span>
              </div>
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-cyan-200">
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{ci.duration}</div>
              <div className="flex items-center gap-1.5"><Target className="w-4 h-4" />{ci.level}</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{ci.audience}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t.modulesLabel, done: completedSections, total: 5, color: "cyan" },
          { label: t.activitiesLabel, done: completedActivities, total: 10, color: "violet" },
          { label: t.toolDemosLabel, done: completedTools, total: 6, color: "amber" },
          { label: t.finalExamLabel, done: progress.finalExam?.passed ? 1 : 0, total: 1, color: "emerald" },
        ].map(({ label, done, total, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span className="text-2xl font-bold text-slate-800">{done}</span>
              <span className="text-2xl font-bold text-slate-400">/ {total}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${
                color === 'cyan' ? 'bg-cyan-500' : color === 'violet' ? 'bg-violet-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Introduction Video */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-indigo-600 rtl-flip" />
          {t.startHere}
        </h2>
        <button
          onClick={() => navigate('/introduction')}
          className="w-full bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200 p-4 sm:p-5 hover:shadow-md hover:border-indigo-300 transition-all text-start group"
        >
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSectionCompleted('intro-video') ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
              {isSectionCompleted('intro-video') ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <PlayCircle className="w-5 h-5 text-indigo-600 rtl-flip" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {t.courseIntroVideo}
                </h3>
                <NavChevron className={`w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-all shrink-0`} />
              </div>
              <p className="text-sm text-slate-500">{t.watchIntroDesc}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSectionCompleted('intro-video') ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-600'}`}>
                  {isSectionCompleted('intro-video') ? `✓ ${t.watched}` : t.startHereTag}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Course Modules */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600" />
          {t.courseModules}
        </h2>
        <div className="space-y-3">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i];
            const completed = isSectionCompleted(section.id);
            const activitiesDone = section.activities.filter(a => progress.activities[a.id]?.completed).length;
            const sAr = sectionsAr[i];
            const sTitle = lang === 'ar' && sAr ? sAr.title : section.title;
            const sDesc = lang === 'ar' && sAr ? sAr.shortDescription : section.shortDescription;
            
            return (
              <button
                key={section.id}
                onClick={() => navigate(`/module/${section.id}`)}
                className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-cyan-200 transition-all text-start group"
              >
                <div className="flex flex-col sm:flex-row">
                  {section.imageUrl && (
                    <div className="sm:w-40 lg:w-48 shrink-0">
                      <img src={section.imageUrl} alt={sTitle} className="w-full h-32 sm:h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex items-start gap-4 p-4 sm:p-5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-cyan-50'}`}>
                      {completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Icon className="w-5 h-5 text-cyan-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors">
                          {t.module} {section.number}: {sTitle}
                        </h3>
                        <NavChevron className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-all shrink-0" />
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1 mb-3">{sDesc}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {completed ? `✓ ${t.completed}` : `${section.totalSlides} ${t.slides}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${activitiesDone === section.activities.length ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {activitiesDone}/{section.activities.length} {t.activities}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Demonstrations (grouped by module) */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-600" />
          {t.toolDemonstrations}
        </h2>
        {sections.filter(s => s.toolIds?.length).map((section, si) => {
          const sAr = sectionsAr[sections.indexOf(section)];
          const sTitle = lang === 'ar' && sAr ? sAr.title : section.title;
          return (
            <div key={section.id} className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                {t.module} {section.number}: {sTitle}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.toolIds.map(toolId => {
                  const tool = tools.find(t => t.id === toolId);
                  if (!tool) return null;
                  const ti = tools.indexOf(tool);
                  const completed = isToolCompleted(tool.id);
                  const quizDone = progress.toolQuizzes[tool.id]?.completed;
                  const tlAr = toolsAr[ti];
                  const tTagline = lang === 'ar' && tlAr ? tlAr.tagline : tool.tagline;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => navigate(`/module/${section.id}`)}
                      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-cyan-200 transition-all text-start group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${completed ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Wrench className="w-4 h-4 text-slate-500" />}
                        </div>
                        <NavChevron className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-cyan-700 transition-colors">{tool.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{tTagline}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${quizDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {quizDone ? `✓ ${t.quizDone}` : t.quizPending}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Supplemental Practice Guides */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-600" />
          {t.supplementalResources}
        </h2>
        <p className="text-sm text-slate-500 mb-4 -mt-2">{t.supplementalResourcesDesc}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Lovable Practice Guide */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-cyan-200 transition-all group">
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors">Lovable</h3>
                  <p className="text-xs text-slate-500">{t.handsOnGuide}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{lang === 'ar' ? 'أنشئ تطبيق تتبع مرضى السكري باستخدام أوامر اللغة الطبيعية. دليل خطوة بخطوة مع ٣ أوامر توضيحية وتمارين عملية.' : 'Build a Diabetic Patient Tracking App using natural language prompts. Step-by-step guide with 3 demo prompts and hands-on exercises.'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-semibold">3+ {t.promptsIncluded}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold">6+ {t.exercisesIncluded}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold">{t.noCodingRequired}</span>
              </div>
              <a
                href={lang === 'ar' ? '/guides/lovable-practice-guide-ar.html' : '/guides/lovable-practice-guide.html'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-all shadow-sm hover:shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.viewGuide}
              </a>
            </div>
          </div>

          {/* Replit Practice Guide */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all group">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-800 group-hover:text-orange-700 transition-colors">Replit</h3>
                  <p className="text-xs text-slate-500">{t.handsOnGuide}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{lang === 'ar' ? 'أنشئ مولّد التقارير السريرية باستخدام التطوير بمساعدة الذكاء الاصطناعي. دليل خطوة بخطوة مع ٣ أوامر توضيحية ومقارنة مع Lovable.' : 'Build a Clinical Report Generator using AI-assisted development. Step-by-step guide with 3 demo prompts and a Lovable vs Replit comparison.'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-semibold">3+ {t.promptsIncluded}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold">6+ {t.exercisesIncluded}</span>
                <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full text-[10px] font-semibold">{t.aiAssistedDev}</span>
              </div>
              <a
                href={lang === 'ar' ? '/guides/replit-practice-guide-ar.html' : '/guides/replit-practice-guide.html'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-all shadow-sm hover:shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.viewGuide}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Final Exam */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-600" />
          {t.finalAssessment}
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-semibold text-slate-800">{t.endOfCourseExam}</h3>
              <p className="text-sm text-slate-500 mt-1">{t.questionsAllModules}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {t.passing}: 70%</span>
                {progress.finalExam && (
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${progress.finalExam.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {t.score}: {progress.finalExam.percentage}%
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(progress.finalExam?.passed ? '/results' : '/final-exam')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shrink-0"
            >
              {progress.finalExam?.passed ? t.viewResults : t.takeExam}
              <NavArrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
