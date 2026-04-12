import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { courseInfo, courseInfoAr, learningOutcomes, learningOutcomesAr, skills, skillsAr, sections, sectionsAr, tools, toolsAr, sectionDurations } from '../data/courseData';
import {
  Play, Clock, BarChart3, Users, Monitor, Award, Cpu, Heart,
  BookOpen, Workflow, Bot, Code2, Lightbulb, Wrench, ChevronRight, ChevronDown,
  CheckCircle2, Sparkles, Shield, Zap, Target, GraduationCap, ArrowRight,
  FileText, Layers, Puzzle, Globe
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

function ModuleCard({ section, sectionAr, index, t, isRTL, lang }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = sectionIcons[index];
  const duration = sectionDurations[section.id] || 20;
  const title = lang === 'ar' && sectionAr ? sectionAr.title : section.title;
  const shortDesc = lang === 'ar' && sectionAr ? sectionAr.shortDescription : section.shortDescription;
  const outcomes = lang === 'ar' && sectionAr ? sectionAr.outcomes : section.outcomes;
  const activities = lang === 'ar' && sectionAr ? sectionAr.activities : section.activities;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {section.imageUrl && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={section.imageUrl}
            alt={section.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold border border-white/20">
              {t.module} {section.number}
            </span>
            <div className="flex items-center gap-3 text-white/80 text-[11px]">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration} min</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{section.totalSlides} {t.slides}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-slate-800 text-base leading-tight">{title}</h4>
          </div>
        </div>

        <p className={`text-sm text-slate-500 leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
          {shortDesc}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors mb-3"
        >
          {expanded ? (
            <>{t.showLess} <ChevronDown className="w-3 h-3 rotate-180" /></>
          ) : (
            <>{t.showFullDetails} <ChevronDown className="w-3 h-3" /></>
          )}
        </button>

        {expanded && (
          <div className="space-y-3 mb-3 animate-fade-in-up">
            <div className="bg-slate-50 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-cyan-600" />
                {t.learningOutcomesTitle}
              </h5>
              <ul className="space-y-1.5">
                {outcomes.map((outcome, oi) => (
                  <li key={oi} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cyan-50 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-cyan-800 mb-2 flex items-center gap-1.5">
                <Puzzle className="w-3 h-3 text-cyan-600" />
                {t.interactiveActivitiesLabel} ({activities.length})
              </h5>
              <ul className="space-y-1">
                {activities.map((act, ai) => (
                  <li key={ai} className="flex items-center gap-2 text-xs text-cyan-700">
                    <Layers className="w-3 h-3 text-cyan-500" />
                    {act.title}
                    <span className="text-[10px] text-cyan-500 capitalize">({section.activities[ai]?.type || ''})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Puzzle className="w-3 h-3" />
            {activities.length} {t.activities}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <FileText className="w-3 h-3" />
            {section.totalSlides} {t.slides}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            ~{duration} min
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {section.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">{tag}</span>
          ))}
          {section.tags.length > 4 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-medium">+{section.tags.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseStructureSection({ t, isRTL, lang }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold mb-4">{t.courseStructure}</span>
      <h2 className="font-display font-bold text-3xl text-slate-800 mb-3">{t.courseStructureDesc}</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-2xl">
        {t.courseStructureDetails}
      </p>
      
      <div className="grid lg:grid-cols-2 gap-5 mb-10">
        {sections.map((section, i) => (
          <ModuleCard key={section.id} section={section} sectionAr={sectionsAr[i]} index={i} t={t} isRTL={isRTL} lang={lang} />
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { startCourse, getOverallProgress, progress } = useProgress();
  const { t, isRTL, toggleLanguage, lang } = useLanguage();

  const handleStart = () => {
    startCourse();
    navigate('/dashboard');
  };

  const overallProgress = getOverallProgress();

  // Localized content
  const ci = lang === 'ar' ? courseInfoAr : courseInfo;
  const lo = lang === 'ar' ? learningOutcomesAr : learningOutcomes;
  const sk = lang === 'ar' ? skillsAr : skills;
  const tl = lang === 'ar' ? toolsAr : null;

  return (
    <div className={`min-h-screen bg-slate-50`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-800 text-sm">{t.healthaiAcademy}</span>
              <span className="hidden sm:block text-[10px] text-slate-500">{t.learningPlatform}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200"
              title={t.langLabel}
            >
              <Globe className="w-3.5 h-3.5" />
              {t.langSwitch}
            </button>
            <button onClick={handleStart} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-200">
              {progress.started ? t.continueLearning : t.getStarted}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900" />
        <div className="absolute inset-0">
          <img
            src="/images/hero-banner.png"
            alt="Healthcare professionals and AI technology"
            className="w-full h-full object-cover object-top opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-500/30">
                  {ci.sector}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                  {ci.level}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                  {ci.deliveryMode}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
                {ci.title}
              </h1>
              <p className="text-lg sm:text-xl text-cyan-100 font-medium mb-3">
                {ci.subtitle}
              </p>
              <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
                {ci.catalogSummary}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <button onClick={handleStart} className="group flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-xl text-base font-semibold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25">
                  <Play className="w-5 h-5 rtl-flip" />
                  {progress.started ? t.continueCourse : t.startCourse}
                  <ChevronRight className="w-4 h-4 rtl-flip group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a href="#overview" className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all border border-white/20">
                  {t.learnMore}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{ci.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>{ci.level}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{ci.audience}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>{ci.deliveryMode}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block flex-shrink-0 w-96">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                <img
                  src="/images/hero-banner.png"
                  alt="Healthcare professionals embracing AI technology"
                  className="relative rounded-2xl shadow-2xl shadow-black/30 border border-white/10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress card */}
      {progress.started && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800">{t.yourProgress}</h3>
              <span className="text-2xl font-bold text-cyan-600">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length} {t.ofModules}</span>
              <span>{Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length} {t.ofTools}</span>
              <span>{t.examStatus}: {progress.finalExam?.passed ? `${t.passedCheck} ✓` : t.notTaken}</span>
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold mb-4">{t.courseOverview}</span>
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">{t.whatYoullLearn}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{ci.description}</p>
            <p className="text-slate-600 leading-relaxed mb-6">{ci.fullDescription}</p>
            
            <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100">
              <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                {t.courseObjective}
              </h4>
              <p className="text-sm text-cyan-700 leading-relaxed">{ci.objective}</p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-semibold text-slate-800 mb-1">{t.courseDetails}</h3>
              <p className="text-xs text-slate-500 mb-5">{ci.courseType}</p>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: t.duration, value: ci.duration },
                  { icon: BarChart3, label: t.level, value: ci.level },
                  { icon: Users, label: t.sector, value: ci.audience },
                  { icon: Heart, label: t.sector, value: ci.sector },
                  { icon: Monitor, label: t.delivery, value: ci.deliveryMode },
                  { icon: Award, label: t.passingScore, value: `${ci.passingScore}%` },
                ].map(({ icon: Icon, label, value }, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-4">{t.whyThisMatters}</span>
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">{t.transformHealthcare}</h2>
            <p className="text-slate-600 leading-relaxed">{ci.whyMatters}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Zap, title: t.fasterWorkflows, desc: t.fasterWorkflowsDesc },
              { icon: Shield, title: t.fewerErrors, desc: t.fewerErrorsDesc },
              { icon: Sparkles, title: t.smartDecisions, desc: t.smartDecisionsDesc },
              { icon: Target, title: t.rapidPrototyping, desc: t.rapidPrototypingDesc }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-cyan-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-4">{t.learningOutcomesTitle}</span>
        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8">{t.byEndOfCourse}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {lo.map((outcome, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">{outcome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold mb-4 border border-cyan-500/30">{t.skillsCompetencies}</span>
          <h2 className="font-display font-bold text-3xl text-white mb-8">{t.skillsYoullDevelop}</h2>
          <div className="flex flex-wrap gap-3">
            {sk.map(skill => (
              <div key={skill} className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <CourseStructureSection t={t} isRTL={isRTL} lang={lang} />

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h3 className="font-display font-semibold text-xl text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-600" />
          {t.toolDemonstrations}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {tools.map((tool, ti) => {
            const toolData = tl ? tl[ti] : tool;
            return (
            <div key={tool.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
              <h5 className="font-semibold text-slate-800 text-sm">{tool.name}</h5>
              <p className="text-xs text-slate-500">{toolData?.tagline || tool.tagline}</p>
            </div>
          );
          })}
        </div>

        {/* Final Exam */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-indigo-800">{t.finalAssessment}</h4>
              <p className="text-sm text-indigo-600">{t.questionsAllModules}. {t.passing}: 70%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Target Audience */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-800 mb-4">{t.prerequisites}</h3>
            <p className="text-slate-600 leading-relaxed">{ci.prerequisites}</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-800 mb-4">{t.whoIsThisFor}</h3>
            <p className="text-slate-600 leading-relaxed">{ci.targetAudience}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-cyan-600 to-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">{t.readyToTransform}</h2>
          <p className="text-cyan-100 mb-8">{t.startJourney}</p>
          <button onClick={handleStart} className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 rounded-xl text-base font-semibold hover:bg-cyan-50 transition-all shadow-lg">
            {progress.started ? t.continueLearning : t.startCourseNow}
            <ArrowRight className="w-5 h-5 rtl-flip group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>{t.footerText}</p>
          <p className="text-slate-500 mt-1">{t.selfPacedPlatform}</p>
        </div>
      </footer>
    </div>
  );
}
