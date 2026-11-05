# Sidebar

The 240px side panel from the Figma **Sidebar** (the Automations panel). It has a title, a collapse button, and a list of rows, which can be nested, expandable, badged or disabled. One row component, `SidebarMenuItem`, covers every case. `Sidebar` builds a whole panel from config.

**Consumer provides:** `items` (preferred) or legacy `groups`, `value` + `onChange` (or `defaultValue`), `title`, optional `onCollapse` and `footer`. Give every node an `id`. Without one, a node gets a positional id (`sb-0`, `sb-sb-2-1`, …), never its label, so two rows with the same label stay separate.

| `Sidebar` prop | Values |
|---|---|
| `items` | `SidebarNode[]`, a flat list; `{ type: "divider" }` draws a dashed line |
| `groups` | `SidebarNode[][]` (legacy); a dashed line is drawn between groups |
| `value` · `defaultValue` · `onChange(id, node)` | selected node id |
| `title` · `onCollapse` · `footer` | header title (default "Automations"), shows the collapse button, bottom slot |
| `children` | extra rows composed after the config rows |

`SidebarNode`: `id`, `label`, `icon`, `active` (forces the state), `disabled`, `badge` / `badgeCount` / `count`, `dot`, `trailingIcon`, `children` (makes the row expandable), `expandable`, `expanded` / `defaultOpen` (initial open state), `onClick`. A parent opens by itself when one of its descendants is active. Opening a parent with no active child selects its first enabled child.

## SidebarMenuItem (the row)

| Prop | Effect |
|---|---|
| `label`, `icon` | `icon` is a named glyph (`conversation`, `campaign`, `template`, `copilot`, `datasource`, aliases `conversational-flows`, `campaign-flows`, `templates`, `data-source`; `name_o` / `name_f` pin a version) or any node, such as a lucide icon at `strokeWidth={1.25}` |
| `active` | Selected: `offwhite-80` fill, filled `gray-80` icon, `aria-current="page"`. On an `expandable` row it marks the parent of the active row (filled `gray-80` icon, no fill) |
| `expandable` + `expanded` + `onToggle` | Trailing `gray-80` chevron, `aria-expanded`; pair with `SidebarSubmenu` |
| `nested` / `level` | Nested rows are 28px, with 34px left padding plus a 16px icon slot; each further level adds 16px |
| `badge` / `badgeCount` / `count` | 18px pill, `offwhite-80` (white on hover or when selected), `text-body-500-s text-gray-100` |
| `dot` | 8px leading dot: `true` = `gray-60`, or a token name (`"green-90"`) |
| `trailingIcon` | Named glyph or node at the end (replaces the chevron) |
| `disabled` | 50% opacity, not focusable |
| `clickable={false}` | Static label row (a `div`, no hover) |

`SidebarMenuChildItem` is `SidebarMenuItem` at level 1. `SidebarGroup` (deprecated) is an expandable row that keeps its own open state.

## Structure and tokens

| Part | Style |
|---|---|
| Panel | `w-60`, `bg-white`, `border-r border-border`, 12px top/bottom and 8px side padding |
| `SidebarHeader` | 36px tall, 8px below it, 8px side padding; title `text-h6-600 text-black`; collapse button 24px, `rounded-sm`, `gray-80`, hover `offwhite-60` |
| Rows | 4px apart; 32px, 8px padding, 10px gap, `rounded-md`, `text-paragraph-400-l text-gray-100`, 16px icon; hover `offwhite-40` |
| `SidebarSubmenu` | 2px top padding, nested rows touch each other |
| `SidebarDivider` / groups | 1px dashed `offwhite-100`, 8px above and 4px below |
| `SidebarSection` · `SidebarSectionLabel` | rows with an optional label in `text-body-500-s` uppercase `muted-foreground` |
| `SidebarFooter` | pinned to the bottom, dashed `offwhite-100` top line, 8px top padding |

Rows use a 2px white gap and a 2px `blue-60` ring for focus. In the nav, Up/Down/Home/End move between visible rows.

```jsx
<Sidebar
  title="Automations"
  value={page}
  onChange={(id) => setPage(id)}
  onCollapse={() => setCollapsed(true)}
  items={[
    { id: "flows", label: "Conversational flows", icon: "conversation" },
    { id: "campaigns", label: "Campaign flows", icon: "campaign", badgeCount: 12 },
    { id: "templates", label: "Template", icon: "template", children: [
      { id: "tpl-flows", label: "Conversational flow" },
      { id: "tpl-campaigns", label: "Campaign flows" },
    ] },
    { type: "divider" },
    { id: "copilot", label: "Co-pilot", icon: "copilot" },
    { id: "data", label: "Data source", icon: "datasource" },
  ]}
/>
```
