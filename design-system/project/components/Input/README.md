# Input

The shadcn text input, styled to the Figma "Input field". Every Input has a visible Label above it.

**Consumer provides:** a `Label` with matching `htmlFor`/`id`, `type`, `placeholder`, value props, `required` when the field is mandatory, and — for errors — `aria-invalid` plus a helper line below.

- Wrap Label, Input and helper text in `<div className="ds-field">` (4px gaps).
- 32px tall, 12px left/right padding, radius 8px (`radius-md`), 1px `gray-20` border, **white** fill.
- Text 13/20 Regular (`text-paragraph-400-l`); value text `black`; placeholder `gray-60`.
- States:
  - Default: white, gray-20 border
  - Focus / typing: `ring` (blue-60) border + 3px `ring/50` ring
  - Filled: same as default with black value text
  - Disabled: `offwhite-40` fill, `gray-20` border, black text — no fading
  - Error (`aria-invalid`): `destructive` border + `destructive/20` ring, message below in `text-paragraph-400-m text-destructive`
- Helper text: `text-paragraph-400-m text-muted-foreground`. Errors: `text-paragraph-400-m text-destructive` and `aria-invalid` on the Input (1px red-90 border). Focus is a 1px blue-90 border, no glow.

```jsx
<div className="ds-field">
  <Label htmlFor="email" required>Email</Label>
  <Input id="email" type="email" placeholder="example@gmail.com" required />
</div>
```
