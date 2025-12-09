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
 */
export function DiffViewer({ original, modified }: DiffViewerProps) {
  // Memoize diff computation to avoid recalculating on every render
  const diffs = useMemo(
    () => computeDiff(original, modified),
    [original, modified]
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Raw HTML Diff</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
            <span className="text-gray-600">Added</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
            <span className="text-gray-600">Removed</span>
          </span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="p-4 bg-gray-50/50">
        <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          {diffs.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-green-100 text-green-900 px-0.5 rounded-sm"
                >
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-red-100 text-red-900 line-through px-0.5 rounded-sm"
                >
                  {part.value}
                </span>
              );
            }
            return (
              <span key={index} className="text-gray-800">
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

