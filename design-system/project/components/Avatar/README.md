# Avatar

An image element with a fallback for representing the user — the shadcn Avatar (Radix, Nova style) in the three Figma **Avatar** types — **icon**, **image** and **first letter** — plus the status badge (Figma "Avatar · Status") and the group (Figma "Avatar group"). Four sizes: 24, 28, 32 and 40px.

**Consumer provides:** the shadcn composition — `Avatar` › `AvatarImage` (`src`, `alt`) + `AvatarFallback` (the name's first letter; empty = user icon) + optional `AvatarBadge`; `AvatarGroup` › `Avatar`s + optional `AvatarGroupCount`. Shortcut: `<Avatar src={url} name="Hachib Rahaman" />` (used only when there are no children) renders the image with a first-letter fallback.

| Part | Props | Style |
|---|---|---|
| `Avatar` | `size`: `sm` 24 · `md` 28 · `default` 32 · `lg` 40; shortcut `src` `name` `alt` | Round; 0.75px inner border, `black` at 4%. Does not clip, so the badge ring can sit outside the circle |
| `AvatarImage` | `src` `alt` | Covers the circle; shown once loaded |
| `AvatarFallback` | children | **First letter** (children): `purple-10` fill, `purple-100` Regular letter at half the avatar — `text-paragraph-400-m` (12) · `text-paragraph-400-xl` (14) · `text-h5` (16) · 20px at lg. **User icon** (no children): `offwhite-60` fill, Lucide `User` in `gray-80`, stroke 1.875, half the avatar |
| `AvatarBadge` | children (icon), `status` | Bottom-right, 2px `background` (white) ring; 8px at sm (icon hidden), 10px at md / default, 12px at lg. `status`: online `green-90` · away `yellow-100` · busy `red-80` · offline `gray-60`; none = `primary` with a white icon |
| `AvatarGroup` | — | Avatars overlap by 8px, each with a 2px white ring |
| `AvatarGroupCount` | children ("+3" or an icon) | Same size as the group's avatars, `muted` fill, `muted-foreground` text — `text-body-500-m` (12/18 Medium) at sm / md, `text-body-500-xl` (14/22 Medium) at default / lg; icon 12 / 14 / 16 / 20px |

Token exceptions: the 0.75px border (`after:border-[0.75px]`) and the 20px letter at lg (`text-[20px]`) have no token.

## Types

- **Icon** — no photo and no name: `<Avatar><AvatarFallback /></Avatar>`.
- **Image** — `AvatarImage`; while it loads or if it fails, the fallback shows.
- **First letter** — no photo: `<AvatarFallback>A</AvatarFallback>`, the first letter of the name only.

## Variants

- **Badge** — `AvatarBadge` with `status="online"` for presence.
- **Badge with icon** — an icon (e.g. Plus) inside `AvatarBadge` on a `primary` badge.
- **Avatar group** — several avatars overlapping.
- **Avatar group count** — group ending with `AvatarGroupCount` "+3".
- **Avatar group with icon** — group ending with an icon (e.g. Plus to add people).

- Give each avatar an `alt` (or `name`); give badges and counts an `aria-label` ("Online", "3 more").
- Use 32px in lists and tables, 24/28px in dense rows and chips (the Navbar uses 28px), 40px in profile headers.

```jsx
<Avatar size="default">
  <AvatarImage src={user.photo} alt={user.name} />
  <AvatarFallback>{user.name[0]}</AvatarFallback>
  <AvatarBadge status="online" aria-label="Online" />
</Avatar>

<AvatarGroup>
  {users.slice(0, 3).map(u => <Avatar key={u.id} src={u.photo} name={u.name} />)}
  <AvatarGroupCount aria-label={`${users.length - 3} more`}>+{users.length - 3}</AvatarGroupCount>
</AvatarGroup>
```
