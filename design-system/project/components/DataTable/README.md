# DataTable

Config-driven data grid (Figma "15 · DataTable"): toolbar (title, count, Filter, Columns), sortable headers with help icons, row selection, hover row actions in one sticky trailing cell, pagination, empty and loading states. Built on `Table`, `Popover`, `Button`, `Badge`, `Avatar`, `Checkbox`. Use it for data screens; the plain `Table` is for small static tables.

**Consumer provides:** `columns`, `rows`, and the frame around it (`<div className="overflow-hidden rounded-lg border border-border">`).

## Props

| Prop | Type | Notes |
|---|---|---|
| `columns` | `DataTableColumn[]` | See below |
| `rows` | `Row[]` | Row id = `rowId(row, i)` › `row[rowKey]` › `row.id` › index |
| `title`, `count` | node, number | Toolbar title (`text-h6-600`) + gray light Badge |
| `filterable`, `filterContent`, `activeFilterCount` | | "Filter" tool button + popover; `activeFilterCount` shows a small blue count badge |
| `columnToggle` | boolean, default `true` | "Columns" menu (Show columns). `columnVisibility` / `onColumnVisibilityChange` to control |
| `selectable`, `selected`, `defaultSelected`, `onSelectedChange` | ids | Header checkbox selects / clears the selectable rows on this page (other ids are kept) |
| `sort`, `defaultSort`, `onSortChange` | `{ key, dir } \| null` | Click cycles asc → desc → none |
| `manualSorting` | boolean | `true` = rows render as given (you sort, e.g. server-side). Default: `true` when `onSortChange` is passed, otherwise the table sorts client-side |
| `rowActions` | `(row) => DataTableRowAction[]` | `{ label, icon?, destructive?, disabled?, menu?, onClick? }` — icon buttons; `menu: true` items go in a "More actions" ⋮ menu |
| `onRowClick`, `rowDisabled` | | Clickable rows are focusable (Enter / Space). Disabled rows: 50% opacity, not selectable |
| `stickyFirstColumn` | boolean, default `true` | On horizontal scroll the select cell + first column stay left; the actions cell always stays right |
| `loading`, `loadingRows` | | Skeleton rows (default 5) |
| `emptyTitle`, `emptyText`, `emptyIcon` | | Default "No data" + Inbox icon |
| `pagination` | `{ page, pageCount, info?, pageSize?, pageSizeOptions?, onPageChange?, onPageSizeChange?, onPageSizeClick? }` | `pageSizeOptions` + `onPageSizeChange` gives a size menu |

**Column:** `key`, `header`, `accessor` (field name or `(row) => node`), `render`, `sortValue` (for client sort of rendered cells), `align` (`left` `right` `center`; numbers right), `width`, `sortable`, `truncate` (one line + ellipsis, set `width`), `icon`, `hidden`, `help` (tooltip text), `className`.

**Cell helpers:** `DataTableText { text, description? }` · `DataTableAvatar { name, src?, description? }` · `DataTableDot { color: green|blue|gray|red|yellow, label }` · `DataTableChannels { channels: (string | { label, tone })[] }` (SMS yellow, WhatsApp green, others blue light Badges; `tone` overrides).

## Tokens

| Part | Spec |
|---|---|
| Toolbar | 52px (`h-13`), px 16, bottom `border-border`; tool buttons 28px, radius 8, `border-input`, icon gray-80, `text-body-500-l` gray-100; hover offwhite-40 + blue-40 border; open offwhite-60 |
| Header | 36px (`h-9`), px 12 (16 on the outer columns), `bg-offwhite-40`, 1px offwhite-100, `text-body-500-l` gray-80. Sortable: up/down chevrons gray-40; sorted: one chevron gray-80. Help icon 14px gray-60 |
| Cells | 44px (`h-11`), px 12, `text-paragraph-400-l` gray-100, 1px offwhite-80 (none on the last row) |
| Rows | hover offwhite-40 · selected blue-20 (hover blue-30) · disabled 50% |
| Select cell | 52px wide, pl 16; 16px checkbox inside a 24×24 touch target |
| Row actions | 28px icon buttons, radius 8, gray-80; hover offwhite-60 / gray-100 (destructive: red-10 / red-90); shown on hover, selection or keyboard focus |
| Menus | 180px (`w-45`), radius 8, p-4px, `shadow-md`; items 32px, radius 6, `text-paragraph-400-l`; title `text-body-500-m` gray-80 |
| Pagination | 52px, top border; info `text-paragraph-400-l` gray-80; 28px prev/next (offwhite-40 border, 40% disabled); pages gray-80, current offwhite-100 / gray-100; page size offwhite-80 border |
| Empty | 48px vertical padding, 32px Inbox gray-40, title `text-body-500-xl`, text `text-paragraph-400-l` gray-80 |

## Rules

- One table per section; put page-level actions (Create, Export) outside the toolbar.
- Status columns use `Badge` (green Running, yellow Paused, gray Completed); types use `DataTableDot`; channels use `DataTableChannels`.
- Right-align numbers. Give truncating columns a `width`.
- Destructive row actions (`destructive: true`) must open a confirm Dialog.
- Sorting a paginated, server-backed list: pass `sort` + `onSortChange` and fetch sorted rows.

```tsx
<div className="overflow-hidden rounded-lg border border-border">
  <DataTable
    title="Campaign flows"
    count={500}
    selectable
    columns={[
      { key: "name", header: "Campaign", sortable: true, width: 240, render: (r) => <DataTableText text={r.name} description={r.slug} /> },
      { key: "channels", header: "Channel", render: (r) => <DataTableChannels channels={r.channels} /> },
      { key: "enrolled", header: "Enrolled", align: "right", sortable: true, help: "Contacts currently in the flow" },
    ]}
    rows={flows}
    rowActions={(r) => [
      { label: "Edit", icon: <EditIcon />, onClick: edit },
      { label: "Delete", icon: <TrashIcon />, destructive: true, menu: true, onClick: confirmDelete },
    ]}
    pagination={{ page, pageCount: 10, info: "Showing (1-50) of 500", pageSize: 50, onPageChange: setPage }}
  />
</div>
```
