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
      {/* Batch Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Review Changes
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({changes.length} total)
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isComplete
                ? 'All changes reviewed!'
                : `${stats.pending} change${stats.pending !== 1 ? 's' : ''} pending review`}
            </p>
          </div>

          {/* Batch Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              disabled={stats.pending === 0 && stats.rejected === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Accept All
            </button>

            <button
              onClick={rejectAll}
              disabled={stats.pending === 0 && stats.accepted === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Reject All
            </button>

            <button
              onClick={resetChanges}
              disabled={stats.pending === changes.length}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Changes List (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-1">
          {changes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No Changes Detected
              </h3>
              <p className="text-gray-500">
                The original and modified documents are identical.
              </p>
            </div>
          ) : (
            changes.map((change, index) => (
              <ChangeCard
                key={change.id}
                change={change}
                onAccept={acceptChange}
                onReject={rejectChange}
                index={index}
              />
            ))
          )}
        </div>

        {/* Preview Panel (1/3 width on desktop) */}
        <div>
          <PreviewPanel html={finalResult} stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default InteractiveDiff;

