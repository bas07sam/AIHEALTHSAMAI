import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { courseInfo, learningOutcomes, skills, sections, tools } from '../data/courseData';
import {
  Award, CheckCircle2, Download, Share2, ArrowLeft,
  BookOpen, Wrench, GraduationCap, Heart, Star, Trophy
} from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { progress, getOverallProgress } = useProgress();
  const overallProgress = getOverallProgress();
  const exam = progress.finalExam;

  const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
  const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
  const completedActivities = Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length;

  const passed = exam?.passed;
  const completionDate = exam?.completedAt ? new Date(exam.completedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'N/A';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Certificate Area */}
      {passed ? (
        <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-8 sm:p-12 text-center relative">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-300 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-300 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-300 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-300 rounded-br-lg" />

            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <Trophy className="w-6 h-6 text-amber-500" />
              <Star className="w-5 h-5 text-amber-400" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-semibold mb-3">Certificate of Completion</p>
            
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-200">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <p className="text-sm text-slate-500 mb-1">This certifies successful completion of</p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 mb-1">{courseInfo.title}</h1>
            <p className="text-sm text-slate-500 mb-6">{courseInfo.subtitle}</p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Final Score: {exam?.percentage}%
            </div>

            <p className="text-xs text-slate-400">Completed on {completionDate}</p>
            <p className="text-xs text-slate-400 mt-1">HealthAI Academy • Self-Paced Learning</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-2">Course Progress</h1>
          <p className="text-slate-500 mb-4">
            {exam
              ? `Your exam score was ${exam.percentage}%. You need ${courseInfo.passingScore}% to earn your certificate.`
              : 'Complete the final exam to earn your certificate.'}
          </p>
          <button onClick={() => navigate('/final-exam')} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
            {exam ? 'Retake Exam' : 'Take Final Exam'}
          </button>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-display font-semibold text-slate-800 mb-4">Course Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{overallProgress}%</div>
            <div className="text-xs text-slate-500">Overall</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{completedSections}/5</div>
            <div className="text-xs text-slate-500">Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{completedTools}/6</div>
            <div className="text-xs text-slate-500">Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{completedActivities}/10</div>
            <div className="text-xs text-slate-500">Activities</div>
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Module completion */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-display font-semibold text-slate-800">Module Completion</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {sections.map(section => {
            const completed = progress.sections[section.id]?.completed;
            return (
              <div key={section.id} className="px-5 py-3 flex items-center gap-3">
                {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                <span className={`text-sm ${completed ? 'text-slate-700' : 'text-slate-400'}`}>
                  Section {section.number}: {section.title}
                </span>
              </div>
            );
          })}
          <div className="px-5 py-2 bg-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tool Demonstrations</p>
          </div>
          {tools.map(tool => {
            const completed = progress.tools[tool.id]?.completed;
            return (
              <div key={tool.id} className="px-5 py-3 flex items-center gap-3">
                {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                <span className={`text-sm ${completed ? 'text-slate-700' : 'text-slate-400'}`}>{tool.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills earned */}
      {passed && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-3">Skills Earned</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        {passed && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-all"
          >
            <Download className="w-4 h-4" />
            Print Certificate
          </button>
        )}
      </div>
    </div>
  );
}
