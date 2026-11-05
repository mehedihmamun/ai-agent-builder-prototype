# Card

A white surface for grouping one task or summary: `Card` with `CardHeader` (`CardTitle`, `CardDescription`, optional `CardAction`), `CardContent` and an optional `CardFooter`.

**Consumer provides:** the parts as children; `size` `"default"` (16px spacing) or `"sm"` (12px spacing).

- Title `text-h4-600`; description `text-paragraph-400-l text-muted-foreground`.
- Surface `bg-card`, `rounded-xl`, 1px `foreground/10` ring; footer sits on `muted/50` with a `border` top rule and holds the actions.
- `CardAction` sits top-right in the header (a badge or ghost button).
- Known issue: passing `className="text-paragraph-400-l"` to CardDescription removes its `text-muted-foreground` (see Gotchas), so the description shows in `foreground`.
