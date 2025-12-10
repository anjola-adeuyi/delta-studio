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
 * @param change - The change to display
 * @param onAccept - Callback when user accepts the change
 * @param onReject - Callback when user rejects the change
 * @param index - Optional: index for display purposes
 */
export function ChangeCard({ change, onAccept, onReject, index }: ChangeCardProps) {
  const isAccepted = change.accepted === true;
  const isRejected = change.accepted === false;
  const isPending = change.accepted === null;

  // Determine card styling based on state
  const cardStyles = isAccepted
    ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-100'
    : isRejected
    ? 'bg-rose-50/70 border-rose-200 ring-1 ring-rose-100'
    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md';

  // Type badge styling
  const typeBadgeStyles = {
    added: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    removed: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
    modified: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  };

  return (
    <div
      className={`border rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4 transition-all duration-300 ease-out shadow-sm ${cardStyles}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Change number */}
          {index !== undefined && <span className="text-xs font-bold text-gray-300 tabular-nums">#{index + 1}</span>}

          {/* Type badge */}
          <span
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
              typeBadgeStyles[change.type]
            }`}
          >
            {change.type}
          </span>
        </div>

        {/* Status badge */}
        {!isPending && (
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
              isAccepted ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isAccepted ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Accepted
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Rejected
              </>
            )}
          </span>
        )}
      </div>

      {/* Before/After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
        {/* Before (Original) */}
        <div className="group">
          <h4 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform" />
            Before
          </h4>
          <div
            className={`font-mono text-xs sm:text-sm p-3 sm:p-4 rounded-xl border transition-all duration-200 min-h-[60px] overflow-x-auto whitespace-pre-wrap wrap-break-word ${
              change.original
                ? 'bg-rose-50/50 border-rose-200/80 text-gray-800 group-hover:bg-rose-50'
                : 'bg-gray-50 border-gray-200 text-gray-400 italic'
            }`}
          >
            {change.original || '(empty)'}
          </div>
        </div>

        {/* After (Modified) */}
        <div className="group">
          <h4 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
            After
          </h4>
          <div
            className={`font-mono text-xs sm:text-sm p-3 sm:p-4 rounded-xl border transition-all duration-200 min-h-[60px] overflow-x-auto whitespace-pre-wrap wrap-break-word ${
              change.modified
                ? 'bg-emerald-50/50 border-emerald-200/80 text-gray-800 group-hover:bg-emerald-50'
                : 'bg-gray-50 border-gray-200 text-gray-400 italic'
            }`}
          >
            {change.modified || '(empty)'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={() => onAccept(change.id)}
          disabled={isAccepted}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isAccepted
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30'
          }`}
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
          <span className="hidden sm:inline">{isAccepted ? 'Accepted' : 'Accept'}</span>
        </button>

        <button
          onClick={() => onReject(change.id)}
          disabled={isRejected}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isRejected
              ? 'bg-rose-100 text-rose-700 cursor-default'
              : 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/30'
          }`}
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
          <span className="hidden sm:inline">{isRejected ? 'Rejected' : 'Reject'}</span>
        </button>
      </div>
    </div>
  );
}

export default ChangeCard;
