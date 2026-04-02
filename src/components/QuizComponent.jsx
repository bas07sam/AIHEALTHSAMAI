import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function QuizComponent({ questions, onComplete, title = "Quiz" }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const selectAnswer = (qIdx, aIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const submit = () => {
    if (Object.keys(answers).length < questions.length) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    onComplete?.(pct);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-semibold text-slate-800">{title}</h4>
          {submitted && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${score >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {score}%
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-3">
            <p className="text-sm font-medium text-slate-800">
              <span className="text-cyan-600 font-semibold mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2 pl-6">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = submitted && q.correct === oi;
                const isWrong = submitted && isSelected && q.correct !== oi;
                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(qi, oi)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                      isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                      isWrong ? 'border-red-300 bg-red-50 text-red-700' :
                      isSelected ? 'border-cyan-400 bg-cyan-50 text-cyan-800' :
                      'border-slate-200 hover:border-slate-300 text-slate-600'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-2">
                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {submitted && isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      {!submitted && (
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-full h-full rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>}
                        </div>
                      )}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {submitted ? (
            <>
              <p className="text-sm text-slate-500">
                {score >= 70 ? '✓ Quiz passed!' : 'Review and try again.'}
              </p>
              <button onClick={reset} className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-400">
                {Object.keys(answers).length} of {questions.length} answered
              </p>
              <button
                onClick={submit}
                disabled={Object.keys(answers).length < questions.length}
                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Submit Answers
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
