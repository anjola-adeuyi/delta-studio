import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Change, ChangeStats } from '../types';
import { parseChanges, computeFinalHTML } from '../lib/diffEngine';

/**
 * Custom hook for managing interactive change review state
 * Handles accept/reject decisions and computes final result
 *
 * @param original - The original HTML string
 * @param modified - The modified HTML string
 * @returns Object containing changes, actions, final result, and stats
 */
export function useChangeManager(original: string, modified: string) {
  // Initialize changes by parsing the diff
  const [changes, setChanges] = useState<Change[]>(() =>
    parseChanges(original, modified)
  );

  // Re-parse when original or modified content changes
  useEffect(() => {
    setChanges(parseChanges(original, modified));
  }, [original, modified]);

  /**
   * Accept a single change by ID
   */
  const acceptChange = useCallback((id: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, accepted: true } : c))
    );
  }, []);

  /**
   * Reject a single change by ID
   */
  const rejectChange = useCallback((id: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, accepted: false } : c))
    );
  }, []);

  /**
   * Accept all pending changes
   */
  const acceptAll = useCallback(() => {
    setChanges((prev) => prev.map((c) => ({ ...c, accepted: true })));
  }, []);

  /**
   * Reject all pending changes
   */
  const rejectAll = useCallback(() => {
    setChanges((prev) => prev.map((c) => ({ ...c, accepted: false })));
  }, []);

  /**
   * Reset all changes to pending state
   */
  const resetChanges = useCallback(() => {
    setChanges((prev) => prev.map((c) => ({ ...c, accepted: null })));
  }, []);

  /**
   * Toggle a change's decision (useful for keyboard shortcuts)
   */
  const toggleChange = useCallback((id: string) => {
    setChanges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Cycle: null -> true -> false -> null
        const newAccepted =
          c.accepted === null ? true : c.accepted === true ? false : null;
        return { ...c, accepted: newAccepted };
      })
    );
  }, []);

  /**
   * Computed final HTML based on current decisions
   * Memoized for performance
   */
  const finalResult = useMemo(
    () => computeFinalHTML(changes, original, modified),
    [changes, original, modified]
  );

  /**
   * Statistics about current review state
   * Memoized for performance
   */
  const stats: ChangeStats = useMemo(() => {
    const total = changes.length;
    const accepted = changes.filter((c) => c.accepted === true).length;
    const rejected = changes.filter((c) => c.accepted === false).length;
    const pending = changes.filter((c) => c.accepted === null).length;

    return { total, accepted, rejected, pending };
  }, [changes]);

  /**
   * Check if all changes have been reviewed
   */
  const isComplete = useMemo(() => stats.pending === 0, [stats.pending]);

  return {
    // State
    changes,
    finalResult,
    stats,
    isComplete,

    // Actions
    acceptChange,
    rejectChange,
    acceptAll,
    rejectAll,
    resetChanges,
    toggleChange,
  };
}

export default useChangeManager;

