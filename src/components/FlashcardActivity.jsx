import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2, RotateCcw } from 'lucide-react';

export default function FlashcardActivity({ activity, onComplete, completed }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(completed ? new Set(activity.cards.map((_, i) => i)) : new Set());
  const [done, setDone] = useState(!!completed);

  const cards = activity.cards;
  const total = cards.length;

  const flipCard = () => setFlipped(!flipped);

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setFlipped(false);
    setCurrentCard(idx);
    const newSeen = new Set(seen).add(idx);
    setSeen(newSeen);
    if (newSeen.size === total && !done) {
      setDone(true);
      onComplete?.(100);
    }
  };

  const markSeen = () => {
    const newSeen = new Set(seen).add(currentCard);
    setSeen(newSeen);
    if (newSeen.size === total && !done) {
      setDone(true);
      onComplete?.(100);
    }
    if (currentCard < total - 1) goTo(currentCard + 1);
  };

  const reset = () => {
    setCurrentCard(0);
    setFlipped(false);
    setSeen(new Set());
    setDone(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-800">{activity.title}</h4>
            <p className="text-sm text-slate-500 mt-0.5">{activity.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-white/80 text-slate-600 rounded-full text-xs font-medium">
              {seen.size} / {total} reviewed
            </span>
            {done && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Card indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {cards.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentCard ? 'bg-cyan-500 w-5' : seen.has(i) ? 'bg-cyan-300' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 max-w-lg mx-auto" onClick={flipCard}>
          <div className={`relative cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${flipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d', minHeight: '220px' }}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
              <div className="h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg" style={{ minHeight: '220px' }}>
                <p className="text-xs text-cyan-100 uppercase tracking-wider mb-3 font-medium">Click to flip</p>
                <h3 className="text-xl font-display font-bold text-white">{cards[currentCard].front}</h3>
              </div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden' }}>
              <div className="h-full bg-white border-2 border-cyan-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg" style={{ minHeight: '220px' }}>
                <p className="text-xs text-cyan-500 uppercase tracking-wider mb-3 font-medium">Answer</p>
                <p className="text-slate-700 text-sm leading-relaxed">{cards[currentCard].back}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 max-w-lg mx-auto">
          <button
            onClick={() => goTo(currentCard - 1)}
            disabled={currentCard === 0}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button onClick={markSeen} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all">
            <CheckCircle2 className="w-4 h-4" />
            {currentCard < total - 1 ? 'Got it — Next' : 'Complete'}
          </button>
          <button
            onClick={() => goTo(currentCard + 1)}
            disabled={currentCard === total - 1}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Retry button when completed */}
        {done && (
          <div className="mt-5 flex items-center justify-between max-w-lg mx-auto">
            <p className="text-sm text-slate-500">✓ All cards reviewed! Activity completed.</p>
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
              Review Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
