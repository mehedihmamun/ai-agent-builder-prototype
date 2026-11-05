# Navbar

The app's vertical navigation bar from the Figma "Navbar": a 48px-wide, full-height bar with the purple gradient, an optional logo at the top, icon-only menu items, footer items and the user's avatar at the bottom. Item states (default, hover, selected, pressed, focus) are built in — there's no separate menu-item component.

**Consumer provides:** `items` and `footerItems` (`{ id, label, icon, selectedIcon?, onClick? }`, `icon` a 20px SVG and `selectedIcon` its filled version), `value` + `onChange` for the selected item (or `defaultValue`), an optional `logo` (max 36 × 27px), and `user` (`name`, `avatarUrl`, `status`; `null` hides the avatar). Give the bar a height (usually the full viewport).

| Part | Style |
|---|---|
| Bar | 48px (`w-12`), 100% tall, does not shrink; `bg-navbar` (99.74° `navbar-from` 16% → `navbar-via` 59% → `navbar-to` 87%); scrolls if the items don't fit |
| Top | 6px padding; logo slot 36 × 27 (only when `logo` is set); items 4px apart |
| Items | 36 × 36, 8px padding, 8px radius (`rounded-md`); white 20px icon |
| Bottom | 6px padding; footer items 4px apart, then the avatar 4px below |
| User | 28px `Avatar` (`md`): photo, or the name's first letter; 10px `AvatarBadge` status dot with a 2px white ring — online `green-90`, away `yellow-100`, offline `gray-60` |

## Item states (Figma "Navbar item")

| State | Look |
|---|---|
| Default | Icon at 90% opacity |
| Hover | White 16% fill + purple glow at 70% (gradient 202.25° #0A060F → #945EEF, 8px blur) |
| Selected | White 16% fill + the glow at 100%; shows `selectedIcon` (the filled icon) when given; `aria-current="page"` |
| Pressed | White 16% fill + glow #7E4DCC → #945EEF, no blur |
| Focus | 2px white ring |

The glow colours (#0A060F, #945EEF, #7E4DCC) are not tokens; they are written as gradient literals in `navbar.tsx`.

Figma's **Nav icon** set (inbox, automation, reports, contacts, settings, what's new, dashboard — outline and filled — and notification) is not bundled in code: export the SVGs from Figma (or use Lucide at 20px, stroke 1.5) and pass them as `icon` / `selectedIcon`.

- Every item has a text `label` (read by screen readers and shown as a native tooltip).
- One item is selected at a time — the current page. Keep the order: Dashboard, Inbox, Reports, Automation, Campaigns, Contacts, Integrations, Settings; put Notifications, Settings and What's new in `footerItems`.
- Place the Navbar at the far left of the app shell, full height; page content starts right of it.

```jsx
<Navbar
  value={page}
  onChange={setPage}
  logo={<img src={logoMark} alt="REVE Chat" />}
  items={[{ id: "inbox", label: "Inbox", icon: <InboxOutline />, selectedIcon: <InboxFilled /> }]}
  footerItems={[{ id: "settings", label: "Settings", icon: <SettingsOutline /> }]}
  user={{ name: "Hachib Rahaman", avatarUrl, status: "online" }}
/>
```
