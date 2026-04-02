import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { courseInfo, learningOutcomes, skills, sections, tools } from '../data/courseData';
import {
  Play, Clock, BarChart3, Users, Monitor, Award, Cpu, Heart,
  BookOpen, Workflow, Bot, Code2, Lightbulb, Wrench, ChevronRight,
  CheckCircle2, Sparkles, Shield, Zap, Target, GraduationCap, ArrowRight
} from 'lucide-react';

const sectionIcons = [BookOpen, Workflow, Bot, Code2, Lightbulb];

export default function LandingPage() {
  const navigate = useNavigate();
  const { startCourse, getOverallProgress, progress } = useProgress();

  const handleStart = () => {
    startCourse();
    navigate('/dashboard');
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-800 text-sm">HealthAI Academy</span>
              <span className="hidden sm:block text-[10px] text-slate-500">Learning Platform</span>
            </div>
          </div>
          <button onClick={handleStart} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-200">
            {progress.started ? 'Continue Learning' : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-500/30">
                {courseInfo.sector}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                {courseInfo.level}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                {courseInfo.deliveryMode}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
              {courseInfo.title}
            </h1>
            <p className="text-lg sm:text-xl text-cyan-100 font-medium mb-3">
              {courseInfo.subtitle}
            </p>
            <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
              {courseInfo.catalogSummary}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button onClick={handleStart} className="group flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-xl text-base font-semibold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25">
                <Play className="w-5 h-5" />
                {progress.started ? 'Continue Course' : 'Start Course'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a href="#overview" className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all border border-white/20">
                Learn More
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{courseInfo.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>{courseInfo.level}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{courseInfo.audience}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>{courseInfo.deliveryMode}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress card (if started) */}
      {progress.started && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800">Your Progress</h3>
              <span className="text-2xl font-bold text-cyan-600">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length} of 5 modules</span>
              <span>{Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length} of 6 tools</span>
              <span>Exam: {progress.finalExam?.passed ? 'Passed ✓' : 'Not taken'}</span>
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold mb-4">Course Overview</span>
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">What You'll Learn</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{courseInfo.description}</p>
            <p className="text-slate-600 leading-relaxed mb-6">{courseInfo.fullDescription}</p>
            
            <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100">
              <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Course Objective
              </h4>
              <p className="text-sm text-cyan-700 leading-relaxed">{courseInfo.objective}</p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-semibold text-slate-800 mb-1">Course Details</h3>
              <p className="text-xs text-slate-500 mb-5">{courseInfo.courseType}</p>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: "Duration", value: courseInfo.duration },
                  { icon: BarChart3, label: "Level", value: courseInfo.level },
                  { icon: Users, label: "Audience", value: courseInfo.audience },
                  { icon: Heart, label: "Sector", value: courseInfo.sector },
                  { icon: Monitor, label: "Delivery", value: courseInfo.deliveryMode },
                  { icon: Award, label: "Passing Score", value: `${courseInfo.passingScore}%` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
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
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-4">Why This Matters</span>
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">Transform Healthcare Workflows</h2>
            <p className="text-slate-600 leading-relaxed">{courseInfo.whyMatters}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Zap, title: "Faster Workflows", desc: "Automate repetitive tasks and speed up processes" },
              { icon: Shield, title: "Fewer Errors", desc: "Reduce manual mistakes with consistent automation" },
              { icon: Sparkles, title: "Smart Decisions", desc: "AI-powered insights for better decision support" },
              { icon: Target, title: "Rapid Prototyping", desc: "Build solutions quickly with vibe coding" }
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
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-4">Learning Outcomes</span>
        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8">By the end of this course, you will be able to:</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {learningOutcomes.map((outcome, i) => (
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
          <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold mb-4 border border-cyan-500/30">Skills & Competencies</span>
          <h2 className="font-display font-bold text-3xl text-white mb-8">Skills You'll Develop</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <div key={skill} className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold mb-4">Course Structure</span>
        <h2 className="font-display font-bold text-3xl text-slate-800 mb-8">5 Modules + Tool Demos + Final Exam</h2>
        
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i];
            return (
              <div key={section.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-slate-800 mb-1">
                      Section {section.number}: {section.title}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{section.shortDescription}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {section.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools */}
        <h3 className="font-display font-semibold text-xl text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-600" />
          Tool Demonstrations
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {tools.map(tool => (
            <div key={tool.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
              <h5 className="font-semibold text-slate-800 text-sm">{tool.name}</h5>
              <p className="text-xs text-slate-500">{tool.tagline}</p>
            </div>
          ))}
        </div>

        {/* Final Exam */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-indigo-800">Final Assessment</h4>
              <p className="text-sm text-indigo-600">25 questions covering all modules and tool demonstrations. Passing score: 70%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Target Audience */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-800 mb-4">Prerequisites</h3>
            <p className="text-slate-600 leading-relaxed">{courseInfo.prerequisites}</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-800 mb-4">Who Is This For?</h3>
            <p className="text-slate-600 leading-relaxed">{courseInfo.targetAudience}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-cyan-600 to-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to Transform Healthcare with AI?</h2>
          <p className="text-cyan-100 mb-8">Start your journey into AI automation and vibe coding today.</p>
          <button onClick={handleStart} className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 rounded-xl text-base font-semibold hover:bg-cyan-50 transition-all shadow-lg">
            {progress.started ? 'Continue Learning' : 'Start Course Now'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>HealthAI Academy — AI Automation & Vibe Coding for Healthcare</p>
          <p className="text-slate-500 mt-1">Self-paced learning platform</p>
        </div>
      </footer>
    </div>
  );
}
