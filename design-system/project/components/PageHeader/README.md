# PageHeader

The 48px bar at the top of a workspace page: optional back button and the page title. Matches the Figma "Page header" (Back = true / false).

**Consumer provides:** `title`, and `onBack` when the page has a Back action (that shows the back button). Optional `actions` (right-aligned) and `children` (placed after the title).

| Prop | Values | Default |
|---|---|---|
| `title` | ReactNode — rendered as `<h1>` | — |
| `back` | boolean — show the back button (Figma "Back") | `true` when `onBack` is set |
| `onBack` | `() => void` | — |
| `backLabel` | accessible name of the back button | `"Back"` |
| `actions` | ReactNode, right-aligned (`ml-auto`, 8px gap) — not in Figma, optional | — |

| Part | Style |
|---|---|
| Bar | `h-12` (48px), `bg-card`, 1px bottom `border-border`, `px-4`, `gap-2`, full width |
| Back | `Button variant="ghost" size="icon-sm"` (28px, 6px radius) with a 16px `ArrowLeft` |
| Title | `text-h4-600 text-foreground`, truncates on one line |

- Back runs the same action as the page's own Back (e.g. open the discard / save-as-draft dialog) — don't navigate away silently if there is unsaved work.
- Keep actions secondary or ghost; the page's one primary button usually lives in the footer.
- No description line: the bar is one line, 48px high.

```jsx
<PageHeader title="Create an agent" onBack={() => setConfirmLeave(true)} />
```
