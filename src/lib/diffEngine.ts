import DiffMatchPatch from 'diff-match-patch';
import type { Change, DiffPart } from '../types';

/**
 * Singleton instance of diff-match-patch library
 * Reused across all diff computations for efficiency
 */
const dmp = new DiffMatchPatch();

/**
 * Computes the differences between two HTML strings
 * Returns an array of DiffPart objects representing unchanged, added, and removed segments
 *
 * @param original - The original HTML string
 * @param modified - The modified HTML string
 * @returns Array of DiffPart objects with value and added/removed flags
 */
export function computeDiff(original: string, modified: string): DiffPart[] {
  // Compute raw diffs using diff-match-patch
  const diffs = dmp.diff_main(original, modified);

  // Apply semantic cleanup for more readable, human-friendly diffs
  // This merges small edits into larger, more meaningful changes
  dmp.diff_cleanupSemantic(diffs);

  // Transform to our DiffPart interface
  // diff-match-patch uses: -1 = removed, 0 = unchanged, 1 = added
  return diffs.map(([operation, text]) => ({
    value: text,
    added: operation === 1,
    removed: operation === -1,
  }));
}

/**
 * Parses diff results into discrete, reviewable Change objects
 * Groups adjacent additions and deletions into single changes
 *
 * @param original - The original HTML string
 * @param modified - The modified HTML string
 * @returns Array of Change objects for user review
 */
export function parseChanges(original: string, modified: string): Change[] {
  const diffs = computeDiff(original, modified);
  const changes: Change[] = [];
  let currentOriginal = '';
  let currentModified = '';
  let changeId = 0;

  // Helper to finalize a pending change
  const finalizeChange = () => {
    if (currentOriginal || currentModified) {
      const type: Change['type'] =
        currentOriginal && currentModified
          ? 'modified'
          : currentOriginal
            ? 'removed'
            : 'added';

      changes.push({
        id: `change-${changeId++}`,
        type,
        original: currentOriginal,
        modified: currentModified,
        accepted: null,
      });

      currentOriginal = '';
      currentModified = '';
    }
  };

  diffs.forEach((part) => {
    if (part.removed) {
      // Accumulate removed text
      currentOriginal += part.value;
    } else if (part.added) {
      // Accumulate added text
      currentModified += part.value;
    } else {
      // Unchanged text - finalize any pending change
      finalizeChange();
    }
  });

  // Handle any remaining change at the end
  finalizeChange();

  return changes;
}

/**
 * Computes the final HTML based on user decisions for each change
 * Reconstructs the document by applying accepted changes and keeping/removing based on rejections
 *
 * @param changes - Array of Change objects with user decisions (accepted: true/false/null)
 * @param original - The original HTML string
 * @param modified - The modified HTML string
 * @returns The final HTML string reflecting user decisions
 */
export function computeFinalHTML(
  changes: Change[],
  original: string,
  modified: string
): string {
  // Get the raw diffs to reconstruct the document
  const diffs = computeDiff(original, modified);

  // Create a map of change decisions for quick lookup
  const changeMap = new Map<string, Change>();
  changes.forEach((change) => {
    // Create a key based on the original and modified content
    const key = `${change.original}|||${change.modified}`;
    changeMap.set(key, change);
  });

  // Track current position in changes
  let currentOriginal = '';
  let currentModified = '';
  let result = '';

  const processChange = () => {
    if (!currentOriginal && !currentModified) return;

    const key = `${currentOriginal}|||${currentModified}`;
    const change = changeMap.get(key);

    if (!change) {
      // No matching change found, use modified content (default behavior)
      result += currentModified || '';
    } else if (change.accepted === true) {
      // User accepted the change - use modified content
      result += change.modified;
    } else if (change.accepted === false) {
      // User rejected the change - keep original content
      result += change.original;
    } else {
      // Pending (null) - show modified content as preview
      result += change.modified || change.original;
    }

    currentOriginal = '';
    currentModified = '';
  };

  diffs.forEach((part) => {
    if (part.removed) {
      currentOriginal += part.value;
    } else if (part.added) {
      currentModified += part.value;
    } else {
      // Unchanged - process any pending change and add unchanged text
      processChange();
      result += part.value;
    }
  });

  // Process any remaining change
  processChange();

  return result;
}
