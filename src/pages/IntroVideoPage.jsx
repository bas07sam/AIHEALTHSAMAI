import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { sections, sectionsAr } from '../data/courseData';
import {
  PlayCircle, CheckCircle2, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight,
  Clock, BookOpen, Heart, Sparkles
} from 'lucide-react';

export default function IntroVideoPage() {
  const navigate = useNavigate();
  const { progress, completeSection, isSectionCompleted } = useProgress();
  const { t, isRTL, lang } = useLanguage();
  const completed = isSectionCompleted('intro-video');

  const handleMarkComplete = () => {
    completeSection('intro-video');
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-indigo-50'}`}>
          {completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <PlayCircle className="w-6 h-6 text-indigo-600 rtl-flip" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">{t.introTag}</span>
            {completed && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">{t.watched}</span>}
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-800">{t.courseIntroVideoTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.introDesc}</p>
        </div>
      </div>

      {/* Key info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Heart, label: t.sector, value: t.healthcare, color: "text-rose-500 bg-rose-50" },
          { icon: Clock, label: t.duration, value: t.twoHours, color: "text-cyan-500 bg-cyan-50" },
          { icon: BookOpen, label: t.modules, value: t.modulesPlus, color: "text-violet-500 bg-violet-50" },
          { icon: Sparkles, label: t.level, value: t.beginnerPlus, color: "text-amber-500 bg-amber-50" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mx-auto mb-1.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-600 rtl-flip" />
            {t.courseIntroduction}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.watchFullVideo}</p>
        </div>
        <div className="relative bg-slate-900 aspect-video">
          <iframe
            src="https://www.youtube.com/embed/iYhdJRD1wG8"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Course Introduction Video"
          />
        </div>
      </div>

      {/* What you'll cover */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-display font-semibold text-slate-800 mb-3">{t.whatCoursCovers}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ...sections.map((s, i) => ({ 
              title: `${t.module} ${s.number}: ${lang === 'ar' && sectionsAr[i] ? sectionsAr[i].title : s.title}`,
              desc: lang === 'ar' && sectionsAr[i] ? sectionsAr[i].outcomes[0] : s.outcomes[0]
            })),
            { title: lang === 'ar' ? 'عروض الأدوات' : 'Tool Demonstrations', desc: "Lovable, Replit, Claude Code, n8n, Make, Zapier" },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mark complete & navigate */}
      {!completed && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5 text-center">
          <p className="text-sm text-indigo-700 mb-3">{t.finishedWatching}</p>
          <button
            onClick={handleMarkComplete}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
          >
            {t.markAsWatched}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
          <BackIcon className="w-4 h-4" />
          {t.dashboard}
        </button>
        <button onClick={() => navigate('/module/section-1')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all">
          {t.startModule1}
          <NextIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
