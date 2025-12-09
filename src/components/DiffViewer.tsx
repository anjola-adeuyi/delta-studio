import { useMemo } from 'react';
import { computeDiff } from '../lib/diffEngine';

interface DiffViewerProps {
  /** The original HTML content */
  original: string;
  /** The modified HTML content */
  modified: string;
}

/**
 * Level 1: Basic Diff Viewer Component
 * Displays HTML differences with color-coded highlighting
 * - Green: Added content
 * - Red with strikethrough: Removed content
 * - Normal: Unchanged content
 * @param original - The original HTML content
 * @param modified - The modified HTML content
 */
export function DiffViewer({ original, modified }: DiffViewerProps) {
  // Memoize diff computation to avoid recalculating on every render
  const diffs = useMemo(() => computeDiff(original, modified), [original, modified]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm shadow-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50/80 border-b border-gray-200/80 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-800">Raw HTML Diff</h3>
        <div className="flex items-center gap-4 sm:gap-5 text-xs">
          <span className="flex items-center gap-2 group">
            <span className="w-4 h-4 rounded-md bg-emerald-100 border-2 border-emerald-300 group-hover:scale-110 transition-transform" />
            <span className="text-gray-600 font-medium">Added</span>
          </span>
          <span className="flex items-center gap-2 group">
            <span className="w-4 h-4 rounded-md bg-rose-100 border-2 border-rose-300 group-hover:scale-110 transition-transform" />
            <span className="text-gray-600 font-medium">Removed</span>
          </span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="p-4 sm:p-5 bg-linear-to-b from-gray-50/50 to-white">
        <div className="font-mono text-sm leading-7 whitespace-pre-wrap wrap-break-word text-gray-700">
          {diffs.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border-b-2 border-emerald-300 font-medium"
                >
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded line-through decoration-2 decoration-rose-400 opacity-75"
                >
                  {part.value}
                </span>
              );
            }
            return (
              <span
                key={index}
                className="text-gray-700"
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;
