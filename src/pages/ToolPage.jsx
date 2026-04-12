import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { tools, toolsAr, sections } from '../data/courseData';
import QuizComponent from '../components/QuizComponent';
import {
  Wrench, ChevronLeft, ChevronRight, CheckCircle2, PlayCircle,
  Stethoscope, ArrowRight, ArrowLeft, ExternalLink, Heart, Home
} from 'lucide-react';

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { completeTool, completeToolQuiz, isToolCompleted, progress } = useProgress();
  const { t, isRTL, lang } = useLanguage();

  const toolIdx = tools.findIndex(t => t.id === toolId);
  const tool = tools[toolIdx];
  if (!tool) return <div className="text-center py-12 text-slate-500">Tool not found.</div>;

  const tlAr = toolsAr[toolIdx];
  const tTagline = lang === 'ar' && tlAr ? tlAr.tagline : tool.tagline;
  const tDesc = lang === 'ar' && tlAr ? tlAr.description : tool.description;
  const tUseCase = lang === 'ar' && tlAr ? tlAr.healthcareUseCase : tool.healthcareUseCase;
  const tSummary = lang === 'ar' && tlAr ? tlAr.summaryPoints : tool.summaryPoints;
  const tQuiz = lang === 'ar' && tlAr ? tlAr.quiz : tool.quiz;

  const completed = isToolCompleted(tool.id);
  const quizDone = progress.toolQuizzes[tool.id]?.completed;

  const prevTool = toolIdx > 0 ? tools[toolIdx - 1] : null;
  const nextTool = toolIdx < tools.length - 1 ? tools[toolIdx + 1] : null;

  const handleQuizComplete = (score) => {
    completeToolQuiz(tool.id, score);
    if (score >= 70 && !completed) {
      completeTool(tool.id);
    }
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const ForwardIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${completed ? 'bg-emerald-100' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
          {completed ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <Wrench className="w-7 h-7 text-amber-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">{t.toolDemo}</span>
            {completed && <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t.completed}</span>}
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-800">{tool.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tTagline}</p>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-display font-semibold text-slate-800 mb-2">{t.overview}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{tDesc}</p>
      </div>

      {/* Healthcare Use Case */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-teal-800 mb-1.5">{t.healthcareUseCase}</h3>
            <p className="text-sm text-teal-700 leading-relaxed">{tUseCase}</p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-cyan-600 rtl-flip" />
            {t.demoVideo}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.watchDemo} {tool.name} {t.inAction}</p>
        </div>
        <div className="relative bg-slate-900 aspect-video">
          {tool.videoUrl ? (
            <iframe
              src={tool.videoUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${tool.name} Demo`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <PlayCircle className="w-16 h-16 mx-auto mb-3 opacity-30 rtl-flip" />
                <p className="text-sm">Video placeholder</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Points */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-display font-semibold text-slate-800 mb-3">{t.keyTakeaways}</h3>
        <div className="space-y-2.5">
          {tSummary.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-cyan-600" />
              </div>
              <p className="text-sm text-slate-600">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Quiz */}
      <div>
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-3">{t.knowledgeCheck}</h2>
        <QuizComponent
          questions={tQuiz}
          onComplete={handleQuizComplete}
          title={`${tool.name} ${lang === 'ar' ? 'اختبار' : 'Quiz'}`}
        />
      </div>

      {/* Mark complete */}
      {!completed && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 text-center shadow-sm">
          <p className="text-sm text-amber-700 mb-3">
            {quizDone ? t.quizCompleted : t.completeQuizFirst}
          </p>
          <button
            onClick={() => completeTool(tool.id)}
            disabled={!quizDone}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {t.markToolComplete}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all" title={t.home}>
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t.home}</span>
          </button>
          {prevTool ? (
            <button onClick={() => navigate(`/tool/${prevTool.id}`)} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <PrevIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{prevTool.name}</span>
            </button>
          ) : (
            <button onClick={() => navigate(`/module/${sections[sections.length - 1].id}`)} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <PrevIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.module} 5</span>
            </button>
          )}
        </div>
        {nextTool ? (
          <button onClick={() => navigate(`/tool/${nextTool.id}`)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm">
            {nextTool.name}
            <NextIcon className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate('/final-exam')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            {t.finalExam}
            <ForwardIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
