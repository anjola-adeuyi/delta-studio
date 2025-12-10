# Technical Decisions

This document captures the key technical decisions made during the Delta Studio implementation, including rationale, alternatives considered and trade-offs.

---

## 1. Framework Choice: React + TypeScript

**Decision:** Use React 19 with TypeScript instead of SvelteKit

**Alternatives Considered:**

- SvelteKit (Breek's current stack)
- Vue 3 + TypeScript
- Vanilla TypeScript

**Rationale:**

- **Speed:** Most familiar framework = fastest implementation
- **Ecosystem:** Larger selection of diff libraries with React bindings
- **TypeScript:** First-class support with excellent DX
- **Vite:** Blazing fast HMR for rapid iteration

**Trade-off:** Not using Breek's SvelteKit stack but prioritized shipping functional, polished code within the 6-8 hour timeframe. Could port to SvelteKit in a future iteration, the component logic is framework-agnostic.

---

## 2. Diff Library: diff-match-patch

**Decision:** Use Google's diff-match-patch library

**Alternatives Considered:**

| Library           | Pros              | Cons                             |
| ----------------- | ----------------- | -------------------------------- |
| react-diff-viewer | Ready-made UI     | Too opinionated, less UX control |
| jsdiff            | Popular, flexible | Slightly less semantic cleanup   |
| Custom impl       | Full control      | Time-consuming, high risk        |

**Rationale:**

- **Battle-tested:** Used by Google Docs, proven at scale
- **Lightweight:** ~50KB unminified, no dependencies
- **Semantic cleanup:** `diff_cleanupSemantic()` produces human-readable diffs
- **Character-level precision:** Better for HTML than word-level alternatives
- **Well-documented:** Clear API, easy to debug

**Code example:**

```typescript
const dmp = new DiffMatchPatch();
const diffs = dmp.diff_main(original, modified);
dmp.diff_cleanupSemantic(diffs); // Makes diffs more readable
```

---

## 3. State Management: React Hooks

**Decision:** Use `useState` + `useMemo` + `useCallback` instead of Redux/Zustand

**Alternatives Considered:**

- Redux Toolkit
- Zustand
- Jotai
- React Context

**Rationale:**

- **Scope:** State is local to the diff viewer, not app-wide
- **Simplicity:** No persistence needed (per requirements)
- **Performance:** `useMemo` for expensive computations (diff, final HTML)
- **Stability:** `useCallback` for stable function references
- **Debugging:** Easy to trace state changes in React DevTools

**The `useChangeManager` hook encapsulates all state logic:**

```typescript
const {
  changes, // Parsed changes array
  stats, // { total, accepted, rejected, pending }
  finalResult, // Computed HTML based on decisions
  acceptChange, // Accept single change
  rejectChange, // Reject single change
  acceptAll, // Batch accept
  rejectAll, // Batch reject
  resetChanges, // Reset all to pending
} = useChangeManager(original, modified);
```

---

## 4. Level 2 UX Design

**Decision:** Side-by-side Before/After comparison with individual accept/reject buttons

**Alternatives Considered:**

| Approach                     | Pros           | Cons                    |
| ---------------------------- | -------------- | ----------------------- |
| Inline diff (GitHub-style)   | Compact        | Hard to compare context |
| Unified view with highlights | Less scrolling | Confusing for non-devs  |
| Slider comparison            | Visual         | Not intuitive for text  |
| Batch-only operations        | Faster         | Less control            |

**Rationale:**

- **Clear comparison:** Before/After side-by-side is immediately understandable
- **Low cognitive load:** One decision per card, no mental juggling
- **Instant feedback:** Green/red states show decisions at a glance
- **Live preview:** Users see impact immediately in the preview panel
- **Forgiveness:** Can change decisions, reset anytime

**UX Principles Applied:**

1. **Progressive disclosure:** Show changes one at a time
2. **Direct manipulation:** Click buttons, see results
3. **Visibility of system status:** Progress bar, stats counter
4. **Error prevention:** Disabled states prevent invalid actions

---

## 5. Why Level 2 Over Level 3

**Decision:** Focus entirely on Level 2 (accept/reject), research-only for Level 3 (WYSIWYG)

**Rationale:**

| Factor              | Level 2  | Level 3           |
| ------------------- | -------- | ----------------- |
| User value          | 80%      | 20% incremental   |
| Implementation time | 4 hours  | 10+ hours         |
| Complexity          | Moderate | Very high         |
| Risk                | Low      | High (edge cases) |

**Key insight:** For construction documentation review, users care about _making decisions_ on AI-generated changes, not rendering formatting. Raw HTML diff is sufficient for:

- Verifying AI changes are correct
- Understanding what was added/removed
- Making accept/reject decisions quickly

**What makes Level 3 hard:**

- HTML is a tree, not linear text
- Attribute changes are invisible in rendered output
- Tag wrapping changes structure without changing content
- Whitespace normalization varies by browser

See `docs/LEVEL3_RESEARCH.md` for detailed analysis (TODO).

---

## 6. Styling: Tailwind CSS

**Decision:** Use Tailwind CSS instead of CSS modules or styled-components

**Alternatives Considered:**

- CSS Modules
- styled-components
- Emotion
- Vanilla CSS

**Rationale:**

- **Speed:** No context switching between files
- **Consistency:** Built-in design tokens (spacing, colors)
- **Responsive:** Easy `sm:`, `md:`, `lg:` prefixes
- **Dark mode ready:** `dark:` variants available
- **Tailwind v4:** New CSS-based config, no PostCSS complexity

**Design system highlights:**

- `emerald-*` for accept/success states
- `rose-*` for reject/error states
- `rounded-2xl` for modern card aesthetic
- `shadow-*-500/20` for colored shadows
- `transition-all duration-200` for smooth interactions

---

## 7. Project Structure

**Decision:** Organized by feature type

```
src/
├── components/     # UI components (DiffViewer, ChangeCard, etc.)
├── hooks/          # Custom hooks (useChangeManager)
├── lib/            # Pure logic (diffEngine)
├── types/          # TypeScript interfaces
└── examples/       # Test data
```

**Rationale:**

- **Familiar:** Standard React project structure
- **Scalable:** Easy to add new components
- **Testable:** Logic separated from UI
- **Discoverable:** Files are where you expect them

---

## 8. What I'd Improve With More Time

### High Priority

1. **Keyboard shortcuts**

   - `j`/`k` to navigate between changes
   - `y`/`n` (or `a`/`r`) to accept/reject
   - `Enter` to toggle, `Esc` to reset

2. **Undo/Redo**

   - History stack for all decisions
   - `Cmd+Z` / `Cmd+Shift+Z` support

3. **Accessibility**
   - ARIA labels on all interactive elements
   - Focus management between cards
   - Screen reader announcements for state changes

### Medium Priority

4. **Export functionality**

   - Copy final HTML to clipboard
   - Download as .html file
   - Generate diff report

5. **Batch selection**

   - Checkbox to select multiple changes
   - "Accept selected" / "Reject selected"

6. **Performance**
   - Virtual scrolling for 100+ changes
   - Web Worker for diff computation

### Nice to Have

7. **Level 3 WYSIWYG**

   - Render HTML while showing diffs
   - Would require DOM tree diffing algorithm

8. **Persistence**

   - Save review state to localStorage
   - Resume interrupted reviews

9. **Theming**
   - Dark mode toggle
   - Custom color schemes

---

## Summary

| Decision     | Choice             | Key Reason                |
| ------------ | ------------------ | ------------------------- |
| Framework    | React + TS         | Fastest to ship           |
| Diff library | diff-match-patch   | Battle-tested, semantic   |
| State        | React hooks        | Simple, local scope       |
| UX pattern   | Side-by-side cards | Clear, low cognitive load |
| Level focus  | Level 2 only       | 80% value, lower risk     |
| Styling      | Tailwind CSS       | Rapid prototyping         |

**Philosophy:** Ship working, polished Level 1 + 2 code rather than incomplete Level 3. Martin's guidance was clear: "You likely won't finish everything and that is perfectly fine."

---

_Last updated: December 2025_
