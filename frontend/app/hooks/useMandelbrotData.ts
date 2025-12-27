import { useCallback, useRef, useState } from 'react';
import { ViewState } from '../types';
import { API_URL } from '../constants';

export function useMandelbrotData(
  renderCanvas: (data: number[][]) => void,
  viewState: ViewState,
  setRenderProgress: (progress: number) => void,
  recordApiCall?: (duration: number) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mandelbrotDataRef = useRef<number[][] | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch Mandelbrot data (backend handles caching)
  const fetchMandelbrot = useCallback(async (params: ViewState) => {

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    setRenderProgress(0);

    const apiStartTime = performance.now();

    try {
      const response = await fetch(`${API_URL}/api/mandelbrot`, {
        method: 'POST',
        signal: abortControllerRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center_x: params.centerX,
          center_y: params.centerY,
          zoom: params.zoom,
          max_iterations: params.maxIterations,
          width: params.width,
          height: params.height,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      const apiDuration = performance.now() - apiStartTime;
      recordApiCall?.(apiDuration);

      const data = result.data;
      mandelbrotDataRef.current = data;

      // Render the data
      renderCanvas(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }

      if (err instanceof TypeError) {
        setError('Network error. Is the backend running on port 8000?');
      } else {
        setError(err.message || 'Unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [renderCanvas, viewState.width, viewState.height, setRenderProgress, recordApiCall]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    isLoading,
    error,
    setError,
    fetchMandelbrot,
    cleanup,
  };
}
