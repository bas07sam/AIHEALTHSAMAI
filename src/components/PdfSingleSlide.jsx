import { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

/**
 * Renders a single PDF page (0-indexed). No built-in navigation.
 * Props:
 *  - pdfUrl: string
 *  - pageIndex: number (0-based)
 *  - onTotalPages(n): called once after PDF loads
 */
export default function PdfSingleSlide({ pdfUrl, pageIndex = 0, onTotalPages }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfRef = useRef(null);
  const mountedRef = useRef(true);

  // Load PDF
  useEffect(() => {
    if (!pdfUrl) return;
    let cancelled = false;

    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (e) {}
      renderTaskRef.current = null;
    }

    setLoading(true);
    setRendering(false);

    const oldPdf = pdfRef.current;
    pdfRef.current = null;
    if (oldPdf) { try { oldPdf.destroy(); } catch (e) {} }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdfDoc => {
      if (cancelled) { pdfDoc.destroy(); return; }
      pdfRef.current = pdfDoc;
      onTotalPages?.(pdfDoc.numPages);
      setLoading(false);
    }).catch(err => {
      if (!cancelled && err.name !== 'RenderingCancelledException' && !err.message?.includes('Worker was destroyed')) {
        console.error('PDF load error:', err);
      }
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [pdfUrl]);

  // Render specific page
  useEffect(() => {
    const pdfDoc = pdfRef.current;
    if (!pdfDoc || loading) return;
    renderPage(pdfDoc, pageIndex);
  }, [pageIndex, loading]);

  const renderPage = async (pdfDoc, idx) => {
    if (!pdfDoc || !canvasRef.current) return;
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (e) {}
      renderTaskRef.current = null;
    }
    setRendering(true);
    try {
      const pdfPage = await pdfDoc.getPage(idx + 1);
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

      const renderTask = pdfPage.render({ canvasContext: ctx, viewport: scaledViewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err) {
      if (err.name !== 'RenderingCancelledException' && !err.message?.includes('Worker was destroyed')) {
        console.error('Render error:', err);
      }
    }
    if (mountedRef.current) setRendering(false);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

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
    <div ref={containerRef} className={`bg-white rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-white' : ''}`}>
      {/* Fullscreen toggle */}
      <div className="flex justify-end px-3 py-1.5">
        <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-500" /> : <Maximize2 className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white pdf-canvas-container" style={{ minHeight: '350px' }}>
        {(loading || rendering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{loading ? t.loadingPdf : t.rendering}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center px-4 pb-4">
          <canvas ref={canvasRef} className="rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
}
