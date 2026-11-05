# Textarea

Multiline Input from the Figma "Textarea" (State: default · filled · focus · invalid · disabled), plus `RichTextarea` from "Textarea · rich" (25 · Builder parts): the same field with a bottom toolbar — a `{}` variable button on the left and a character counter on the right. Every Textarea has a visible `Label` above it.

**Consumer provides:** a `Label` with matching `htmlFor`/`id`, `placeholder`, value props, `required` when mandatory, and — for errors — `aria-invalid` plus an error line below. `RichTextarea` also takes `maxLength` (shows the counter) and `onInsertVariable` (shows the `{}` button).

| Component | Props | Notes |
|---|---|---|
| `Textarea` | any `<textarea>` prop | Resizes vertically; min 80px |
| `RichTextarea` | any `<textarea>` prop · `maxLength` · `onInsertVariable(textarea)` · `insertVariableLabel` ("Insert variable") · `toolbar` | `className` styles the outer box; counter reads `value` (controlled) or tracks typing (uncontrolled) |

## Tokens

- White fill, 1px `border-input` (gray-20), radius 8px (`rounded-md`), padding 12px sides / 8px top-bottom, text `text-paragraph-400-l` in `foreground`; placeholder `gray-60`.
- `Textarea`: `min-h-20` (80px). `RichTextarea`: 120px tall by default (76px text area + 8px gap + 18px toolbar).
- States (solid 1px borders, no glow):
  - Focus: `blue-90` border (`RichTextarea` uses focus-within on the box)
  - Invalid (`aria-invalid`): `red-90` border
  - Disabled: `offwhite-40` fill, black text. `RichTextarea` disabled also fades to 60% opacity (as in Figma).
- Toolbar: `{}` = lucide `Braces` 16px `gray-80` (foreground on hover); counter `text-paragraph-400-m gray-60`, e.g. "946/1024".

## Usage

- Use `Textarea` for free text (descriptions, notes); `RichTextarea` for message bodies with variables (WhatsApp Body /1024, header/footer text).
- `RichTextarea` is a plain `<textarea>` — no rich-text editor. `onInsertVariable` receives the element so you can insert `{{1}}` at the caret.
- Wrap Label, field and helper/error text in `ds-field`; error text `text-paragraph-400-m text-destructive`.

```jsx
<div className="ds-field">
  <Label htmlFor="goal">Goal</Label>
  <Textarea id="goal" placeholder="Describe what this campaign should achieve" />
</div>

<div className="ds-field">
  <Label htmlFor="body" required>Body</Label>
  <RichTextarea
    id="body"
    maxLength={1024}
    value={body}
    onChange={(e) => setBody(e.target.value)}
    onInsertVariable={() => setBody((b) => `${b}{{${nextVar}}}`)}
    placeholder="Write your message… use {} to add a variable"
  />
</div>
```
