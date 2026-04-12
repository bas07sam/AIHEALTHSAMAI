import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export default function PdfSlideViewer({ pdfUrl, currentSlide = 0, onSlideChange, onComplete }) {
  const { t, isRTL } = useLanguage();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfRef = useRef(null);
  const pageRef = useRef(0);
  const mountedRef = useRef(true);

  // Load PDF when pdfUrl changes
  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;

    // Cancel any in-progress render
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (e) {}
      renderTaskRef.current = null;
    }

    // Reset state
    setPage(0);
    pageRef.current = 0;
    setTotalPages(0);
    setRendering(false);
    setLoading(true);

    // Destroy old PDF
    const oldPdf = pdfRef.current;
    pdfRef.current = null;
    if (oldPdf) {
      try { oldPdf.destroy(); } catch (e) {}
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdfDoc => {
      if (cancelled) {
        pdfDoc.destroy();
        return;
      }
      pdfRef.current = pdfDoc;
      setTotalPages(pdfDoc.numPages);
      setLoading(false);
      renderPageNum(pdfDoc, 0);
    }).catch(err => {
      if (!cancelled && err.name !== 'RenderingCancelledException' && err.message !== 'Worker was destroyed') {
        console.error('PDF load error:', err);
      }
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const renderPageNum = async (pdfDoc, pageNum) => {
    if (!pdfDoc || !canvasRef.current) return;

    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (e) {}
      renderTaskRef.current = null;
    }

    setRendering(true);

    try {
      const pdfPage = await pdfDoc.getPage(pageNum + 1);
      const canvas = canvasRef.current;
      if (!canvas || !mountedRef.current) return;

      const ctx = canvas.getContext('2d');
      const container = containerRef.current;
      const containerWidth = container?.clientWidth || 800;
      const viewport = pdfPage.getViewport({ scale: 1 });
      const cssScale = Math.min((containerWidth - 32) / viewport.width, 3);
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const renderScale = cssScale * dpr;
      const scaledViewport = pdfPage.getViewport({ scale: renderScale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      canvas.style.width = `${scaledViewport.width / dpr}px`;
      canvas.style.height = `${scaledViewport.height / dpr}px`;

      const renderTask = pdfPage.render({
        canvasContext: ctx,
        viewport: scaledViewport
      });
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err) {
      if (err.name !== 'RenderingCancelledException') {
        if (!err.message?.includes('Worker was destroyed')) {
          console.error('Render error:', err);
        }
      }
    }

    if (mountedRef.current) setRendering(false);
  };

  useEffect(() => {
    const pdfDoc = pdfRef.current;
    if (pdfDoc && !loading) {
      renderPageNum(pdfDoc, page);
    }
  }, [page, loading]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const goTo = (idx) => {
    if (idx < 0 || idx >= totalPages) return;
    setPage(idx);
    pageRef.current = idx;
    onSlideChange?.(idx);
    if (idx === totalPages - 1) onComplete?.();
  };

  // For RTL: "Next" page means going left, "Previous" means going right
  const goNext = () => goTo(page + 1);
  const goPrev = () => goTo(page - 1);

  // Keyboard navigation — arrow keys are visual (left/right on screen)
  useEffect(() => {
    const handler = (e) => {
      const currentPage = pageRef.current;
      const total = pdfRef.current?.numPages || 0;
      if (e.key === 'ArrowLeft') {
        // In RTL, left arrow = next; In LTR, left arrow = prev
        if (isRTL) {
          if (currentPage < total - 1) goTo(currentPage + 1);
        } else {
          if (currentPage > 0) goTo(currentPage - 1);
        }
      }
      if (e.key === 'ArrowRight') {
        // In RTL, right arrow = prev; In LTR, right arrow = next
        if (isRTL) {
          if (currentPage > 0) goTo(currentPage - 1);
        } else {
          if (currentPage < total - 1) goTo(currentPage + 1);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRTL]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  if (!pdfUrl) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">{t.contentComingSoon}</h3>
        <p className="text-sm text-slate-500">{t.pdfComingSoonDesc}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Slide header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50`}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">{t.lessonSlides}</span>
          <span className="px-2.5 py-0.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">
            {t.slide} {page + 1} {t.of} {totalPages || '...'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {totalPages > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-cyan-500 w-4' : i <= page ? 'bg-cyan-300' : 'bg-slate-200'}`} />
              ))}
            </div>
          )}
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-500" /> : <Maximize2 className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white pdf-canvas-container" style={{ minHeight: '400px' }}>
        {(loading || rendering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{loading ? t.loadingPdf : t.rendering}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center p-4">
          <canvas ref={canvasRef} className="rounded-lg shadow-md" />
        </div>
      </div>

      {/* Navigation — In RTL, Previous is on right, Next is on left */}
      <div className={`flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50`}>
        {/* Previous button */}
        <button
          onClick={goPrev}
          disabled={page === 0}
          className={`flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t.previous}
        </button>
        <div className="text-xs text-slate-400">{t.useArrowKeys}</div>
        {/* Next button */}
        <button
          onClick={goNext}
          disabled={page === totalPages - 1}
          className={`flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        >
          {t.next}
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
