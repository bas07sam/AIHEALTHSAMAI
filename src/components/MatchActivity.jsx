import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MatchActivity({ activity, onComplete, completed }) {
  const { t, isRTL } = useLanguage();
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState({});
  const [done, setDone] = useState(!!completed);
  const [score, setScore] = useState(completed ? 100 : 0);
  const [showPrevResult, setShowPrevResult] = useState(!!completed);

  const leftItems = activity.pairs.map((p, i) => ({ id: i, text: p.left }));
  const rightItems = [...new Set(activity.pairs.map(p => p.right))];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleLeftClick = (id) => {
    if (done || matches[id] !== undefined) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightClick = (rightText) => {
    if (done || selectedLeft === null) return;
    const pair = activity.pairs[selectedLeft];
    const isCorrect = pair.right === rightText;
    
    setMatches(prev => ({ ...prev, [selectedLeft]: { right: rightText, correct: isCorrect } }));
    setFeedback(prev => ({ ...prev, [selectedLeft]: isCorrect }));
    setSelectedLeft(null);

    const newMatches = { ...matches, [selectedLeft]: { right: rightText, correct: isCorrect } };
    if (Object.keys(newMatches).length === activity.pairs.length) {
      const correctCount = Object.values(newMatches).filter(m => m.correct).length;
      const pct = Math.round((correctCount / activity.pairs.length) * 100);
      setScore(pct);
      setDone(true);
      setShowPrevResult(false);
      onComplete?.(pct);
    }
  };

  const reset = () => {
    setSelectedLeft(null);
    setMatches({});
    setFeedback({});
    setDone(false);
    setScore(0);
    setShowPrevResult(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-800">{activity.title}</h4>
            <p className="text-sm text-slate-500 mt-0.5">{activity.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {done && !showPrevResult && (
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${score >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {score}%
              </div>
            )}
            {done && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>
      </div>

      <div className="p-5">
        {showPrevResult && (
          <div className={`mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between`}>
            <p className="text-sm text-emerald-700">✓ {t.activityComplete}</p>
            <button onClick={reset} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all`}>
              <RotateCcw className="w-3.5 h-3.5" />
              {t.tryAgain}
            </button>
          </div>
        )}

        {!showPrevResult && (
          <>
            <div className={`grid md:grid-cols-2 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{isRTL ? 'اختر مفهوماً' : 'Select a concept'}</p>
                {leftItems.map(item => {
                  const matched = matches[item.id] !== undefined;
                  const isCorrect = feedback[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLeftClick(item.id)}
                      disabled={matched || done}
                      className={`w-full text-start px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                        matched
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-red-300 bg-red-50 text-red-700'
                          : selectedLeft === item.id
                            ? 'border-cyan-400 bg-cyan-50 text-cyan-800 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      } ${matched || done ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className={`flex items-center gap-2`}>
                        {matched && (isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />)}
                        <span>{item.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{isRTL ? 'طابق مع' : 'Match with'}</p>
                {rightItems.map(text => (
                  <button
                    key={text}
                    onClick={() => handleRightClick(text)}
                    disabled={done || selectedLeft === null}
                    className={`w-full text-start px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                      selectedLeft !== null && !done
                        ? 'border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer text-slate-700'
                        : 'border-slate-200 text-slate-500 cursor-default'
                    }`}
                  >
                    <div className={`flex items-center gap-2`}>
                      <ArrowIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {done && (
              <div className={`mt-5 flex items-center justify-between`}>
                <p className="text-sm text-slate-500">
                  {score >= 70 ? `✓ ${t.activityComplete}` : t.tryAgain}
                </p>
                <button onClick={reset} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all`}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.tryAgain}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
