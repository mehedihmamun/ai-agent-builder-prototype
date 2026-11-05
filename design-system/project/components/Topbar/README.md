# Topbar

The global app header from the Figma **Topbar**: a 48px white bar with a 1px `border` line at the bottom. The logo sits on the left, the search pill in the center, and the actions on the right: notifications, Ask AI, help, then the user's avatar. Each part can be hidden, and each is also exported on its own.

**Consumer provides:** handlers (`onSearchClick`, `onNotificationsClick`, `onAskAIClick`, `onHelpClick`, `onUserClick`), `user` (`name`, `avatarUrl`, `status`), `hasNotifications`, and optionally a `logo` and extra actions as `children`. The search pill is a trigger button for your search or command palette, not a text field. Bind ⌘K / Ctrl+K in the app yourself; the Topbar only shows the hint.

| Prop | Values | Default |
|---|---|---|
| `logo` | node · `null` hides it | REVE Chat logo (`TopbarLogo`) |
| `showSearch` · `searchPlaceholder` · `searchShortcut` · `onSearchClick` | boolean · string · node · fn | `true` · "Search anything..." · "⌘ +K" |
| `showNotifications` · `hasNotifications` · `onNotificationsClick` | boolean · boolean (red dot) · fn | `true` · `false` |
| `showAskAI` · `onAskAIClick` | boolean · fn | `true` |
| `showHelp` · `onHelpClick` | boolean · fn | `true` |
| `user` · `onUserClick` | `{ name?, avatarUrl?, status?: "online" \| "away" \| "busy" \| "offline" }` · `null` hides it | generic user icon |
| `children` | extra actions, placed before the bell | — |

## Anatomy and tokens

| Part | Style |
|---|---|
| Bar | `h-12` (48), `px-4`, 16px gaps, `bg-white`, `border-b border-border`; left and right columns share the free space equally, so the search stays centered |
| Logo (`TopbarLogo`) | 24px tall (117 × 24) |
| Search (`TopbarSearch`) | 250 × 28 pill, 1px `gray-60` border (hover `gray-80`), 8px left / 12px right padding, 6px gap; 16px `gray-100` icon; placeholder `text-paragraph-400-l text-gray-60`; hint `text-paragraph-400-m text-gray-80`. Focus: `ring` border + 2px white gap + 2px `blue-60` ring |
| Actions | 8px apart |
| Icon button (`TopbarIconButton`) | 32px, `rounded-md`, 16px `gray-100` icon; plain: hover `offwhite-60`; `boxed` (help): 1px `border`, hover `offwhite-40`; `dot`: 7px `red-90` with a 2px white ring, 6px from the top right |
| Ask AI (`TopbarAskAI`) | 28px; 1px gradient border at 120° (`offwhite-100` to 55%, then `purple-100`); white inside, hover `offwhite-40`; 11px side padding, 4px gap; `text-body-500-l text-gray-100` |
| User (`TopbarUser`) | 28px `Avatar` in a 32px round button; with a name, the first letter in `text-body-600-m text-gray-100` on `offwhite-60`; 8px status dot with a 2px white ring: online `green-90` · away `yellow-100` · busy `red-80` · offline `gray-60` |

Every control uses the same focus style: a 2px white gap and a 2px `blue-60` ring.

## Usage

- Use one Topbar per app shell, full width above the Sidebar and the page.
- Icon-only buttons need an `aria-label`. The built-in ones set it (the bell reads "Notifications, unread" when the dot shows), plus a native tooltip.
- Extra actions go in `children` as `TopbarIconButton`s, so they keep the same size and states.
- Keep it 48px tall. Don't shrink it per app.

```jsx
<Topbar
  hasNotifications={unread > 0}
  user={{ name: me.name, avatarUrl: me.photo, status: "online" }}
  onSearchClick={openCommandPalette}
  onNotificationsClick={openInbox}
  onAskAIClick={openCopilot}
  onHelpClick={openHelp}
  onUserClick={openAccountMenu}
/>
```
