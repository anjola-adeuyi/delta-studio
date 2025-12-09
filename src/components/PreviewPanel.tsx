import type { ChangeStats } from '../types';

interface PreviewPanelProps {
  /** The computed final HTML based on user decisions */
  html: string;
  /** Statistics about the review progress */
  stats: ChangeStats;
}

/**
 * Displays review statistics and final HTML preview
 * Sticky positioned to remain visible while scrolling through changes
 * @param html - The computed final HTML based on user decisions
 * @param stats - Statistics about the review progress
 * @returns The PreviewPanel component
 */
export function PreviewPanel({ html, stats }: PreviewPanelProps) {
  const progressPercent = stats.total > 0 ? Math.round(((stats.accepted + stats.rejected) / stats.total) * 100) : 0;

  const isComplete = stats.pending === 0 && stats.total > 0;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm shadow-gray-200/50 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Progress</h3>
            {isComplete && (
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Done
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-medium">
                {stats.accepted + stats.rejected} of {stats.total}
              </span>
              <span className="font-bold text-gray-700">{progressPercent}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3">
          <div className="p-3 sm:p-4 text-center border-r border-gray-100 bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">{stats.accepted}</div>
            <div className="text-[10px] sm:text-xs font-bold text-emerald-600/70 uppercase tracking-wide mt-0.5">
              Accepted
            </div>
          </div>
          <div className="p-3 sm:p-4 text-center border-r border-gray-100 bg-rose-50/30 hover:bg-rose-50/50 transition-colors">
            <div className="text-xl sm:text-2xl font-black text-rose-600 tabular-nums">{stats.rejected}</div>
            <div className="text-[10px] sm:text-xs font-bold text-rose-600/70 uppercase tracking-wide mt-0.5">
              Rejected
            </div>
          </div>
          <div className="p-3 sm:p-4 text-center bg-gray-50/30 hover:bg-gray-50/50 transition-colors">
            <div className="text-xl sm:text-2xl font-black text-gray-500 tabular-nums">{stats.pending}</div>
            <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5">Pending</div>
          </div>
        </div>
      </div>

      {/* Final Result Preview */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm shadow-gray-200/50 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Final Result</h3>
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        <div className="p-3 sm:p-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200/80 p-3 sm:p-4 max-h-72 overflow-auto">
            {html ? (
              <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                {html}
              </pre>
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-6">No content</p>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        {isComplete && (
          <div className="px-4 sm:px-5 py-3 bg-emerald-50/80 border-t border-emerald-100">
            <p className="text-xs sm:text-sm text-emerald-700 font-medium">
              Review complete! {stats.accepted} accepted, {stats.rejected} rejected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;
