import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { tools, sections } from '../data/courseData';
import QuizComponent from '../components/QuizComponent';
import {
  Wrench, ChevronLeft, ChevronRight, CheckCircle2, PlayCircle,
  Stethoscope, ArrowRight, ExternalLink, Heart
} from 'lucide-react';

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { completeTool, completeToolQuiz, isToolCompleted, progress } = useProgress();

  const toolIdx = tools.findIndex(t => t.id === toolId);
  const tool = tools[toolIdx];
  if (!tool) return <div className="text-center py-12 text-slate-500">Tool not found.</div>;

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

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-amber-50'}`}>
          {completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Wrench className="w-6 h-6 text-amber-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold">Tool Demo</span>
            {completed && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">✓ Completed</span>}
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-800">{tool.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tool.tagline}</p>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-display font-semibold text-slate-800 mb-2">Overview</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
      </div>

      {/* Healthcare Use Case */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-teal-800 mb-1">Healthcare Use Case</h3>
            <p className="text-sm text-teal-700 leading-relaxed">{tool.healthcareUseCase}</p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-cyan-600" />
            Demo Video
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Watch the demonstration to see {tool.name} in action</p>
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
                <PlayCircle className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Video placeholder — Replace URL in courseData.js</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Points */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-display font-semibold text-slate-800 mb-3">Key Takeaways</h3>
        <div className="space-y-2">
          {tool.summaryPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Quiz */}
      <div>
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-3">Knowledge Check</h2>
        <QuizComponent
          questions={tool.quiz}
          onComplete={handleQuizComplete}
          title={`${tool.name} Quiz`}
        />
      </div>

      {/* Mark complete */}
      {!completed && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 text-center">
          <p className="text-sm text-amber-700 mb-3">
            {quizDone ? 'Quiz completed! Mark this tool demo as done.' : 'Complete the quiz above to finish this tool demo.'}
          </p>
          <button
            onClick={() => completeTool(tool.id)}
            disabled={!quizDone}
            className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Mark Tool Complete
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {prevTool ? (
          <button onClick={() => navigate(`/tool/${prevTool.id}`)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
            {prevTool.name}
          </button>
        ) : (
          <button onClick={() => navigate(`/module/${sections[sections.length - 1].id}`)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
            Module 5
          </button>
        )}
        {nextTool ? (
          <button onClick={() => navigate(`/tool/${nextTool.id}`)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all">
            {nextTool.name}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate('/final-exam')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
            Final Exam
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
