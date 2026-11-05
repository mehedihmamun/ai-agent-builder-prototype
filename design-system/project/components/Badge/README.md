# Badge

A small label for the state of a record — campaign, template, ticket, invoice. Matches the Figma "Badge": 6 tones, each solid or light, in two shapes. (Formerly named Status.)

**Consumer provides:** `tone`, optional `variant` (`"solid"` default, or `"light"`), optional `shape` (`"default"` or `"pill"`; `"rounded"` is an alias for pill), and the state as children in sentence case (first letter capital: "Approved", "Pending") — it renders exactly as written.

| Tone | Meaning | Solid (white text) | Light (bg / text) |
|---|---|---|---|
| `green` | Success, approved, any positive state | `green-90` | `green-20` / `green-100` |
| `yellow` | Pending or processing | `badge-yellow` (#F0A026) | `yellow-20` / `badge-yellow-text` (#F09D1F) |
| `red` | Failed, rejected, any negative state | `red-80` | `red-20` / `red-80` |
| `blue` | Sending, in progress | `blue-80` | `blue-30` / `blue-90` |
| `gray` | Draft, inactive | `gray-100` | `offwhite-100` / `gray-100` |
| `pitch` | Open | `pitch-100` | `pitch-20` / `badge-pitch-text` (#EB6C50) |

- 20px tall, Body 500 S (`text-body-500-s`, 10/16 Medium), sentence case, never wraps.
- **Shape default:** radius 5px, 6px left/right padding. 5px is not on the radius scale — it is the one documented exception (`rounded-[5px]`).
- **Shape pill:** fully rounded (`rounded-full`), 8px left/right padding. Works with every tone and variant.
- Solid badges use white text in every tone, including yellow (as drawn in Figma).
- Use **solid** where the state must stand out (table status column, detail page header); **light** in dense lists or next to other colored UI. Don't mix solid and light, or the two shapes, in the same column.
- Use one word, the state itself: Approved, Pending, Rejected, Sending, Draft, Open.
- Use Badge for every state label in tables, cards and headers. `badgeVariants({ tone, variant, shape })` gives the classes for a non-span element.

```jsx
<Badge tone="green">Approved</Badge>
<Badge tone="yellow" variant="light">Pending</Badge>
<Badge tone="blue" shape="pill">Sending</Badge>
```
