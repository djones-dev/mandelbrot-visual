interface LoadingIndicatorProps {
  renderProgress: number;
}

export function LoadingIndicator({ renderProgress }: LoadingIndicatorProps) {
  return (
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
      <div className="bg-white dark:bg-zinc-800 px-6 py-4 rounded-lg shadow-xl min-w-[280px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-zinc-900 dark:text-zinc-100">
              {renderProgress < 100 ? 'Rendering...' : 'Computing...'}
            </span>
          </div>
          {/* Progress Bar */}
          {renderProgress > 0 && renderProgress < 100 && (
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-200 ease-out"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProgressBadgeProps {
  progress: number;
}

export function ProgressBadge({ progress }: ProgressBadgeProps) {
  if (progress >= 100 || progress <= 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
      Refining... {Math.round(progress)}%
    </div>
  );
}
