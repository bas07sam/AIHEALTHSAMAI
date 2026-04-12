import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { courseInfo, courseInfoAr, learningOutcomes, skills, skillsAr, sections, sectionsAr, tools } from '../data/courseData';
import SkillRadarChart from '../components/SkillRadarChart';
import {
  Award, CheckCircle2, Download, ArrowLeft, ArrowRight,
  BookOpen, GraduationCap, Star, Trophy,
  ExternalLink, Rocket, Sparkles, Share2, Copy, Check
} from 'lucide-react';

function ShareAchievement({ score, t }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just earned my AI Automation & Vibe Coding certificate from SDAIA Academy with a score of ${score}%! Ready to transform healthcare workflows with AI.`;
  const shareUrl = 'https://athkax.sdaia.academy.gov.sa';
  const hashtags = 'AIAutomation,VibeCoding,SDAIA,HealthcareAI,AthkaX';

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-cyan-600" />
        <h3 className="font-display font-semibold text-slate-800">{t.shareYourAchievement}</h3>
      </div>
      <p className="text-sm text-slate-500 mb-5">{t.shareDesc}</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={shareLinkedIn}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] text-white rounded-xl text-sm font-semibold hover:bg-[#004182] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          {t.linkedin}
        </button>
        <button
          onClick={shareX}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          {t.postOnX}
        </button>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
            copied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t.copied : t.copyText}
        </button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { progress, getOverallProgress } = useProgress();
  const { t, isRTL, lang } = useLanguage();
  const ci = lang === 'ar' ? courseInfoAr : courseInfo;
  const sk = lang === 'ar' ? skillsAr : skills;
  const overallProgress = getOverallProgress();
  const exam = progress.finalExam;

  const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
  const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
  const completedActivities = Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length;

  const passed = exam?.passed;
  const completionDate = exam?.completedAt ? new Date(exam.completedAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'N/A';

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-8">
      {/* Certificate Area */}
      {passed ? (
        <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Star className="w-5 h-5 text-amber-400 animate-pulse" />
              <Trophy className="w-6 h-6 text-amber-500" />
              <Star className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800">{t.certificateOfCompletion}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.finalScore}: <span className="font-bold text-emerald-600">{exam?.percentage}%</span> — {t.completedOn} {completionDate}
            </p>
          </div>
          <div className="p-5 flex justify-center bg-gradient-to-b from-white to-amber-50/30">
            <div className="relative group max-w-2xl w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
              <img
                src="/images/athkax-certificate.png"
                alt="AthkaX Academy Certificate — AI Automation and Vibe Coding for Healthcare"
                className="relative w-full rounded-lg shadow-lg border border-amber-200"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-5">
            <GraduationCap className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-3">{t.courseProgressTitle}</h1>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {exam
              ? t.examScoreMessage.replace('{score}', exam.percentage).replace('{passing}', ci.passingScore)
              : t.completeExamMessage}
          </p>
          <button onClick={() => navigate('/final-exam')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
            {exam ? t.retakeExamBtn : t.takeFinalExam}
          </button>
        </div>
      )}

      {/* Radar Chart */}
      {exam?.detailedResults && (
        <SkillRadarChart detailedResults={exam.detailedResults} />
      )}

      {/* Progress Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-display font-semibold text-slate-800 mb-5 text-lg">{t.courseSummary}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: t.overall, value: `${overallProgress}%`, color: "cyan" },
            { label: t.modulesProgress, value: `${completedSections}/5`, color: "blue" },
            { label: t.toolsProgress, value: `${completedTools}/6`, color: "amber" },
            { label: t.activitiesProgress, value: `${completedActivities}/10`, color: "violet" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Module completion */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-display font-semibold text-slate-800">{t.moduleCompletion}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {sections.map(section => {
            const completed = progress.sections[section.id]?.completed;
            return (
              <div key={section.id} className={`px-5 py-3.5 flex items-center gap-3 transition-colors ${completed ? 'hover:bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                {completed ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 shrink-0" />}
                <span className={`text-sm ${completed ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                  {t.section} {section.number}: {lang === 'ar' && sectionsAr[sections.indexOf(section)] ? sectionsAr[sections.indexOf(section)].title : section.title}
                </span>
                {completed && <span className="ms-auto text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">{t.done}</span>}
              </div>
            );
          })}
          <div className="px-5 py-2.5 bg-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.toolDemosHeader}</p>
          </div>
          {tools.map(tool => {
            const completed = progress.tools[tool.id]?.completed;
            return (
              <div key={tool.id} className={`px-5 py-3.5 flex items-center gap-3 transition-colors ${completed ? 'hover:bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                {completed ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 shrink-0" />}
                <span className={`text-sm ${completed ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{tool.name}</span>
                {completed && <span className="ms-auto text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">{t.done}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share */}
      {passed && <ShareAchievement score={exam?.percentage} t={t} />}

      {/* Skills earned */}
      {passed && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-display font-semibold text-slate-800 mb-4">{t.skillsEarned}</h3>
          <div className="flex flex-wrap gap-2">
            {sk.map(skill => (
              <div key={skill} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SDAIA Academy Promotion */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8 relative">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">{t.continueJourney}</span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
              {t.exploreMore}
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-lg">
              {t.sdaiaDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <a
                href="https://athkax.sdaia.academy.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                {t.visitSdaia}
                <ExternalLink className="w-3.5 h-3.5 rtl-flip" />
              </a>
              <span className="text-xs text-blue-200">athkax.sdaia.academy.gov.sa</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-blue-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><Rocket className="w-3.5 h-3.5" /> {t.bootcamps}</span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><BookOpen className="w-3.5 h-3.5" /> {t.selfLearning}</span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><GraduationCap className="w-3.5 h-3.5" /> {t.certifications}</span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><Award className="w-3.5 h-3.5" /> {t.advancedPrograms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <BackIcon className="w-4 h-4" />
          {t.backToDashboard}
        </button>
        {passed && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-sm shadow-amber-200"
          >
            <Download className="w-4 h-4" />
            {t.printCertificate}
          </button>
        )}
      </div>
    </div>
  );
}
