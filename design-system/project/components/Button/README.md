# Button

Button V2.0, built on the shadcn Button. Every variant has four states: **default, hover, focus, disabled**. Focus is a 2px gap plus a 2px ring in the variant's focus color.

**Consumer provides:** `children` (a clear verb: "Save changes", "Delete invoice" — never "Submit" or "OK"), optional `variant`, `size`, `asChild`, and any `<button>` props.

| Prop | Values | Default |
|---|---|---|
| `variant` | `default` `note` `secondary` `success` `ghost` `destructive` `outline` `link` `add` `select` `demo` | `default` |
| `size` | `sm` (28px) `default` (32px) `lg` (36px) `icon-sm` (28) `icon` (32) `icon-lg` (36) | `default` |
| `asChild` | boolean | `false` |

## Types and colors

| Variant | Use | Default | Hover | Focus ring | Disabled | Text |
|---|---|---|---|---|---|---|
| `default` (Primary) | The one main action per screen/section | blue-90 | blue-100 | blue-60 | blue-40 | white |
| `note` (Send note) | Internal note actions (e.g. "Send note") — not for warnings | yellow-100 | yellow-100 + 8% black | yellow-80 | yellow-40 | white |
| `secondary` | Cancel, secondary actions | offwhite-60 | offwhite-100 | offwhite-100 | offwhite-40 · text gray-40 | gray-100 |
| `success` | Positive confirm actions (Resolve, Approve) | green-90 | green-100 | green-80 | green-20 | white |
| `ghost` | Toolbar and low-emphasis actions | transparent | offwhite-60 | offwhite-100 | text gray-40 | gray-100 |
| `destructive` | Delete / irreversible; always confirm in a Dialog | red-90 (solid) | red-100 | red-60 | red-40 | white |
| `outline` | Neutral bordered action | white, border offwhite-100 | offwhite-40 | offwhite-100 | text gray-40 | gray-100 |
| `link` | Inline navigation | — | underline, blue-100 | blue-60 | blue-40 | blue-90 |

- **Disabled** uses the lighter tint above (not 50% opacity).
- There are no loading or pressed states.
- Text is 13/20 Medium (`text-body-500-l`) at every size, including the patterns (split, select, switch, book a demo).
- Radius: **6px** (`radius-sm`) for 28px buttons (`sm`, `icon-sm`); **8px** (`radius-md`) for 32px buttons (`default`, `icon`); **10px** (`radius-lg`) for 36px buttons (`lg`, `icon-lg`). The Add button is fully round; split buttons square off the inner corners. There is no `xs` or `icon-xs` size; the smallest buttons are `sm` and `icon-sm` (28px).

## Icon positions

Svgs default to 16px. Mark each icon's side with `data-icon` so the padding on that side tightens. All positions work with every variant and text size.

| Icon position | Markup |
|---|---|
| Only text | `<Button>Label</Button>` |
| Left icon | `<Button><Icon data-icon="inline-start" />Label</Button>` |
| Right icon | `<Button>Label<Icon data-icon="inline-end" /></Button>` |
| Left + right icon | `<Button><Icon data-icon="inline-start" />Label<Icon data-icon="inline-end" /></Button>` |
| Icon only | `<Button size="icon" aria-label="Add"><Icon /></Button>` |

Left icon clarifies the action (Add, Export); right icon shows direction or disclosure (Next →, chevron); both only for split-style actions like "+ New ▾". Icon-only buttons always need `aria-label`.

## Patterns

| Pattern | Markup |
|---|---|
| Split · primary | `<div className="ds-split ds-split-primary"><Button size="sm">Send<SendIcon data-icon="inline-end" /></Button><Button size="sm" aria-label="More options"><DotsIcon /></Button></div>` |
| Split · secondary | `<div className="ds-split ds-split-secondary"><Button variant="secondary" size="sm"><PhoneIcon data-icon="inline-start" />Start call</Button><Button variant="secondary" size="sm" aria-label="More options"><ChevronIcon /></Button></div>` |
| Add | `<Button variant="add" size="icon-sm" aria-label="Add step"><PlusIcon /></Button>` — round, white; turns primary on hover/focus. Canvas "add node" buttons. |
| Switch button | `<Button variant="secondary" size="sm" role="switch" aria-checked={on}><SwitchIndicator checked={on} data-icon="inline-start" />Label</Button>` (`SwitchIndicator` from `@/components/ui/switch`) |
| Square | `<Button variant="secondary" size="icon-sm" aria-label="Delete"><TrashIcon /></Button>` |
| Ghost square | `<Button variant="ghost" size="icon-sm" aria-label="Delete"><TrashIcon /></Button>` |
| Select button | `<Button variant="select" size="sm"><CalendarIcon data-icon="inline-start" />Selectbox<ChevronIcon data-icon="inline-end" /></Button>` — add `data-filled` once a value is chosen (text turns black). Hover border blue-40, focus border blue-60 + blue-20 ring. |
| Book a demo | `<Button variant="demo" size="sm"><VideoIcon data-icon="inline-start" />Book a demo</Button>` (blue-20 tint → solid primary on hover). Neutral version: `variant="outline"`. |

In a split, the 1px gap is the divider and the focus ring wraps both halves.

## Preview conventions

The card lays out types vertically (Primary, Send note, Secondary, Success, Ghost, Destructive, then Patterns and Other), sizes and icon options as rows, and the four states as columns. `.is-hover` and `.is-focus` force a state for static display only; never use them in product screens.
