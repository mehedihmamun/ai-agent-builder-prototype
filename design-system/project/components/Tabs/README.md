# Tabs

The shadcn Tabs (Radix), styled to the Figma "Tab": text tabs on a 1px border line with an underline on the active tab and an optional count pill.

**Consumer provides:** `Tabs` with `value` + `onValueChange` (or `defaultValue`), a `TabsList` with an `aria-label`, one `TabsTrigger` per tab (unique `value`, label as children, optional `count`, `disabled`), and a `TabsContent` per `value`.

| Part | Props | Notes |
|---|---|---|
| `Tabs` | `value` `defaultValue` `onValueChange` `activationMode` | Column layout, 16px between list and panel |
| `TabsList` | `aria-label` | Tabs 24px apart on a 1px `border` bottom line |
| `TabsTrigger` | `value` (required) `count` `disabled` | `count` renders the pill after the label |
| `TabsContent` | `value` (required) | Focusable panel; 3px `ring/50` focus ring |

## Style

- **Tab:** 8px top / 2px sides / 10px bottom padding plus a 2px underline slot (42px tall), 6px gap between label, icon and pill.
- **Text:** 14/22 Medium (`text-body-500-xl`) `muted-foreground` (gray-80) · hover `gray-100` · active 14/22 Semi Bold (`text-body-600-xl`) `gray-100` with a 2px `gray-100` underline · disabled `gray-40`.
- **Focus:** 1px `blue-90` inset outline, radius 4px.
- **Count pill:** 18px tall, min 18px wide, 5px side padding, fully round, 12/18 Medium (`text-body-500-m`) `gray-100` on `offwhite-60`; `blue-20` fill on the active tab.
- Keyboard: ← → move between tabs and select (automatic activation), Home / End jump to first / last; disabled tabs are skipped.

## Use

```jsx
<Tabs defaultValue="all">
  <TabsList aria-label="Channels">
    <TabsTrigger value="all" count={12}>All</TabsTrigger>
    <TabsTrigger value="whatsapp" count={3}>WhatsApp</TabsTrigger>
    <TabsTrigger value="sms" disabled>SMS</TabsTrigger>
  </TabsList>
  <TabsContent value="all">…</TabsContent>
  <TabsContent value="whatsapp">…</TabsContent>
</Tabs>
```

- Use for switching between views of the same context (channel filters, settings sections). Keep labels to one or two words; don't wrap tabs onto two lines.
- Bundle mapping: `<Tabs items value onChange>` → map `items` to `TabsTrigger`s (`id` → `value`, `count`, `disabled`) and `onChange(id)` → `onValueChange`.
