import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, GripVertical, ArrowDown } from 'lucide-react';

export default function DragDropActivity({ activity, onComplete, completed }) {
  const [items, setItems] = useState(() => 
    [...activity.items].sort(() => Math.random() - 0.5)
  );
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState(null);
  const [done, setDone] = useState(!!completed);
  const [showPrevResult, setShowPrevResult] = useState(!!completed);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    const dragIdx = draggedIdx;
    if (dragIdx === null || dragIdx === dropIdx) return;
    
    const newItems = [...items];
    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(dropIdx, 0, removed);
    setItems(newItems);
    setDraggedIdx(null);
    setDragOverIdx(null);
    setChecked(false);
    setResults(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Touch support - move up/down
  const moveItem = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const newItems = [...items];
    [newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]];
    setItems(newItems);
    setChecked(false);
    setResults(null);
  };

  const checkOrder = () => {
    const res = items.map((item, idx) => ({
      ...item,
      correct: item.order === idx + 1
    }));
    setResults(res);
    setChecked(true);

    const correctCount = res.filter(r => r.correct).length;
    const pct = Math.round((correctCount / items.length) * 100);
    if (pct >= 70) {
      setDone(true);
      onComplete?.(pct);
    }
  };

  const reset = () => {
    setItems([...activity.items].sort(() => Math.random() - 0.5));
    setChecked(false);
    setResults(null);
    setDone(false);
    setShowPrevResult(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-slate-800">{activity.title}</h4>
            <p className="text-sm text-slate-500 mt-0.5">{activity.description}</p>
          </div>
          {done && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        </div>
      </div>

      <div className="p-5">
        {/* Previously completed message with retry */}
        {showPrevResult && (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
            <p className="text-sm text-emerald-700">✓ You've already completed this activity.</p>
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {!showPrevResult && (
          <>
            <p className="text-xs text-slate-400 mb-3 font-medium">Drag items to arrange in correct order (or use arrows on mobile)</p>
            
            <div className="space-y-2 max-w-xl mx-auto">
              {items.map((item, idx) => {
                const result = results?.[idx];
                return (
                  <div key={item.id}>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing ${
                        dragOverIdx === idx ? 'border-cyan-400 bg-cyan-50' :
                        checked 
                          ? result?.correct 
                            ? 'border-emerald-300 bg-emerald-50' 
                            : 'border-red-300 bg-red-50'
                          : draggedIdx === idx 
                            ? 'border-cyan-400 bg-cyan-50 opacity-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700 flex-1">{item.text}</span>
                      {checked && (
                        result?.correct
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      {/* Mobile arrows */}
                      <div className="flex flex-col gap-0.5 sm:hidden">
                        <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5 text-slate-400 rotate-180" />
                        </button>
                        <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-5">
              <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
                Shuffle & Reset
              </button>
              <button
                onClick={checkOrder}
                className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all"
              >
                Check Order
              </button>
            </div>

            {checked && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${results?.every(r => r.correct) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {results?.every(r => r.correct)
                  ? '✓ Perfect! All items are in the correct order.'
                  : `${results?.filter(r => r.correct).length} of ${items.length} items are in the correct position. Try rearranging the highlighted items.`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
