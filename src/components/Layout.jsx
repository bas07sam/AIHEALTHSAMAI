import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { sections, tools } from '../data/courseData';
import {
  BookOpen, Cpu, Workflow, Bot, Code2, Lightbulb, Wrench,
  GraduationCap, Menu, X, ChevronDown, ChevronRight,
  CheckCircle2, Circle, Home, RotateCcw, Heart, PlayCircle
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionsExpanded, setSectionsExpanded] = useState(true);
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const { isSectionCompleted, isToolCompleted, progress, getOverallProgress, resetProgress } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const overallProgress = getOverallProgress();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo area */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-800 leading-tight">AI Automation</h2>
              <p className="text-[10px] text-slate-500">Healthcare Learning</p>
            </div>
            <button onClick={closeSidebar} className="ml-auto lg:hidden p-1 rounded hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Course Progress</span>
              <span className="font-semibold text-cyan-600">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Home className="w-4 h-4" />
            Dashboard
          </NavLink>

          {/* Intro Video */}
          <NavLink to="/introduction" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
            {isSectionCompleted('intro-video') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <PlayCircle className="w-4 h-4" />
            )}
            Introduction Video
          </NavLink>

          {/* Sections */}
          <div className="pt-2">
            <button onClick={() => setSectionsExpanded(!sectionsExpanded)} className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Modules</span>
              {sectionsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sectionsExpanded && sections.map((section, i) => {
              const Icon = sectionIcons[i];
              const completed = isSectionCompleted(section.id);
              return (
                <NavLink
                  key={section.id}
                  to={`/module/${section.id}`}
                  onClick={closeSidebar}
                  className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Icon className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate text-[13px]">{section.number}. {section.title}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Tools */}
          <div className="pt-2">
            <button onClick={() => setToolsExpanded(!toolsExpanded)} className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Tool Demos</span>
              {toolsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {toolsExpanded && tools.map((tool) => {
              const completed = isToolCompleted(tool.id);
              return (
                <NavLink
                  key={tool.id}
                  to={`/tool/${tool.id}`}
                  onClick={closeSidebar}
                  className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Wrench className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate text-[13px]">{tool.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Final Exam */}
          <div className="pt-2">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessment</div>
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
              <span className="text-[13px]">Final Exam</span>
            </NavLink>
          </div>
        </nav>

        {/* Reset */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { resetProgress(); navigate('/dashboard'); } }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600" />
            <h1 className="font-display font-semibold text-slate-800 text-sm sm:text-base">AI Automation & Vibe Coding</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Self-paced</span>
            </div>
            <div className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold">
              {overallProgress}% Complete
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
