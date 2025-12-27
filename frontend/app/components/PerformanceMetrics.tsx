import { PerformanceMetrics as Metrics } from '../hooks/usePerformanceMonitor';

interface PerformanceMetricsProps {
  metrics: Metrics;
  onReset: () => void;
  onToggle: () => void;
}

export function PerformanceMetrics({ metrics, onReset, onToggle }: PerformanceMetricsProps) {
  const getStatusColor = (value: number, goodThreshold: number, okThreshold: number) => {
    if (value <= goodThreshold) return 'text-green-600 dark:text-green-400';
    if (value <= okThreshold) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="absolute bottom-6 left-6 bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-4 min-w-[320px] border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Performance Metrics
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-zinc-700 dark:text-zinc-300"
          >
            Reset
          </button>
          <button
            onClick={onToggle}
            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-zinc-700 dark:text-zinc-300"
          >
            ×
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* API Timing */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Backend (Last)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.lastApiCallTime, 100, 500)}`}>
            {metrics.lastApiCallTime.toFixed(0)}ms
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Backend (Avg)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.avgApiCallTime, 100, 500)}`}>
            {metrics.avgApiCallTime.toFixed(0)}ms
          </div>
        </div>

        {/* Render Timing */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Frontend (Last)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.lastRenderTime, 16, 33)}`}>
            {metrics.lastRenderTime.toFixed(0)}ms
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Frontend (Avg)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.avgRenderTime, 16, 33)}`}>
            {metrics.avgRenderTime.toFixed(0)}ms
          </div>
        </div>

        {/* Total Timing */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Total (Last)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.lastTotalTime, 150, 600)}`}>
            {metrics.lastTotalTime.toFixed(0)}ms
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <div className="text-zinc-500 dark:text-zinc-400 mb-1">Total (Avg)</div>
          <div className={`text-lg font-bold ${getStatusColor(metrics.avgTotalTime, 150, 600)}`}>
            {metrics.avgTotalTime.toFixed(0)}ms
          </div>
        </div>
      </div>

      {/* Bottleneck Analysis */}
      <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          Analysis:
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300">
          {metrics.avgApiCallTime > 500 && (
            <div className="text-red-600 dark:text-red-400">⚠ Backend computation slow (&gt;500ms)</div>
          )}
          {metrics.avgRenderTime > 33 && (
            <div className="text-yellow-600 dark:text-yellow-400">⚠ Frontend rendering slow (&gt;33ms)</div>
          )}
          {metrics.avgTotalTime > 600 && (
            <div className="text-yellow-600 dark:text-yellow-400">⚠ Total time high (&gt;600ms)</div>
          )}
          {metrics.avgApiCallTime <= 100 && metrics.avgRenderTime <= 16 && (
            <div className="text-green-600 dark:text-green-400">✓ Excellent performance</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex gap-3">
          <span className="text-green-600 dark:text-green-400">■ Good</span>
          <span className="text-yellow-600 dark:text-yellow-400">■ OK</span>
          <span className="text-red-600 dark:text-red-400">■ Slow</span>
        </div>
      </div>
    </div>
  );
}
