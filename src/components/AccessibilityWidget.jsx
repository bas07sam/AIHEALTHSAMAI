import { useState, useEffect, useRef } from 'react';
import {
  Accessibility, X, Sun, Moon, ZoomIn, ZoomOut, Type, Minus, Plus,
  Eye, EyeOff, RotateCcw, Contrast, AlignJustify, Pause, Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'healthai-accessibility';

const defaults = {
  fontSize: 100,
  theme: 'light',
  highContrast: false,
  lineHeight: 'normal',
  reducedMotion: false,
  dyslexiaFont: false,
  highlightLinks: false,
  cursorSize: 'normal',
};

export default function AccessibilityWidget() {
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });
  const panelRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontSize}%`;
    root.classList.remove('theme-dark', 'theme-sepia');
    if (settings.theme === 'dark') root.classList.add('theme-dark');
    if (settings.theme === 'sepia') root.classList.add('theme-sepia');
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.remove('line-relaxed', 'line-loose');
    if (settings.lineHeight === 'relaxed') root.classList.add('line-relaxed');
    if (settings.lineHeight === 'loose') root.classList.add('line-loose');
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    root.classList.toggle('highlight-links', settings.highlightLinks);
    root.classList.toggle('large-cursor', settings.cursorSize === 'large');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const reset = () => setSettings(defaults);
  const fontUp = () => update('fontSize', Math.min(settings.fontSize + 10, 150));
  const fontDown = () => update('fontSize', Math.max(settings.fontSize - 10, 70));

  const activeCount = [
    settings.fontSize !== 100,
    settings.theme !== 'light',
    settings.highContrast,
    settings.lineHeight !== 'normal',
    settings.reducedMotion,
    settings.dyslexiaFont,
    settings.highlightLinks,
    settings.cursorSize !== 'normal',
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t.accessibility}
        className={`fixed bottom-6 ${isRTL ? 'right-5' : 'left-5'} z-[9998] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          open
            ? 'bg-slate-700 text-white shadow-slate-400/30'
            : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30'
        }`}
      >
        <Accessibility className="w-5 h-5" />
        {!open && activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-label={t.accessibility}
            className={`fixed bottom-24 ${isRTL ? 'right-5' : 'left-5'} z-[9999] w-[360px] sm:w-96 max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">{t.accessibility}</h3>
                  <p className="text-[11px] text-slate-500">{t.customizeExperience}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={reset} className="p-2 rounded-lg hover:bg-white/80 transition-colors" title={t.resetToDefaults}>
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                </button>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/80 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.textSize}</label>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <button onClick={fontDown} disabled={settings.fontSize <= 70}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-all">
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-bold text-slate-800">{settings.fontSize}%</span>
                    <div className="h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((settings.fontSize - 70) / 80) * 100}%` }} />
                    </div>
                  </div>
                  <button onClick={fontUp} disabled={settings.fontSize >= 150}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-all">
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.theme}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: t.light, icon: Sun, colors: 'bg-white border-slate-200 text-slate-700' },
                    { id: 'dark', label: t.dark, icon: Moon, colors: 'bg-slate-800 border-slate-700 text-white' },
                    { id: 'sepia', label: t.sepia, icon: Eye, colors: 'bg-amber-50 border-amber-200 text-amber-800' },
                  ].map(({ id, label, icon: Icon, colors }) => (
                    <button
                      key={id}
                      onClick={() => update('theme', id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        settings.theme === id ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      } ${colors}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.lineSpacing}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: t.normal },
                    { id: 'relaxed', label: t.relaxed },
                    { id: 'loose', label: t.loose },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => update('lineHeight', id)}
                      className={`px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all ${
                        settings.lineHeight === id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <AlignJustify className="w-3.5 h-3.5 mx-auto mb-1" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.options}</label>
                {[
                  { key: 'highContrast', label: t.highContrast, desc: t.increaseContrast, icon: Contrast },
                  { key: 'dyslexiaFont', label: t.dyslexiaFont, desc: t.useDyslexic, icon: Type },
                  { key: 'reducedMotion', label: t.reduceMotion, desc: t.minimizeAnimations, icon: settings.reducedMotion ? Play : Pause },
                  { key: 'highlightLinks', label: t.highlightLinks, desc: t.underlineLinks, icon: Eye },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => update(key, !settings[key])}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-start transition-all ${
                      settings[key]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      settings[key] ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${settings[key] ? 'text-blue-800' : 'text-slate-700'}`}>{label}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </div>
                    <div className={`w-10 h-5.5 rounded-full transition-all flex items-center ${
                      settings[key] ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                    }`} style={{ padding: '2px' }}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{t.cursorSize}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', label: t.normal },
                    { id: 'large', label: t.large },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => update('cursorSize', id)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                        settings.cursorSize === id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-center shrink-0">
              <button onClick={reset} className="text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium">
                {t.resetToDefaults}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
