# View toggle

Figma "View toggle" (05 · Label & Input; Value: table · grid): the list / gallery switch on index pages (AI Agent, Campaign flows). Single-select with radio semantics (Radix RadioGroup): the toggle is a `radiogroup` named "View", each icon a `radio`; arrow keys switch views.

**Consumer provides:** `value` + `onValueChange` (or `defaultValue`) with `"table"` or `"grid"`. Optional `tableLabel` / `gridLabel` (accessible names, default "Table view" / "Grid view") and `aria-label` (default "View").

| Component | Props | Notes |
|---|---|---|
| `ViewToggle` | `value` `defaultValue` `onValueChange` `tableLabel` `gridLabel` `aria-label` `disabled` | Renders the table + grid items unless you pass `children` |
| `ViewToggleItem` | `value` `aria-label` + icon child | For other view sets (always add `aria-label`) |

## Tokens

- Container: 54 × 28px, `muted` bg, radius 8px, 2px padding and gap.
- Item: 24px square, radius 6px (`rounded-sm`), 16px icon (lucide `Table` / `LayoutGrid`).
- Active: `white` bg, `foreground` icon. Inactive: transparent, `gray-80` icon, `foreground` on hover. Focus: 2px `ring`.

## Usage

- Place at the right end of the toolbar above a list, next to search / filters. Keep the chosen view per page (e.g. in the URL or local storage).

```jsx
<ViewToggle value={view} onValueChange={setView} />
{view === "table" ? <AgentsTable /> : <AgentsGrid />}
```
