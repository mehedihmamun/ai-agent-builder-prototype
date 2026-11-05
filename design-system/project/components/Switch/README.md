# Switch

The shadcn Switch (Radix, `role="switch"`), styled to the Figma "Switch" and "Switch · In button". Use it for settings that take effect immediately.

**Consumer provides:** `checked` + `onCheckedChange` (or `defaultChecked`), `disabled`, and a name: `aria-label` or a `<Label htmlFor>` pointing at its `id`.

| Prop | Values | Default |
|---|---|---|
| `checked` / `defaultChecked` | boolean | — / `false` |
| `onCheckedChange` | `(checked: boolean) => void` | — |
| `disabled` | boolean | `false` |
| `variant` | `default` (32×18) `in-button` (22×12) | `default` |

`SwitchIndicator` — a non-interactive span with the same look (`checked`, `variant`, default `in-button`) for the Switch-button pattern, where the Button is the control.

## Style

- **Default:** 32×18 fully round track, `gray-40` off / `blue-90` on; 14px white knob, 2px inset, `shadow-xs`, slides 14px.
- **In button:** 22×12 track, `gray-40` off / `green-90` on; 8px white knob, no shadow, slides 10px.
- Focus: 1px `blue-90` inner border + 3px `blue-90` ring. Disabled: 50% opacity. No hover state.
- Keyboard: Tab to focus, Space / Enter toggles.

## Use

```jsx
<div className="flex items-center gap-2">
  <Switch id="auto-assign" checked={on} onCheckedChange={setOn} />
  <Label htmlFor="auto-assign">Auto-assign chats</Label>
</div>

// Switch button (Button is the switch; the indicator is visual only)
<Button variant="secondary" size="sm" role="switch" aria-checked={on} onClick={() => setOn(!on)}>
  <SwitchIndicator checked={on} data-icon="inline-start" />
  Auto-assign
</Button>
```

- Use a Switch for instant on/off; use a Checkbox when the change is saved with a form button.
- Never put a `Switch` inside a `Button` (nested buttons); use `SwitchIndicator` there.
- In clickable rows, stop the click from reaching the row: `onClick={(e) => e.stopPropagation()}` (the bundle did this by default).
- Bundle mapping: `onChange(checked)` → `onCheckedChange`; `.ds-switch` span → `SwitchIndicator`.
