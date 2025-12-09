import DiffMatchPatch from 'diff-match-patch';
import type { DiffPart } from '../types';

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

