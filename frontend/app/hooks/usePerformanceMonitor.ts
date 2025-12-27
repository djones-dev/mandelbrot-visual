import { useState, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  lastApiCallTime: number;
  lastRenderTime: number;
  lastTotalTime: number;
  totalApiCalls: number;
  totalRenders: number;
  avgApiCallTime: number;
  avgRenderTime: number;
  avgTotalTime: number;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lastApiCallTime: 0,
    lastRenderTime: 0,
    lastTotalTime: 0,
    totalApiCalls: 0,
    totalRenders: 0,
    avgApiCallTime: 0,
    avgRenderTime: 0,
    avgTotalTime: 0,
  });

  const apiTimesRef = useRef<number[]>([]);
  const renderTimesRef = useRef<number[]>([]);
  const totalTimesRef = useRef<number[]>([]);

  const recordApiCall = useCallback((duration: number) => {
    apiTimesRef.current.push(duration);

    // Keep only last 20 measurements
    if (apiTimesRef.current.length > 20) {
      apiTimesRef.current.shift();
    }

    const avgApiCallTime = apiTimesRef.current.reduce((a, b) => a + b, 0) / apiTimesRef.current.length;

    setMetrics(prev => ({
      ...prev,
      lastApiCallTime: duration,
      totalApiCalls: prev.totalApiCalls + 1,
      avgApiCallTime,
    }));
  }, []);

  const recordRender = useCallback((duration: number) => {
    renderTimesRef.current.push(duration);

    // Keep only last 20 measurements
    if (renderTimesRef.current.length > 20) {
      renderTimesRef.current.shift();
    }

    const avgRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;

    setMetrics(prev => {
      const totalTime = prev.lastApiCallTime + duration;
      totalTimesRef.current.push(totalTime);

      // Keep only last 20 measurements
      if (totalTimesRef.current.length > 20) {
        totalTimesRef.current.shift();
      }

      const avgTotalTime = totalTimesRef.current.reduce((a, b) => a + b, 0) / totalTimesRef.current.length;

      return {
        ...prev,
        lastRenderTime: duration,
        lastTotalTime: totalTime,
        totalRenders: prev.totalRenders + 1,
        avgRenderTime,
        avgTotalTime,
      };
    });
  }, []);

  const reset = useCallback(() => {
    apiTimesRef.current = [];
    renderTimesRef.current = [];
    totalTimesRef.current = [];
    setMetrics({
      lastApiCallTime: 0,
      lastRenderTime: 0,
      lastTotalTime: 0,
      totalApiCalls: 0,
      totalRenders: 0,
      avgApiCallTime: 0,
      avgRenderTime: 0,
      avgTotalTime: 0,
    });
  }, []);

  return {
    metrics,
    recordApiCall,
    recordRender,
    reset,
  };
}
