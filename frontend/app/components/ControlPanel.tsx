import { useState } from 'react';
import { ViewState } from '../types';

interface ControlPanelProps {
  viewState: ViewState;
  onViewStateChange: (state: ViewState) => void;
  onReset: () => void;
  onToggle: () => void;
}

export function ControlPanel({ viewState, onViewStateChange, onReset, onToggle }: ControlPanelProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="absolute top-6 right-6 flex flex-col gap-4 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-xl min-w-[300px] border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between -mt-2 -mx-2 pb-3 border-b border-zinc-200 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-2">
          Controls
        </h3>
        <button
          onClick={onToggle}
          className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-zinc-700 dark:text-zinc-300"
        >
          ×
        </button>
      </div>

      {/* Canvas Dimensions */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Width
            </label>
            <input
              type="number"
              min="400"
              max="2000"
              step="50"
              value={viewState.width}
              onChange={(e) => onViewStateChange({
                ...viewState,
                width: Number(e.target.value)
              })}
              className="w-full px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Height
            </label>
            <input
              type="number"
              min="300"
              max="2000"
              step="50"
              value={viewState.height}
              onChange={(e) => onViewStateChange({
                ...viewState,
                height: Number(e.target.value)
              })}
              className="w-full px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Iteration Control */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Max Iterations
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={viewState.maxIterations}
            onChange={(e) => onViewStateChange({
              ...viewState,
              maxIterations: Number(e.target.value)
            })}
            className="flex-1"
          />
          <input
            type="number"
            min="50"
            max="1000"
            value={viewState.maxIterations}
            onChange={(e) => onViewStateChange({
              ...viewState,
              maxIterations: Number(e.target.value)
            })}
            className="w-20 px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Coordinate Display */}
      <div className="flex flex-col gap-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">X:</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {viewState.centerX.toFixed(10)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">Y:</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {viewState.centerY.toFixed(10)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">Zoom:</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {viewState.zoom.toFixed(2)}x
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">Size:</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {viewState.width}×{viewState.height}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
        >
          Reset View
        </button>

        {/* Help Button */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            onClick={() => setShowHelp(!showHelp)}
            className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded font-medium transition-colors"
            aria-label="Show controls help"
          >
            ?
          </button>

          {/* Help Popover */}
          {showHelp && (
            <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-4 border border-zinc-200 dark:border-zinc-700 z-50">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <p className="font-medium mb-2 text-zinc-900 dark:text-zinc-100">Controls:</p>
                <ul className="space-y-1.5">
                  <li>• Scroll to zoom in/out</li>
                  <li>• Click and drag to pan</li>
                  <li>• Adjust iterations for more detail</li>
                  <li>• Higher iterations = more precision</li>
                </ul>
              </div>
              {/* Arrow */}
              <div className="absolute top-full right-4 -mt-px">
                <div className="border-8 border-transparent border-t-white dark:border-t-zinc-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
