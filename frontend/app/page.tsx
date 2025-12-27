'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ViewState } from './types';
import { INITIAL_VIEW, DEBOUNCE_ZOOM_PAN, DEBOUNCE_ITERATIONS } from './constants';
import { debounce } from './utils/helpers';
import { useCanvasRenderer } from './hooks/useCanvasRenderer';
import { useZoomPan } from './hooks/useZoomPan';
import { useMandelbrotData } from './hooks/useMandelbrotData';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { ControlPanel } from './components/ControlPanel';
import { LoadingIndicator, ProgressBadge } from './components/LoadingIndicator';
import { ErrorToast } from './components/ErrorToast';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export default function Home() {
  // State
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW);
  const [renderProgress, setRenderProgress] = useState<number>(100);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });
    }
  }, []);

  // Performance monitoring
  const {
    metrics,
    recordApiCall,
    recordRender,
    reset: resetMetrics
  } = usePerformanceMonitor();

  // Custom hooks
  const { renderCanvas } = useCanvasRenderer(
    ctxRef,
    viewState.maxIterations,
    viewState.width,
    viewState.height,
    setRenderProgress,
    recordRender
  );

  const { isLoading, error, setError, fetchMandelbrot, cleanup } = useMandelbrotData(
    renderCanvas,
    viewState,
    setRenderProgress,
    recordApiCall
  );

  const zoomPanHandlers = useZoomPan(canvasRef, viewState, setViewState);

  // Debounced fetch functions
  const debouncedFetchZoomPan = useMemo(
    () => debounce(fetchMandelbrot, DEBOUNCE_ZOOM_PAN),
    [fetchMandelbrot]
  );

  const debouncedFetchIterations = useMemo(
    () => debounce(fetchMandelbrot, DEBOUNCE_ITERATIONS),
    [fetchMandelbrot]
  );

  // Fetch on viewState change
  const prevIterationsRef = useRef(viewState.maxIterations);
  useEffect(() => {
    if (prevIterationsRef.current !== viewState.maxIterations) {
      prevIterationsRef.current = viewState.maxIterations;
      debouncedFetchIterations(viewState);
    } else {
      debouncedFetchZoomPan(viewState);
    }
  }, [viewState, debouncedFetchZoomPan, debouncedFetchIterations]);

  // Reset handler
  const handleReset = () => {
    setViewState(INITIAL_VIEW);
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-900">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={viewState.width}
        height={viewState.height}
        onWheel={zoomPanHandlers.handleWheel}
        onMouseDown={zoomPanHandlers.handleMouseDown}
        onMouseMove={zoomPanHandlers.handleMouseMove}
        onMouseUp={zoomPanHandlers.handleMouseUp}
        onMouseLeave={zoomPanHandlers.handleMouseLeave}
        className="border-2 border-zinc-700 rounded-lg shadow-2xl cursor-grab"
      />

      {/* Control Panel */}
      {showControls && (
        <ControlPanel
          viewState={viewState}
          onViewStateChange={setViewState}
          onReset={handleReset}
          onToggle={() => setShowControls(false)}
        />
      )}

      {/* Toggle Controls Button (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-6 right-6 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium shadow-lg"
        >
          Show Controls
        </button>
      )}

      {/* Loading Indicator */}
      {isLoading && <LoadingIndicator renderProgress={renderProgress} />}

      {/* Progress Badge */}
      {!isLoading && <ProgressBadge progress={renderProgress} />}

      {/* Error Toast */}
      <ErrorToast error={error} onDismiss={() => setError(null)} />

      {/* Performance Metrics */}
      {showMetrics && (
        <PerformanceMetrics
          metrics={metrics}
          onReset={resetMetrics}
          onToggle={() => setShowMetrics(false)}
        />
      )}

      {/* Toggle Metrics Button (when hidden) */}
      {!showMetrics && (
        <button
          onClick={() => setShowMetrics(true)}
          className="absolute bottom-6 left-6 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium shadow-lg"
        >
          Show Metrics
        </button>
      )}
    </div>
  );
}
