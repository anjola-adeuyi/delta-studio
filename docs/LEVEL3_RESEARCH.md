# Level 3: WYSIWYG Diff Research

This document captures research into rendering HTML diffs while preserving formatting (WYSIWYG), explaining why this is complex and how it could be approached.

---

## Problem Statement

**Goal:** Display HTML differences while rendering the actual formatting (bold, lists, links, etc.) instead of showing raw HTML tags.

**Current State (Level 1-2):** We show raw HTML text with color highlighting:

```html
<p>Safety equipment required:</p>
<ul>
  <li>Hard hat (Class [E or ]G)</li>
  <!-- [added] shown in green -->
</ul>
```

**Desired State (Level 3):** Render the HTML with inline diff markers:

> Safety equipment required:
>
> - Hard hat (Class <ins>E or </ins>G)

---

## Why This Is Hard

### Challenge 1: Tree Structure vs Linear Text

HTML is a **tree**, not linear text. Text diffing algorithms assume sequential characters but HTML has nested structure.

```html
<!-- Original -->
<p>The <b>quick</b> brown fox</p>

<!-- Modified -->
<p>The <b>quick brown</b> fox</p>
```

**Text diff sees:** Same words, no change  
**DOM diff sees:** `<b>` tag expanded to include "brown"

The structure changed even though the visible text is identical. How do we visualize this?

### Challenge 2: Attribute Changes

```html
<!-- Original -->
<li>Item</li>

<!-- Modified -->
<li class="active">Item</li>
```

The rendered output looks identical but `class="active"` was added. Should we:

- Ignore it? (loses information)
- Show a tooltip? (adds complexity)
- Highlight the element? (confusing for users)

### Challenge 3: Tag Insertions Around Existing Content

```html
<!-- Original -->
Hello world

<!-- Modified -->
Hello <em>world</em>
```

Text diff: No change (same words)  
Reality: "world" is now italicized

This is extremely common in document editing users wrap existing text in formatting tags.

### Challenge 4: Whitespace Normalization

```html
<!-- Original -->
<p>Text</p>

<!-- Modified -->
<p> Text </p>
```

Renders identically in browsers but the HTML is different. Do we:

- Normalize before diffing? (may hide real changes)
- Show whitespace changes? (noisy, confusing)

### Challenge 5: Self-Closing Tags and Void Elements

```html
<!-- Original -->
<br />
<img src="a.png" />

<!-- Modified -->
<br />
<img src="a.png"></>
```

Semantically identical, syntactically different. Browsers normalize these, but string comparison doesn't.

### Challenge 6: Entity Encoding

```html
<!-- Original -->
&amp; &lt; &gt;

<!-- Modified -->
& < >
```

Same characters, different representations. Need to decode before comparing.

---

## Libraries Investigated

### 1. htmldiff.js

**Repository:** https://github.com/idesis-gmbh/htmldiff.js

| Aspect  | Assessment                                            |
| ------- | ----------------------------------------------------- |
| Pros    | Designed for HTML, produces `<ins>`/`<del>` tags      |
| Cons    | Struggles with deeply nested structures, unmaintained |
| Size    | ~15KB                                                 |
| Verdict | Could work for simple cases, breaks on complex HTML   |

**Example output:**

```html
<p>The <del>quick</del><ins>slow</ins> fox</p>
```

### 2. prose-diff

**Repository:** https://github.com/pubpub/prosemirror-diff

| Aspect  | Assessment                                    |
| ------- | --------------------------------------------- |
| Pros    | Built for ProseMirror, handles rich text well |
| Cons    | Requires ProseMirror integration, heavyweight |
| Size    | ~200KB with dependencies                      |
| Verdict | Overkill unless building a full editor        |

### 3. diff-match-patch (what we used)

| Aspect  | Assessment                                      |
| ------- | ----------------------------------------------- |
| Pros    | Fast, reliable, semantic cleanup, battle-tested |
| Cons    | Text-only, completely ignores HTML structure    |
| Size    | ~50KB                                           |
| Verdict | Perfect for Level 1-2, insufficient for Level 3 |

### 4. google-diff-match-patch + custom wrapper

Some projects wrap diff-match-patch with HTML-aware pre/post processing:

- Strip tags → diff text → reinsert tags
- Works for simple cases, fails on structural changes

### 5. Custom DOM Diffing

| Aspect   | Assessment                                         |
| -------- | -------------------------------------------------- |
| Approach | Parse HTML → Build DOM trees → Diff nodes → Render |
| Pros     | Full control, handles all edge cases               |
| Cons     | Time-consuming (10+ hours), many edge cases        |
| Verdict  | Correct solution but outside time budget           |

---

## Proposed Solution (Not Implemented)

### Architecture

```
┌──────────────┐     ┌──────────────┐
│   Original   │     │   Modified   │
│     HTML     │     │     HTML     │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  Parse to    │     │  Parse to    │
│  DOM Tree    │     │  DOM Tree    │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  Flatten to  │     │  Flatten to  │
│  Node List   │     │  Node List   │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
       ┌────────────────┐
       │  Diff Nodes    │
       │  (LCS/Myers)   │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │  Map Back to   │
       │  DOM Positions │
       └────────┬───────┘
                │
                ▼
       ┌────────────────┐
       │  Render with   │
       │  Diff Markers  │
       └────────────────┘
```

### Step 1: Parse HTML to DOM

```typescript
function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}
```

### Step 2: Flatten DOM to Node List

```typescript
interface FlatNode {
  type: 'text' | 'element-open' | 'element-close';
  tag?: string;
  attributes?: Record<string, string>;
  content?: string;
  path: number[]; // Position in tree for reconstruction
}

function flattenDOM(doc: Document): FlatNode[] {
  const nodes: FlatNode[] = [];

  function traverse(element: Element, path: number[] = []) {
    element.childNodes.forEach((child, index) => {
      const currentPath = [...path, index];

      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          nodes.push({
            type: 'text',
            content: text,
            path: currentPath,
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;

        // Opening tag
        nodes.push({
          type: 'element-open',
          tag: el.tagName.toLowerCase(),
          attributes: getAttributes(el),
          path: currentPath,
        });

        // Recurse into children
        traverse(el, currentPath);

        // Closing tag
        nodes.push({
          type: 'element-close',
          tag: el.tagName.toLowerCase(),
          path: currentPath,
        });
      }
    });
  }

  traverse(doc.body);
  return nodes;
}
```

### Step 3: Diff Flattened Nodes

Use Longest Common Subsequence (LCS) or Myers diff algorithm on the node arrays:

```typescript
interface NodeDiff {
  type: 'equal' | 'insert' | 'delete';
  nodes: FlatNode[];
}

function diffNodes(original: FlatNode[], modified: FlatNode[]): NodeDiff[] {
  // Myers diff algorithm or similar
  // Compare nodes by type + content + tag
}
```

### Step 4: Render with Diff Markers

```typescript
function renderWithDiffs(diffs: NodeDiff[]): string {
  let html = '';

  for (const diff of diffs) {
    if (diff.type === 'equal') {
      html += reconstructNodes(diff.nodes);
    } else if (diff.type === 'insert') {
      html += `<ins class="diff-added">${reconstructNodes(diff.nodes)}</ins>`;
    } else if (diff.type === 'delete') {
      html += `<del class="diff-removed">${reconstructNodes(diff.nodes)}</del>`;
    }
  }

  return html;
}
```

### Edge Cases to Handle

1. **Nested diffs:** `<ins>` inside `<del>` or vice versa
2. **Block vs inline:** Can't put `<ins>` around `<div>`
3. **Table structure:** Tables have strict child requirements
4. **List items:** `<li>` must be inside `<ul>` or `<ol>`
5. **Invalid nesting:** `<p>` inside `<p>` is invalid

---

## Why I Stopped Here

| Reason                  | Explanation                                 |
| ----------------------- | ------------------------------------------- |
| **Time constraint**     | 6-8 hour budget for entire assessment       |
| **Diminishing returns** | Level 2 provides ~80% of user value         |
| **Complexity**          | Minimum 10+ hours for robust implementation |
| **Edge cases**          | Hundreds of HTML edge cases to handle       |
| **Priorities**          | Polish Level 2 UX > partial Level 3         |
| **Martin's guidance**   | "You likely won't finish everything"        |

**Honest assessment:** I could build a demo that works for simple cases in 2-3 hours, but it would break on real construction documents with complex tables, nested lists and formatting.

---

## What I'd Do Next

### With 2-3 More Days

| Day   | Task                                                |
| ----- | --------------------------------------------------- |
| Day 1 | Implement DOM parsing, flattening and basic diffing |
| Day 2 | Build node-to-DOM mapping and handle edge cases     |
| Day 3 | Create rendering engine, CSS styling, testing       |

### Libraries to Explore

1. **unifiedjs/rehype** - HTML AST manipulation

   - Parse HTML to AST, transform, stringify
   - Well-maintained, good TypeScript support

2. **jsdom** - Server-side DOM

   - Full DOM API in Node.js
   - Useful for testing without browser

3. **ProseMirror** - Rich text editing framework

   - If building a full document editor
   - Has built-in change tracking

4. **Yjs/Automerge** - CRDTs
   - For real-time collaborative editing
   - Handles conflicts automatically

### Alternative Approach: Hybrid Rendering

Instead of full WYSIWYG diff, a middle ground:

```
┌─────────────────────────────────────────┐
│  Rendered Preview (read-only)           │
│  ┌─────────────────────────────────┐    │
│  │ Safety equipment required:      │    │
│  │ • Hard hat (Class E or G)       │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Raw Diff (with colors)                 │
│  <li>Hard hat (Class [E or ]G)</li>     │
└─────────────────────────────────────────┘
```

This gives users:

- Visual preview of final result
- Raw diff for precise understanding
- Best of both worlds without complexity

---

## Key Takeaway

Level 3 is **algorithmically interesting** but Level 2 is **more valuable for users**.

For Breek's use case (construction documentation review), users need to:

1. ✅ Quickly see what changed (Level 1 solves this)
2. ✅ Accept or reject changes (Level 2 solves this)
3. ⚠️ See formatted preview (Level 3, nice-to-have)

The raw HTML diff in Level 1-2 is sufficient because:

- Construction docs are often simple HTML (lists, paragraphs)
- Users care about **content** changes not **formatting**
- Accept/reject UX is more important than rendering

**Bottom line:** Ship working Level 2 with great UX rather than broken Level 3 with poor UX.

---

## References

- [Myers Diff Algorithm](http://www.xmailserver.org/diff2.pdf) - Original paper
- [htmldiff.js](https://github.com/idesis-gmbh/htmldiff.js) - HTML diffing library
- [ProseMirror Guide](https://prosemirror.net/docs/guide/) - Rich text editing
- [unifiedjs](https://unifiedjs.com/) - Content transformation

---

_Last updated: December 2025_
