import type { Change } from '../types';

interface ChangeCardProps {
  /** The change to display */
  change: Change;
  /** Callback when user accepts the change */
  onAccept: (id: string) => void;
  /** Callback when user rejects the change */
  onReject: (id: string) => void;
  /** Optional: index for display purposes */
  index?: number;
}

/**
 * Displays a single change with before/after comparison and accept/reject buttons
 * This is the core UX component for Level 2 interactive diff
 */
export function ChangeCard({
  change,
  onAccept,
  onReject,
  index,
}: ChangeCardProps) {
  const isAccepted = change.accepted === true;
  const isRejected = change.accepted === false;
  const isPending = change.accepted === null;

  // Determine card styling based on state
  const cardStyles = isAccepted
    ? 'bg-green-50 border-green-300 shadow-green-100'
    : isRejected
      ? 'bg-red-50 border-red-300 shadow-red-100'
      : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow';

  // Type badge styling
  const typeBadgeStyles = {
    added: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    removed: 'bg-rose-100 text-rose-700 border-rose-200',
    modified: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <div
      className={`border rounded-xl p-5 mb-4 transition-all duration-200 ${cardStyles}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Change number */}
          {index !== undefined && (
            <span className="text-xs font-medium text-gray-400">
              #{index + 1}
            </span>
          )}

          {/* Type badge */}
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${typeBadgeStyles[change.type]}`}
          >
            {change.type}
          </span>
        </div>

        {/* Status badge */}
        {!isPending && (
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              isAccepted
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isAccepted ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accepted
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Rejected
              </>
            )}
          </span>
        )}
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Before (Original) */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Before
          </h4>
          <div
            className={`font-mono text-sm p-3 rounded-lg border overflow-x-auto whitespace-pre-wrap break-words ${
              change.original
                ? 'bg-red-50/50 border-red-200 text-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-400 italic'
            }`}
          >
            {change.original || '(empty)'}
          </div>
        </div>

        {/* After (Modified) */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            After
          </h4>
          <div
            className={`font-mono text-sm p-3 rounded-lg border overflow-x-auto whitespace-pre-wrap break-words ${
              change.modified
                ? 'bg-green-50/50 border-green-200 text-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-400 italic'
            }`}
          >
            {change.modified || '(empty)'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onAccept(change.id)}
          disabled={isAccepted}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
            isAccepted
              ? 'bg-green-200 text-green-800 cursor-default'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow'
          }`}
        >
          {isAccepted ? (
            <>
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
              Accepted
            </>
          ) : (
            <>
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
              Accept
            </>
          )}
        </button>

        <button
          onClick={() => onReject(change.id)}
          disabled={isRejected}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
            isRejected
              ? 'bg-red-200 text-red-800 cursor-default'
              : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow'
          }`}
        >
          {isRejected ? (
            <>
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
              Rejected
            </>
          ) : (
            <>
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
              Reject
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChangeCard;

