import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { sections, tools } from '../data/courseData';
import PdfSlideViewer from '../components/PdfSlideViewer';
import MatchActivity from '../components/MatchActivity';
import FlashcardActivity from '../components/FlashcardActivity';
import DragDropActivity from '../components/DragDropActivity';
import {
  BookOpen, Workflow, Bot, Code2, Lightbulb, ChevronLeft, ChevronRight,
  CheckCircle2, Target, ArrowRight
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

export default function ModulePage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { progress, updateSlide, completeSection, completeActivity, isActivityCompleted, isSectionCompleted } = useProgress();

  const sectionIdx = sections.findIndex(s => s.id === sectionId);
  const section = sections[sectionIdx];
  if (!section) return <div className="text-center py-12 text-slate-500">Module not found.</div>;

  const Icon = sectionIcons[sectionIdx];
  const completed = isSectionCompleted(section.id);
  const currentSlide = progress.currentSlides[section.id] || 0;

  const prevSection = sectionIdx > 0 ? sections[sectionIdx - 1] : null;
  const nextSection = sectionIdx < sections.length - 1 ? sections[sectionIdx + 1] : null;
  const nextIsTool = !nextSection;

  const allActivitiesDone = section.activities.every(a => isActivityCompleted(a.id));

  const handleSlideComplete = () => {
    if (allActivitiesDone && !completed) {
      completeSection(section.id);
    }
  };

  const handleActivityComplete = (activityId, score) => {
    completeActivity(activityId, score);
    const allDone = section.activities.every(a => a.id === activityId ? true : isActivityCompleted(a.id));
    if (allDone && !completed) {
      completeSection(section.id);
    }
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-cyan-50'}`}>
          {completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Icon className="w-6 h-6 text-cyan-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">Module {section.number}</span>
            {completed && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">✓ Completed</span>}
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-800">{section.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{section.shortDescription}</p>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-600" />
          Learning Outcomes
        </h3>
        <div className="flex flex-wrap gap-2">
          {section.outcomes.map(outcome => (
            <span key={outcome} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-medium border border-cyan-100">
              {outcome}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {section.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium">{tag}</span>
        ))}
      </div>

      {/* PDF Slide Viewer */}
      <div>
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-3">Lesson Content</h2>
        <PdfSlideViewer
          pdfUrl={section.pdfUrl}
          currentSlide={currentSlide}
          onSlideChange={(idx) => updateSlide(section.id, idx)}
          onComplete={handleSlideComplete}
        />
      </div>

      {/* Interactive Activities */}
      <div>
        <h2 className="font-display font-semibold text-lg text-slate-800 mb-1">Interactive Activities</h2>
        <p className="text-sm text-slate-500 mb-4">Complete these activities to reinforce your learning.</p>
        <div className="space-y-4">
          {section.activities.map(activity => (
            <div key={activity.id}>
              {renderActivity(activity)}
            </div>
          ))}
        </div>
      </div>

      {/* Mark Complete */}
      {!completed && (
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-5 text-center">
          <p className="text-sm text-cyan-700 mb-3">
            {allActivitiesDone
              ? 'All activities completed! Mark this module as done.'
              : `Complete all activities to finish this module (${section.activities.filter(a => isActivityCompleted(a.id)).length}/${section.activities.length} done)`}
          </p>
          <button
            onClick={() => completeSection(section.id)}
            disabled={!allActivitiesDone}
            className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Mark Module Complete
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {prevSection ? (
          <button onClick={() => navigate(`/module/${prevSection.id}`)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
            Module {prevSection.number}
          </button>
        ) : (
          <button onClick={() => navigate('/introduction')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
            Introduction
          </button>
        )}
        {nextSection ? (
          <button onClick={() => navigate(`/module/${nextSection.id}`)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all">
            Module {nextSection.number}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate(`/tool/${tools[0].id}`)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all">
            Tool Demos
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
