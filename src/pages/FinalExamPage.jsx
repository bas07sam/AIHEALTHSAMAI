import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { finalExamQuestions, courseInfo } from '../data/courseData';
import {
  GraduationCap, Clock, AlertTriangle, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Send, RotateCcw, Award
} from 'lucide-react';

export default function FinalExamPage() {
  const navigate = useNavigate();
  const { submitFinalExam, progress } = useProgress();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(0);

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

  const questions = finalExamQuestions;
  const total = questions.length;

  const selectAnswer = (qIdx, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < total) {
      if (!confirm(`You have ${total - Object.keys(answers).length} unanswered questions. Submit anyway?`)) return;
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
    submitFinalExam(correct, total, passed);
  };

  const resetExam = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setCurrentQ(0);
    setTimer(0);
    setStarted(false);
  };

  // Not started - show intro
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Final Assessment</h1>
            <p className="text-indigo-200 mt-2">AI Automation and Vibe Coding</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="font-bold text-lg text-slate-800">{total}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Passing Score</p>
                <p className="font-bold text-lg text-slate-800">{courseInfo.passingScore}%</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-2">
              <p>This exam covers all five course modules and tool demonstrations:</p>
              <ul className="list-disc list-inside text-slate-500 space-y-1 pl-2">
                <li>Multiple choice questions</li>
                <li>True/False questions</li>
                <li>Scenario-based questions</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">You can navigate between questions before submitting. Review all answers before final submission.</p>
            </div>

            {progress.finalExam && (
              <div className={`rounded-lg p-3 ${progress.finalExam.passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <p className="text-sm font-medium ${progress.finalExam.passed ? 'text-emerald-700' : 'text-red-700'}">
                  Previous attempt: {progress.finalExam.percentage}% ({progress.finalExam.passed ? 'Passed' : 'Not passed'})
                </p>
              </div>
            )}

            <button
              onClick={() => setStarted(true)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Begin Exam
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
        <div className={`rounded-2xl p-8 text-center ${results.passed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            {results.passed ? <Award className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            {results.passed ? 'Congratulations!' : 'Not Yet Passed'}
          </h1>
          <p className="text-white/80 mb-4">
            {results.passed ? 'You have successfully completed the course!' : `You need ${courseInfo.passingScore}% to pass. Review the material and try again.`}
          </p>
          <div className="text-5xl font-display font-extrabold text-white mb-2">{results.percentage}%</div>
          <p className="text-white/70 text-sm">{results.correct} of {results.total} correct • Time: {formatTime(timer)}</p>
        </div>

        {/* Question review */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-display font-semibold text-slate-800">Answer Review</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {results.detailed.map((q, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${q.isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {q.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="text-slate-400 mr-1">Q{i + 1}.</span>
                      {q.question}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Section: {q.section} • Type: {q.type}</p>
                    {!q.isCorrect && (
                      <p className="text-xs text-emerald-600 mt-1 font-medium">
                        Correct: {q.type === 'true-false' ? (q.correct ? 'True' : 'False') : q.options[q.correct]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={resetExam} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </button>
          {results.passed && (
            <button onClick={() => navigate('/results')} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all">
              View Certificate
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-sm text-slate-800">Final Exam</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">{answered}/{total} answered</span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap items-center gap-1.5 justify-center">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
              i === currentQ
                ? 'bg-indigo-600 text-white'
                : answers[i] !== undefined
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
            Question {currentQ + 1} of {total}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{q.section}</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs capitalize">{q.type}</span>
        </div>
        <h3 className="text-base font-medium text-slate-800 mt-3 mb-5">{q.question}</h3>

        {q.type === 'true-false' ? (
          <div className="space-y-2">
            {[true, false].map(val => (
              <button
                key={val.toString()}
                onClick={() => selectAnswer(currentQ, val)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                  answers[currentQ] === val
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQ] === val ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                    {answers[currentQ] === val && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span>{val ? 'True' : 'False'}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(currentQ, oi)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                  answers[currentQ] === oi
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQ] === oi ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
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
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {currentQ === total - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all"
          >
            <Send className="w-4 h-4" />
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(Math.min(total - 1, currentQ + 1))}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
