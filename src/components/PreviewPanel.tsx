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
 */
export function PreviewPanel({ html, stats }: PreviewPanelProps) {
  const progressPercent =
    stats.total > 0
      ? Math.round(((stats.accepted + stats.rejected) / stats.total) * 100)
      : 0;

  const isComplete = stats.pending === 0 && stats.total > 0;

  return (
    <div className="sticky top-24">
      {/* Progress Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Review Progress</h3>
            {isComplete && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                ✓ Complete
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>
                {stats.accepted + stats.rejected} of {stats.total} reviewed
              </span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {/* Accepted */}
          <div className="p-4 text-center bg-green-50/50">
            <div className="text-2xl font-bold text-green-600">
              {stats.accepted}
            </div>
            <div className="text-xs font-medium text-green-600/80 mt-0.5">
              Accepted
            </div>
          </div>

          {/* Rejected */}
          <div className="p-4 text-center bg-red-50/50">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-xs font-medium text-red-600/80 mt-0.5">
              Rejected
            </div>
          </div>

          {/* Pending */}
          <div className="p-4 text-center bg-gray-50/50">
            <div className="text-2xl font-bold text-gray-600">
              {stats.pending}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Final Result Preview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Final Result</h3>
          <span className="text-xs text-gray-400">Live preview</span>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-80 overflow-auto">
            {html ? (
              <pre className="text-sm font-mono whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                {html}
              </pre>
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-4">
                No content to preview
              </p>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        {isComplete && (
          <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100">
            <p className="text-sm text-emerald-700">
              <span className="font-semibold">Review complete!</span> You
              accepted {stats.accepted} and rejected {stats.rejected} change
              {stats.rejected !== 1 ? 's' : ''}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;

