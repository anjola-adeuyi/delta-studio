import { useChangeManager } from '../hooks/useChangeManager';
import { ChangeCard } from './ChangeCard';
import { PreviewPanel } from './PreviewPanel';

interface InteractiveDiffProps {
  /** The original HTML content */
  original: string;
  /** The modified HTML content */
  modified: string;
}

/**
 * Level 2: Interactive Diff Component
 * Main component that orchestrates the accept/reject workflow
 * Combines ChangeCard list with PreviewPanel
 * Provides batch action buttons: Accept All, Reject All, Reset
 * @param original - The original HTML content
 * @param modified - The modified HTML content
 * @returns The InteractiveDiff component
 */
export function InteractiveDiff({ original, modified }: InteractiveDiffProps) {
  const {
    changes,
    acceptChange,
    rejectChange,
    acceptAll,
    rejectAll,
    resetChanges,
    finalResult,
    stats,
    isComplete,
  } = useChangeManager(original, modified);

  return (
    <div>
      {/* Batch Actions */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm shadow-gray-200/50 p-4 sm:p-5 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              Review Changes
              <span className="text-sm font-normal text-gray-400">({changes.length})</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isComplete ? (
                <span className="text-emerald-600 font-medium">All changes reviewed!</span>
              ) : (
                <>{stats.pending} pending review</>
              )}
            </p>
          </div>

          {/* Batch Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              disabled={stats.pending === 0 && stats.rejected === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="hidden sm:inline">Accept All</span>
              <span className="sm:hidden">All</span>
            </button>

            <button
              onClick={rejectAll}
              disabled={stats.pending === 0 && stats.accepted === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-xl font-semibold text-sm hover:bg-rose-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-rose-500 shadow-md shadow-rose-500/20 hover:shadow-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="hidden sm:inline">Reject All</span>
              <span className="sm:hidden">None</span>
            </button>

            <button
              onClick={resetChanges}
              disabled={stats.pending === changes.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ring-1 ring-gray-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Changes List (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {changes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Changes</h3>
              <p className="text-gray-500 text-sm">Documents are identical.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {changes.map((change, index) => (
                <ChangeCard
                  key={change.id}
                  change={change}
                  onAccept={acceptChange}
                  onReject={rejectChange}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel (1/3 width on desktop) */}
        <div>
          <PreviewPanel
            html={finalResult}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}

export default InteractiveDiff;
