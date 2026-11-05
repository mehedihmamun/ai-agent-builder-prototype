# Icons

Icons come from two places. **Standard icons** — every Figma `Icon/<Name>` (Plus, X, ChevronDown, Trash2, …) — are Lucide shapes: import them from `lucide-react` and never redraw them. **Custom icons** — Figma `Icon/BDS/*` (the bundle's DataTable, Topbar and Sidebar icons), `Icon/Brand/WhatsApp`, and the REVE Chat logos — are the exact Figma SVG exports in `components/ui/icons.tsx`.

**Consumer provides:** a size class when it isn't 16px (`size-5` for 20px), a `text-*` colour token on the icon or its parent, and `aria-label` only when the icon carries meaning on its own (otherwise it stays hidden from screen readers).

## Which one to use

| Figma component | Import from | Name |
|---|---|---|
| `Icon/<Name>` | `lucide-react` | Same name: `Icon/Trash2` → `Trash2`. Only exception: `Icon/ChevronUpDown` → `ChevronsUpDown` |
| `Icon/BDS/<Name>` | `@/components/ui/icons` | `<Name>Icon`: `Icon/BDS/Search` → `SearchIcon`, `Icon/BDS/AskAI` → `AskAiIcon` |
| `Icon/Brand/WhatsApp` | `@/components/ui/icons` | `WhatsAppIcon` |
| `Logo / REVE Chat` · `Logo / REVE Chat mark` | `@/components/ui/icons` | `RevechatLogo` · `RevechatMark` |

- Use the icon the Figma instance actually uses (check its main component). In Figma, the DataTable toolbar, sorting, pagination and row actions, the Topbar and the Sidebar use `Icon/BDS/*`. The Accordion, Dialog, date and time pickers and forms use Lucide.
- Don't swap a BDS icon for the Lucide icon that looks like it, or the reverse. They have different strokes (BDS 1.75, Lucide 1.5 in Figma) and different default colours.
- **Name clash:** lucide-react also exports `ArrowUpIcon`, `ArrowDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronDownIcon`, `ColumnsIcon`, `FilterIcon`, `EditIcon`, `TrashIcon`, `SearchIcon`, `InboxIcon`, `DownloadIcon` and `CopyIcon` (its `…Icon` aliases). When your editor auto-imports one of these, check the import path. If a file needs both, alias one: `import { ChevronDownIcon as BdsChevronDownIcon } from "@/components/ui/icons"`.
- If you need an icon that isn't in Figma, use Lucide. Don't draw a new SVG.
- To look an icon up by its Figma name, use `bdsIcons["BDS/Search"]`. It maps every `Icon/BDS/*` name, without the `Icon/` prefix, to its component. `BdsIconName` is the type of its keys.

## Size

| Context | Size | How |
|---|---|---|
| Default: buttons, inputs, table cells, inline with text | 16px | Custom icons are 16px by default. Lucide's default is 24px, so add `className="size-4"`. Button and the picker triggers already size child icons to 16px |
| Navigation: Navbar items | 20px | `className="size-5"`. The Navbar sizes its item icons itself |
| Empty states | 32px | `className="size-8"` (the DataTable empty state uses `InboxIcon` at 32px) |
| Logos | Figma size | `RevechatLogo` is 136 × 28 and `RevechatMark` is 20 × 11. Scale by height: `className="h-7 w-auto"` |

- Strokes are drawn on the 24px grid (16px for `TableView`, `GridView` and `Sidebar*`) and scale with the icon. At 16px a 1.75 stroke draws at about 1.2px, as in Figma. Custom icons have their stroke widths built in.
- The Lucide components in Figma use **stroke 1.5**, although the Figma note says 2. To match Figma, pass `strokeWidth={1.5}`. Lucide's default is 2, which is what the existing components use. Navbar items use 1.25 (see the Navbar guide).

## Colour

Icons draw in `currentColor`, so they take the text colour. Set it with a text token on the icon or its parent. Never use a hex value or an arbitrary `stroke-[…]` class.

| Icons | Figma default | Class |
|---|---|---|
| Lucide (`Icon/<Name>`) | gray-80 | `text-muted-foreground` |
| BDS (`Icon/BDS/*`) | black | `text-foreground` |
| Sidebar (`Icon/BDS/Sidebar*`) | gray-100 | `text-gray-100` |
| In context | DataTable and Topbar actions gray-100 or gray-80, inactive sort gray-40, delete red-90 | `text-gray-100`, `text-muted-foreground`, `text-gray-40`, `text-destructive`; `text-white` on dark surfaces |

- `Icon/Play` is the only filled Lucide icon in Figma: `<Play fill="currentColor" stroke="none" />`. The dot in `HelpIcon` is filled too, and that's built in.
- Brand icons keep their own colours and ignore `text-*`. `WhatsAppIcon` is green-90 and the phone is a transparent cut-out, so place it on a light surface. `RevechatLogo` and `RevechatMark` are brand orange, black and gray-60. On a dark surface pass `inverse`, which turns the black parts white, as the Figma Navbar does with the mark: `<RevechatMark inverse />`.

## Accessibility

- Custom icons render `aria-hidden="true"` by default. Passing `aria-label` makes one a labelled image (`role="img"`), which is useful for a standalone logo.
- lucide-react 0.454 doesn't hide icons by default. Inside a labelled button that's fine. Add `aria-hidden` to a decorative Lucide icon that stands alone next to text.
- An icon-only button gets its `aria-label` on the `<button>`, not on the icon.

```jsx
import { Plus, Trash2 } from "lucide-react";
import { SearchIcon, DotsIcon, RevechatMark } from "@/components/ui/icons";

<Button><Plus />Add contact</Button>
<Button variant="ghost" size="icon" aria-label="Row actions"><DotsIcon className="text-gray-100" /></Button>
<SearchIcon className="text-muted-foreground" />
<Trash2 className="size-4 text-destructive" strokeWidth={1.5} />
<RevechatMark inverse className="h-5 w-auto" />
```

## All Figma icons

The 63 components in Figma "02 · Icons", in Figma order.

| # | Figma component | Import | Notes |
|---|---|---|---|
| 1 | `Icon/Plus` | `import { Plus } from "lucide-react"` |  |
| 2 | `Icon/X` | `import { X } from "lucide-react"` |  |
| 3 | `Icon/ChevronDown` | `import { ChevronDown } from "lucide-react"` |  |
| 4 | `Icon/ChevronUp` | `import { ChevronUp } from "lucide-react"` |  |
| 5 | `Icon/ChevronUpDown` | `import { ChevronsUpDown } from "lucide-react"` | Lucide name is `ChevronsUpDown` (the Figma cell label says so too) |
| 6 | `Icon/ChevronLeft` | `import { ChevronLeft } from "lucide-react"` |  |
| 7 | `Icon/ChevronRight` | `import { ChevronRight } from "lucide-react"` |  |
| 8 | `Icon/ChevronsLeft` | `import { ChevronsLeft } from "lucide-react"` |  |
| 9 | `Icon/ChevronsRight` | `import { ChevronsRight } from "lucide-react"` |  |
| 10 | `Icon/CircleCheck` | `import { CircleCheck } from "lucide-react"` |  |
| 11 | `Icon/CircleX` | `import { CircleX } from "lucide-react"` |  |
| 12 | `Icon/User` | `import { User } from "lucide-react"` |  |
| 13 | `Icon/Calendar` | `import { Calendar } from "lucide-react"` |  |
| 14 | `Icon/Clock` | `import { Clock } from "lucide-react"` |  |
| 15 | `Icon/ArrowLeft` | `import { ArrowLeft } from "lucide-react"` |  |
| 16 | `Icon/Check` | `import { Check } from "lucide-react"` |  |
| 17 | `Icon/Bell` | `import { Bell } from "lucide-react"` |  |
| 18 | `Icon/Phone` | `import { Phone } from "lucide-react"` |  |
| 19 | `Icon/Mail` | `import { Mail } from "lucide-react"` |  |
| 20 | `Icon/MessageSquareText` | `import { MessageSquareText } from "lucide-react"` |  |
| 21 | `Icon/Brand/WhatsApp` | `import { WhatsAppIcon } from "@/components/ui/icons"` | Brand colour; ignores `text-*` |
| 22 | `Icon/Info` | `import { Info } from "lucide-react"` |  |
| 23 | `Icon/CloudUpload` | `import { CloudUpload } from "lucide-react"` |  |
| 24 | `Icon/Braces` | `import { Braces } from "lucide-react"` |  |
| 25 | `Icon/ArrowUpRight` | `import { ArrowUpRight } from "lucide-react"` |  |
| 26 | `Icon/Image` | `import { Image } from "lucide-react"` |  |
| 27 | `Icon/Trash2` | `import { Trash2 } from "lucide-react"` |  |
| 28 | `Icon/Megaphone` | `import { Megaphone } from "lucide-react"` |  |
| 29 | `Icon/Users` | `import { Users } from "lucide-react"` |  |
| 30 | `Icon/BookOpen` | `import { BookOpen } from "lucide-react"` |  |
| 31 | `Icon/Wallet` | `import { Wallet } from "lucide-react"` |  |
| 32 | `Icon/Type` | `import { Type } from "lucide-react"` |  |
| 33 | `Icon/Video` | `import { Video } from "lucide-react"` |  |
| 34 | `Icon/Images` | `import { Images } from "lucide-react"` |  |
| 35 | `Icon/FileText` | `import { FileText } from "lucide-react"` |  |
| 36 | `Icon/MapPin` | `import { MapPin } from "lucide-react"` |  |
| 37 | `Icon/Play` | `import { Play } from "lucide-react"` | Filled in Figma: `<Play fill="currentColor" stroke="none" />` |
| 38 | `Icon/Reply` | `import { Reply } from "lucide-react"` |  |
| 39 | `Icon/Workflow` | `import { Workflow } from "lucide-react"` |  |
| 40 | `Icon/Ban` | `import { Ban } from "lucide-react"` |  |
| 41 | `Icon/GripVertical` | `import { GripVertical } from "lucide-react"` |  |
| 42 | `Icon/Film` | `import { Film } from "lucide-react"` |  |
| 43 | `Icon/BDS/ArrowUp` | `import { ArrowUpIcon } from "@/components/ui/icons"` |  |
| 44 | `Icon/BDS/ArrowDown` | `import { ArrowDownIcon } from "@/components/ui/icons"` |  |
| 45 | `Icon/BDS/Help` | `import { HelpIcon } from "@/components/ui/icons"` | Info-style circle with filled dot |
| 46 | `Icon/BDS/ChevronLeft` | `import { ChevronLeftIcon } from "@/components/ui/icons"` |  |
| 47 | `Icon/BDS/ChevronRight` | `import { ChevronRightIcon } from "@/components/ui/icons"` |  |
| 48 | `Icon/BDS/ChevronDown` | `import { ChevronDownIcon } from "@/components/ui/icons"` |  |
| 49 | `Icon/BDS/Columns` | `import { ColumnsIcon } from "@/components/ui/icons"` |  |
| 50 | `Icon/BDS/Filter` | `import { FilterIcon } from "@/components/ui/icons"` |  |
| 51 | `Icon/BDS/Dots` | `import { DotsIcon } from "@/components/ui/icons"` | Vertical (row actions) |
| 52 | `Icon/BDS/Edit` | `import { EditIcon } from "@/components/ui/icons"` |  |
| 53 | `Icon/BDS/Trash` | `import { TrashIcon } from "@/components/ui/icons"` |  |
| 54 | `Icon/BDS/Search` | `import { SearchIcon } from "@/components/ui/icons"` |  |
| 55 | `Icon/BDS/Inbox` | `import { InboxIcon } from "@/components/ui/icons"` |  |
| 56 | `Icon/BDS/Download` | `import { DownloadIcon } from "@/components/ui/icons"` | stroke 1.875 |
| 57 | `Icon/BDS/Notification` | `import { NotificationIcon } from "@/components/ui/icons"` | stroke 1.884, bell with dot |
| 58 | `Icon/BDS/SearchTopbar` | `import { SearchTopbarIcon } from "@/components/ui/icons"` | Topbar, stroke 1.875 |
| 59 | `Icon/BDS/AskAI` | `import { AskAiIcon } from "@/components/ui/icons"` | Topbar, stroke 1.6 / 1.4 |
| 60 | `Icon/BDS/HelpTopbar` | `import { HelpTopbarIcon } from "@/components/ui/icons"` | Topbar, stroke 1.5 |
| 61 | `Icon/BDS/Copy` | `import { CopyIcon } from "@/components/ui/icons"` |  |
| 62 | `Icon/BDS/TableView` | `import { TableViewIcon } from "@/components/ui/icons"` | 16 × 16 grid, stroke 1.25 |
| 63 | `Icon/BDS/GridView` | `import { GridViewIcon } from "@/components/ui/icons"` | 16 × 16 grid, stroke 1.25 |

Also in Figma, outside "02 · Icons":

| Figma component (section) | Import | Notes |
|---|---|---|
| `Icon/BDS/SidebarChevronDown` (19 · Sidebar) | `import { SidebarChevronDownIcon } from "@/components/ui/icons"` | 16 × 16 grid, stroke 1.25, gray-100 |
| `Icon/BDS/SidebarChevronUp` (19 · Sidebar) | `import { SidebarChevronUpIcon } from "@/components/ui/icons"` | 16 × 16 grid, stroke 1.25, gray-100 |
| `Icon/BDS/SidebarCollapse` (19 · Sidebar) | `import { SidebarCollapseIcon } from "@/components/ui/icons"` | 16 × 16 grid, stroke 1.25, gray-100 |
| `Logo / REVE Chat` (18 · Topbar) | `import { RevechatLogo } from "@/components/ui/icons"` | 136 × 28, brand colours, `inverse` for dark surfaces |
| `Logo / REVE Chat mark` (18 · Topbar) | `import { RevechatMark } from "@/components/ui/icons"` | 20 × 11, brand colours, `inverse` for dark surfaces |

The Navbar menu icons (`Nav icon` set) are built into the Navbar. The Sidebar item icons (`Sidebar icon` set: conversation, campaign, template, copilot, datasource) aren't in this file yet.
