import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { finalExamQuestions, finalExamQuestionsAr, courseInfo } from '../data/courseData';
import {
  GraduationCap, Clock, AlertTriangle, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Send, RotateCcw, Award, Home, Shield
} from 'lucide-react';

export default function FinalExamPage() {
  const navigate = useNavigate();
  const { submitFinalExam, progress } = useProgress();
  const { t, isRTL, lang } = useLanguage();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(0);
  const confettiFired = useRef(false);

  useEffect(() => {
    let interval;
    if (started && !submitted) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [started, submitted]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const questions = lang === 'ar' ? finalExamQuestionsAr : finalExamQuestions;
  const total = questions.length;

  const selectAnswer = (qIdx, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < total) {
      const unanswered = total - Object.keys(answers).length;
      if (!confirm(t.unansweredWarning.replace('{count}', unanswered))) return;
    }
    
    let correct = 0;
    const detailed = questions.map((q, i) => {
      const userAnswer = answers[i];
      let isCorrect = false;
      if (q.type === 'true-false') {
        isCorrect = userAnswer === q.correct;
      } else {
        isCorrect = userAnswer === q.correct;
      }
      if (isCorrect) correct++;
      return { ...q, userAnswer, isCorrect };
    });

    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= courseInfo.passingScore;
    
    setResults({ correct, total, percentage, passed, detailed });
    setSubmitted(true);
    submitFinalExam(correct, total, passed, detailed);

    // Fire confetti if passed
    if (passed && !confettiFired.current) {
      confettiFired.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'] });
        setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: ['#10b981', '#06b6d4', '#f59e0b'] }), 300);
        setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: ['#8b5cf6', '#ec4899', '#06b6d4'] }), 600);
        setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.4 }, colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'] }), 1000);
      });
    }
  };

  const resetExam = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setCurrentQ(0);
    setTimer(0);
    setStarted(false);
  };

  // RTL-aware nav icons
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  // Not started - show intro
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{t.finalAssessmentTitle}</h1>
              <p className="text-indigo-200 mt-2">{t.aiAutomationVibeCodingExam}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-xs text-slate-500">{t.questions}</p>
                <p className="font-bold text-xl text-slate-800">{total}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-xs text-slate-500">{t.passScore}</p>
                <p className="font-bold text-xl text-slate-800">{courseInfo.passingScore}%</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-xs text-slate-500">{t.types}</p>
                <p className="font-bold text-xl text-slate-800">3</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-2">
              <p>{t.examCoversAll}</p>
              <div className="flex flex-wrap gap-2">
                {[t.multipleChoice, t.trueFalse, t.scenarioBased].map(type => (
                  <span key={type} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-800 font-semibold mb-0.5">{t.beforeYouBegin}</p>
                <p className="text-xs text-amber-700">{t.canNavigateQuestions}</p>
              </div>
            </div>

            {progress.finalExam && (
              <div className={`rounded-xl p-4 border ${progress.finalExam.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-sm font-medium ${progress.finalExam.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                  {t.previousAttempt}: {progress.finalExam.percentage}% ({progress.finalExam.passed ? t.passed : t.notPassed})
                </p>
              </div>
            )}

            <button
              onClick={() => setStarted(true)}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 text-base"
            >
              {t.beginExam}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submitted - show results
  if (submitted && results) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
        <div className={`rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden ${results.passed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-5">
              {results.passed ? <Award className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">
              {results.passed ? t.congratulations : t.notYetPassed}
            </h1>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              {results.passed ? t.successfullyCompleted : t.needToPass.replace('{score}', courseInfo.passingScore)}
            </p>
            <div className="text-5xl font-display font-extrabold text-white mb-2">{results.percentage}%</div>
            <p className="text-white/70 text-sm">{results.correct} {t.of} {results.total} {t.correct} · {t.time}: {formatTime(timer)}</p>
          </div>
        </div>

        {/* Question review */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-display font-semibold text-slate-800">{t.answerReview}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {results.detailed.map((q, i) => (
              <div key={i} className={`px-5 py-4 ${q.isCorrect ? '' : 'bg-red-50/30'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${q.isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {q.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="text-slate-400 me-1">Q{i + 1}.</span>
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{q.section}</span>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded capitalize">{q.typeLabel || q.type}</span>
                    </div>
                    {!q.isCorrect && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block">
                        {t.correct}: {q.type === 'true-false' ? (q.correct ? t.trueLabel : t.falseLabel) : q.options[q.correct]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={resetExam} className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <RotateCcw className="w-4 h-4" />
            {t.retakeExam}
          </button>
          {results.passed && (
            <button onClick={() => navigate('/results')} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200">
              {t.viewCertificate}
              <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // In progress - show exam questions
  const q = questions[currentQ];
  const answered = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up space-y-4">
      {/* Exam header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between sticky top-16 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-semibold text-sm text-slate-800">{t.finalExam}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg text-xs font-medium">{answered}/{total} {t.answered}</span>
          <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap items-center gap-1.5 justify-center bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              i === currentQ
                ? 'bg-indigo-600 text-white shadow-sm'
                : answers[i] !== undefined
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
            {t.question} {currentQ + 1} {t.of} {total}
          </span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs">{q.section}</span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs capitalize">{q.typeLabel || q.type}</span>
        </div>
        <h3 className="text-base font-medium text-slate-800 mt-3 mb-6">{q.question}</h3>

        {q.type === 'true-false' ? (
          <div className="space-y-2.5">
            {[true, false].map(val => (
              <button
                key={val.toString()}
                onClick={() => selectAnswer(currentQ, val)}
                className={`w-full text-start px-4 py-3.5 rounded-xl border-2 text-sm transition-all ${
                  answers[currentQ] === val
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentQ] === val ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                    {answers[currentQ] === val && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium">{val ? t.trueLabel : t.falseLabel}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(currentQ, oi)}
                className={`w-full text-start px-4 py-3.5 rounded-xl border-2 text-sm transition-all ${
                  answers[currentQ] === oi
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentQ] === oi ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                    {answers[currentQ] === oi && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <PrevIcon className="w-4 h-4" />
          {t.previous}
        </button>

        {currentQ === total - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <Send className="w-4 h-4 rtl-flip" />
            {t.submitExam}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(Math.min(total - 1, currentQ + 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            {t.next}
            <NextIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
