/**
 * Represents a single part of a diff result
 * Each part is either unchanged, added, or removed text
 */
export interface DiffPart {
  /** The text content of this diff segment */
  value: string;
  /** True if this text was added in the modified version */
  added?: boolean;
  /** True if this text was removed from the original version */
  removed?: boolean;
}

/**
 * Represents a pair of HTML documents to compare
 * Used for test cases and data loading
 */
export interface HTMLComparison {
  /** Display name for this comparison example */
  name: string;
  /** The original HTML content */
  original: string;
  /** The modified HTML content */
  modified: string;
}

/**
 * Represents a single reviewable change between documents
 * Used in Level 2 for accept/reject functionality
 */
export interface Change {
  /** Unique identifier for this change */
  id: string;
  /** Type of change: addition, removal, or modification */
  type: 'added' | 'removed' | 'modified';
  /** The original text (empty string if added) */
  original: string;
  /** The modified text (empty string if removed) */
  modified: string;
  /** User decision: null = pending, true = accepted, false = rejected */
  accepted: boolean | null;
}

/**
 * Statistics about the current review state
 */
export interface ChangeStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
}

