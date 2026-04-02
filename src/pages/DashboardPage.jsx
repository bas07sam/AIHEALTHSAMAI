import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { sections, tools, courseInfo, learningOutcomes } from '../data/courseData';
import {
  BookOpen, Workflow, Bot, Code2, Lightbulb, Wrench, GraduationCap,
  ChevronRight, CheckCircle2, Circle, Clock, Target, Users, Award,
  PlayCircle, ArrowRight, Lock
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { progress, getOverallProgress, isSectionCompleted, isToolCompleted } = useProgress();
  const overallProgress = getOverallProgress();
  
  const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
  const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
  const completedActivities = Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome header */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-cyan-200 text-sm font-medium mb-1">Welcome to</p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2">{courseInfo.title}</h1>
          <p className="text-cyan-100 text-sm max-w-xl mb-6">{courseInfo.subtitle}</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold">{overallProgress}%</span>
                <span className="text-sm text-cyan-200">Complete</span>
              </div>
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-cyan-200">
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{courseInfo.duration}</div>
              <div className="flex items-center gap-1.5"><Target className="w-4 h-4" />{courseInfo.level}</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{courseInfo.audience}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Modules", done: completedSections, total: 5, color: "cyan" },
          { label: "Activities", done: completedActivities, total: 10, color: "violet" },
          { label: "Tool Demos", done: completedTools, total: 6, color: "amber" },
          { label: "Final Exam", done: progress.finalExam?.passed ? 1 : 0, total: 1, color: "emerald" },
        ].map(({ label, done, total, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-800">{done}</span>
              <span className="text-sm text-slate-400 mb-0.5">/ {total}</span>
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
          <PlayCircle className="w-5 h-5 text-indigo-600" />
          Start Here
        </h2>
        <button
          onClick={() => navigate('/introduction')}
          className="w-full bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200 p-4 sm:p-5 hover:shadow-md hover:border-indigo-300 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSectionCompleted('intro-video') ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
              {isSectionCompleted('intro-video') ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <PlayCircle className="w-5 h-5 text-indigo-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  Course Introduction Video
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-sm text-slate-500">Watch the introductory video to understand the course scope, structure, and what you will learn across all modules.</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSectionCompleted('intro-video') ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-600'}`}>
                  {isSectionCompleted('intro-video') ? '✓ Watched' : 'Start here'}
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
          Course Modules
        </h2>
        <div className="space-y-3">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i];
            const completed = isSectionCompleted(section.id);
            const activitiesDone = section.activities.filter(a => progress.activities[a.id]?.completed).length;
            
            return (
              <button
                key={section.id}
                onClick={() => navigate(`/module/${section.id}`)}
                className="w-full bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md hover:border-cyan-200 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-100' : 'bg-cyan-50'}`}>
                    {completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Icon className="w-5 h-5 text-cyan-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors">
                        Module {section.number}: {section.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-3">{section.shortDescription}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {completed ? '✓ Completed' : `${section.totalSlides} slides`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${activitiesDone === section.activities.length ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {activitiesDone}/{section.activities.length} activities
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Demonstrations */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-600" />
          Tool Demonstrations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map(tool => {
            const completed = isToolCompleted(tool.id);
            const quizDone = progress.toolQuizzes[tool.id]?.completed;
            return (
              <button
                key={tool.id}
                onClick={() => navigate(`/tool/${tool.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-cyan-200 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${completed ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Wrench className="w-4 h-4 text-slate-500" />}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-cyan-700 transition-colors">{tool.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{tool.tagline}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${quizDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {quizDone ? '✓ Quiz done' : 'Quiz pending'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Final Exam */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-600" />
          Final Assessment
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-semibold text-slate-800">End-of-Course Exam</h3>
              <p className="text-sm text-slate-500 mt-1">25 questions covering all modules and tool demonstrations</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Passing: 70%</span>
                {progress.finalExam && (
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${progress.finalExam.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    Score: {progress.finalExam.percentage}%
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(progress.finalExam?.passed ? '/results' : '/final-exam')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shrink-0"
            >
              {progress.finalExam?.passed ? 'View Results' : 'Take Exam'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
