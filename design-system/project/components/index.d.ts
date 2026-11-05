// REVE Chat Design System — window.BDS (React 18). Generated from references/components/ui/*.tsx.
// Every export below is available as window.BDS.<Name>.

// ---- accordion.tsx ----
/**
 * Accordion — Radix Accordion (Figma "Accordion").
 * Item: 1px border-bottom (none on the last). Trigger: py 16 · gap 16 · 14/22 Medium black ·
 * hover underline · focus 3px ring/50, radius 8 · chevron 16px muted-foreground, rotates when open.
 * Content: 14/22 Regular gray-100, 16px bottom padding, blocks 12px apart.
 */
declare function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>): import("react/jsx-runtime").JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

// ---- alert.tsx ----
/**
 * Alert — a floating success / failed card (Figma "Alert"): icon, title, optional description, close.
 * 336px (w-84) · padding 12 · gap 8 · radius 10 · shadow-md. Icon 32px. Title text-h6 (15/24 Medium) black,
 * description text-paragraph-400-l gray-100 4px below. Close 24px: top-aligned with a description, centred without.
 */
declare function Alert({ className, variant, icon, showClose, onClose, children, ...props }: React.ComponentProps<"div"> & {
    /** Figma "Success" (default) or "Failed": sets the icon and its colour, and role="status" / role="alert". */
    variant?: "success" | "failed";
    /** Replace the default icon; pass null for no icon. */
    icon?: React.ReactNode | null;
    /** Show the close (×) button. Default true. */
    showClose?: boolean;
    /** Called when × is clicked. Without it the Alert hides itself. */
    onClose?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
declare function AlertTitle({ className, ...props }: React.ComponentProps<"p">): import("react/jsx-runtime").JSX.Element;
declare function AlertDescription({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Alert, AlertTitle, AlertDescription };

// ---- avatar.tsx ----
type AvatarSize = "sm" | "md" | "default" | "lg";
/**
 * Avatar — user icon, image, or first letter (Figma "Avatar"); sm 24 · md 28 · default 32 · lg 40.
 * Fully round with a 0.75px inner border (black at 4%). The root does not clip, so an AvatarBadge's
 * 2px ring can sit outside the circle (Figma: status stroke is outside).
 * Shortcut: <Avatar src name /> renders AvatarImage + AvatarFallback (first letter, or the user icon).
 */
declare function Avatar({ className, size, src, name, alt, children, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & {
    /** sm 24px · md 28px · default 32px · lg 40px */
    size?: AvatarSize;
    /** Shortcut (used only when there are no children): photo URL. */
    src?: string;
    /** Shortcut (used only when there are no children): the person's name — the fallback shows its first letter. */
    name?: string;
    /** Shortcut: image alt text (defaults to `name`). */
    alt?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>): import("react/jsx-runtime").JSX.Element;
/**
 * Children = first letter (purple-10 fill, purple-100 Regular letter at half the avatar: 12 / 14 / 16 / 20px).
 * Empty = user icon (offwhite-60 fill, gray-80 Lucide User at half size, stroke 1.875).
 */
declare function AvatarFallback({ className, children, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>): import("react/jsx-runtime").JSX.Element;
/** Bottom-right dot with a 2px ring: 8px at sm, 10px at md / default, 12px at lg. No status = primary (put a small icon inside). */
declare function AvatarBadge({ className, status, ...props }: React.ComponentProps<"span"> & {
    status?: "online" | "away" | "busy" | "offline";
}): import("react/jsx-runtime").JSX.Element;
/** Avatars overlap by 8px, each with a 2px ring in the background colour. */
declare function AvatarGroup({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
/** Last item of a group: "+3" or an icon. Sizes itself to the group's avatars. */
declare function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };

// ---- badge.tsx ----
/**
 * Badge — a small sentence-case label for a record's state (Figma "Badge").
 * tone: green=approved · yellow=pending · red=rejected/failed · blue=sending · gray=draft · pitch=open
 * variant: solid (filled, white text) | light (tinted bg, coloured text)
 * shape: default (5px radius, 6px side padding) | pill (fully rounded, 8px side padding)
 * 20px high · text-body-500-s (10/16 Medium).
 */
declare const badgeVariants: (props?: ({
    tone?: "green" | "yellow" | "red" | "blue" | "gray" | "pitch" | null | undefined;
    variant?: "solid" | "light" | null | undefined;
    shape?: "default" | "pill" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type BadgeShape = "default" | "pill" | "rounded";
declare function Badge({ className, tone, variant, shape, ...props }: React.ComponentProps<"span"> & Omit<VariantProps<typeof badgeVariants>, "shape"> & {
    /** default = 5px radius; "pill" (alias "rounded") = fully rounded with 8px side padding. */
    shape?: BadgeShape | null;
}): import("react/jsx-runtime").JSX.Element;
export { Badge, badgeVariants };

// ---- button.tsx ----
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "success" | "note" | "secondary" | "ghost" | "destructive" | "outline" | null | undefined;
    size?: "default" | "icon" | "sm" | "lg" | "icon-sm" | "icon-lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const Button: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLButtonElement> & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<(props?: ({
    variant?: "link" | "default" | "success" | "note" | "secondary" | "ghost" | "destructive" | "outline" | null | undefined;
    size?: "default" | "icon" | "sm" | "lg" | "icon-sm" | "icon-lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & {
    asChild?: boolean;
}, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };

// ---- calendar.tsx ----
/**
 * Calendar — Figma "Calendar" / "Range calendar" on top of react-day-picker v9.
 *
 * Single (default): 314px panel, 16px padding, 12px radius, shadow-md. Header « ‹ Month Year › » (14/22 Medium);
 * click the month or the year to switch to the months view (3 × 4) or the years view (a decade + 2).
 * Two months (`numberOfMonths={2}`, e.g. `mode="range"`): 592px, months 20px either side of a 1px offwhite-100
 * divider, titles 13/20 Medium with ‹ on the first month and › on the last.
 * Days: weekdays 13/20 Medium black · days 13/20 gray-100 in 30px cells 8px apart, rows 6px apart, radius 6 ·
 * hover offwhite-60 · selected blue-90 · today blue-90 Medium · outside gray-60 · range band blue-20 / blue-100.
 * Pass the usual react-day-picker props (`mode`, `selected`, `onSelect`, `disabled`, …).
 * `captionLayout="dropdown"` keeps react-day-picker's month / year dropdowns instead of the Figma header.
 */
type CalendarView = "days" | "months" | "years";
type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    /** Which view opens first in a single-month calendar. Default "days". */
    defaultView?: CalendarView;
};
declare function Calendar(props: CalendarProps): import("react/jsx-runtime").JSX.Element;
/**
 * RangeCalendar — Figma "Range calendar": two months, only each month's own days, and an optional
 * footer (e.g. Apply / Cancel) under a 1px offwhite-100 line. 592px, 12px radius, shadow-md.
 */
declare function RangeCalendar({ className, footer, selected, onSelect, showOutsideDays, ...props }: Omit<PropsBase, "mode" | "required" | "footer" | "numberOfMonths"> & {
    selected?: DateRange;
    onSelect?: (range: DateRange | undefined) => void;
    /** Buttons under the months — Apply (primary) then Cancel (secondary), 8px apart. */
    footer?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Calendar, RangeCalendar };
export type { DateRange };

// ---- campaign-flow-card.tsx ----
type ChannelKind = "voice" | "whatsapp" | "sms" | "email" | (string & {});
declare const channelChipVariants: (props?: ({
    channel?: "other" | "voice" | "whatsapp" | "sms" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ChannelChip({ channel, label, children, className, ...props }: React.ComponentProps<"span"> & {
    channel: ChannelKind;
    label?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
type CampaignFlowTemplateCardProps = Omit<React.ComponentProps<"div">, "title"> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    channels?: (ChannelKind | {
        channel: ChannelKind;
        label?: React.ReactNode;
    })[];
    /** Primary button (default "Import" + download icon). Pass `icon: null` to drop the icon. */
    primaryAction?: {
        label?: React.ReactNode;
        icon?: React.ReactNode;
        onClick?: () => void;
    };
    /** Secondary button (default "View use case"). */
    secondaryAction?: {
        label?: React.ReactNode;
        onClick?: () => void;
    };
};
declare function CampaignFlowTemplateCard({ title, description, channels, primaryAction, secondaryAction, className, ...props }: CampaignFlowTemplateCardProps): import("react/jsx-runtime").JSX.Element;
export { CampaignFlowTemplateCard, ChannelChip, channelChipVariants, type CampaignFlowTemplateCardProps, type ChannelKind, };

// ---- card.tsx ----
declare function Card({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };

// ---- checkbox.tsx ----
declare function Checkbox({ className, label, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    /** Optional text shown 8px to the right; clicking it toggles the box. */
    label?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Checkbox };

// ---- choice-card.tsx ----
/**
 * ChoiceCardGroup — single-select group of Choice cards (radio semantics: role="radiogroup",
 * arrow keys move between cards). Lays cards out in one row, equal widths, 12px gap.
 */
declare function ChoiceCardGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
/**
 * ChoiceCard — Figma "Choice card" (State: default · selected; Value: false · true).
 * Title in body-500-l + optional second line (Figma "Value") in paragraph-400-m muted;
 * radio indicator on the right. Selected = 1px blue-90 border + blue-90 filled check.
 */
declare function ChoiceCard({ className, title, description, ...props }: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "title" | "children"> & {
    /** Card title (Figma "Title"). */
    title: React.ReactNode;
    /** Optional second line (Figma "Value"), e.g. the chosen schedule. */
    description?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { ChoiceCardGroup, ChoiceCard };

// ---- data-table.tsx ----
type DataTableRowId = string | number;
type DataTableSortDir = "asc" | "desc";
type DataTableSort = {
    key: string;
    dir: DataTableSortDir;
};
type DataTableColumn<Row = any> = {
    /** Unique column id; also the row field read when there is no `accessor`/`render`. */
    key: string;
    header: React.ReactNode;
    /** Row field name, or a function returning the cell content. */
    accessor?: string | ((row: Row) => React.ReactNode);
    /** Custom cell content (wins over `accessor`). */
    render?: (row: Row) => React.ReactNode;
    /** Value used for client-side sorting when the cell content isn't a plain string/number. */
    sortValue?: (row: Row) => string | number | Date | null | undefined;
    align?: "left" | "right" | "center";
    width?: number | string;
    sortable?: boolean;
    /** One line with an ellipsis (set `width` too); string content gets a `title` tooltip. */
    truncate?: boolean;
    /** 16px icon before the content (gray-80). */
    icon?: React.ReactNode | ((row: Row) => React.ReactNode);
    /** Hidden until turned on in the Columns menu (uncontrolled visibility only). */
    hidden?: boolean;
    /** Shows a 14px help icon in the header with this text as its tooltip and accessible name. */
    help?: string;
    /** Extra classes for this column's body cells. */
    className?: string;
};
type DataTableRowAction<Row = any> = {
    /** Accessible name + tooltip (icon buttons) or item text (menu). */
    label: string;
    icon?: React.ReactNode;
    destructive?: boolean;
    disabled?: boolean;
    /** Put this action in the row's "More actions" menu instead of showing an icon button. */
    menu?: boolean;
    onClick?: (row: Row) => void;
};
type DataTablePagination = {
    page: number;
    pageCount: number;
    /** Left-hand text, e.g. "Showing (1-50) of 500". Defaults to "Page 1 of 10". */
    info?: React.ReactNode;
    pageSize?: number;
    /** With `onPageSizeChange`, the page-size button opens a menu of these sizes. */
    pageSizeOptions?: number[];
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    /** Bundle API: called when the page-size button is clicked (no built-in menu). */
    onPageSizeClick?: () => void;
};
type DataTableProps<Row = any> = Omit<React.ComponentProps<"div">, "title" | "children"> & {
    columns: DataTableColumn<Row>[];
    rows: Row[];
    /** Field holding the row id (default `id`, falling back to the row index). */
    rowKey?: string;
    /** Row id getter (wins over `rowKey`). */
    rowId?: (row: Row, index: number) => DataTableRowId;
    /** Toolbar title + count badge. The toolbar shows when there is a title, a filter or the Columns menu. */
    title?: React.ReactNode;
    count?: number;
    filterable?: boolean;
    filterContent?: React.ReactNode;
    activeFilterCount?: number;
    /** Columns show/hide menu in the toolbar (default true). */
    columnToggle?: boolean;
    columnVisibility?: Record<string, boolean>;
    onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
    selectable?: boolean;
    selected?: DataTableRowId[];
    defaultSelected?: DataTableRowId[];
    onSelectedChange?: (selected: DataTableRowId[]) => void;
    sort?: DataTableSort | null;
    defaultSort?: DataTableSort | null;
    onSortChange?: (sort: DataTableSort | null) => void;
    /**
     * true = rows are rendered in the order given (you sort them, e.g. on the server).
     * Defaults to true when `onSortChange` is passed (bundle behaviour), otherwise the table sorts client-side.
     */
    manualSorting?: boolean;
    /** Row actions: icon buttons shown on row hover / selection, in one sticky trailing cell. */
    rowActions?: (row: Row) => DataTableRowAction<Row>[];
    onRowClick?: (row: Row) => void;
    rowDisabled?: (row: Row) => boolean;
    /** Pin the select cell + first data column on horizontal scroll (default true). */
    stickyFirstColumn?: boolean;
    loading?: boolean;
    loadingRows?: number;
    emptyTitle?: React.ReactNode;
    emptyText?: React.ReactNode;
    emptyIcon?: React.ReactNode;
    pagination?: DataTablePagination;
};
declare function DataTable<Row = any>({ columns, rows, rowKey, rowId, title, count, filterable, filterContent, activeFilterCount, columnToggle, columnVisibility, onColumnVisibilityChange, selectable, selected: selectedProp, defaultSelected, onSelectedChange, sort: sortProp, defaultSort, onSortChange, manualSorting, rowActions, onRowClick, rowDisabled, stickyFirstColumn, loading, loadingRows, emptyTitle, emptyText, emptyIcon, pagination, className, ...props }: DataTableProps<Row>): import("react/jsx-runtime").JSX.Element;
/** Primary text (13/20 Medium) over an optional description (12/18 gray-80). */
declare function DataTableText({ text, description, className, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    text: React.ReactNode;
    description?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** Small avatar (24px) + name, optional description; 10px gap. */
declare function DataTableAvatar({ name, src, description, className, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    name: string;
    src?: string;
    description?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare const dotColors: {
    readonly green: "bg-green-90";
    readonly blue: "bg-blue-80";
    readonly gray: "bg-gray-60";
    readonly red: "bg-red-80";
    readonly yellow: "bg-yellow-100";
};
/** 8px status dot + label, 8px gap. */
declare function DataTableDot({ color, label, className, ...props }: Omit<React.ComponentProps<"span">, "children"> & {
    color?: keyof typeof dotColors;
    label: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;
type DataTableChannel = string | {
    label: React.ReactNode;
    tone?: BadgeTone;
};
/** Channels as light Badges, 6px apart. */
declare function DataTableChannels({ channels, className, ...props }: Omit<React.ComponentProps<"span">, "children"> & {
    channels: DataTableChannel[];
}): import("react/jsx-runtime").JSX.Element;
export { DataTable, DataTableText, DataTableAvatar, DataTableDot, DataTableChannels, type DataTableProps, type DataTableColumn, type DataTableRowAction, type DataTablePagination, type DataTableSort, type DataTableSortDir, type DataTableRowId, type DataTableChannel, };

// ---- date-picker.tsx ----
/**
 * Field (Figma "Date field"), shared with TimePicker: like Input — 32px, px 12, radius 8, gray-20 border, white,
 * 13/20 · placeholder gray-60 · 16px gray-80 icon on the right · open / focus = 1px blue-90 border, no glow ·
 * disabled offwhite-40. Widths: date 240 · range 280 · time 160.
 */
declare const pickerFieldClass: string;
/** DatePicker — a field that opens a single-date Calendar; closes on pick, Esc or outside click. */
declare function DatePicker({ value, defaultValue, onChange, placeholder, disabled, className, }: {
    value?: Date;
    defaultValue?: Date;
    onChange?: (date?: Date) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/** DateRangePicker — a field that opens the two-month RangeCalendar; commits on Apply, Cancel reverts. */
declare function DateRangePicker({ value, defaultValue, onChange, placeholder, disabled, className, }: {
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range?: DateRange) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export { DatePicker, DateRangePicker, pickerFieldClass };

// ---- dialog.tsx ----
/** Alert Dialog — a modal that confirms an action (built on Radix Dialog). */
declare function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };

// ---- icons.tsx ----
/**
 * Icons — the custom SVG icons from Figma (Icon/BDS/*, Icon/Brand/*) and the REVE Chat logos.
 * Standard icons (Plus, X, ChevronDown, Trash2, …) are NOT here: import them from lucide-react.
 * See components/Icons.md for the full Figma → import table.
 *
 * - Path data is the exact Figma SVG export. Strokes and fills use currentColor, so an icon
 *   takes the text colour: `className="text-foreground"`, `"text-muted-foreground"`, …
 * - Brand marks (WhatsAppIcon, RevechatLogo, RevechatMark) keep their brand colours.
 * - 16px by default (logos: their Figma size). Resize with `className="size-5"` (20px) etc.;
 *   stroke widths are part of the drawing and scale with the icon.
 * - Decorative by default (aria-hidden). Pass `aria-label` to expose it as a labelled image.
 */
export type IconProps = React.ComponentPropsWithoutRef<"svg">;
export type IconComponent = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
export declare const ArrowUpIcon: IconComponent;
export declare const ArrowDownIcon: IconComponent;
export declare const HelpIcon: IconComponent;
export declare const ChevronLeftIcon: IconComponent;
export declare const ChevronRightIcon: IconComponent;
export declare const ChevronDownIcon: IconComponent;
export declare const ColumnsIcon: IconComponent;
export declare const FilterIcon: IconComponent;
export declare const DotsIcon: IconComponent;
export declare const EditIcon: IconComponent;
export declare const TrashIcon: IconComponent;
export declare const SearchIcon: IconComponent;
export declare const InboxIcon: IconComponent;
export declare const DownloadIcon: IconComponent;
export declare const NotificationIcon: IconComponent;
export declare const SearchTopbarIcon: IconComponent;
export declare const AskAiIcon: IconComponent;
export declare const HelpTopbarIcon: IconComponent;
export declare const CopyIcon: IconComponent;
export declare const TableViewIcon: IconComponent;
export declare const GridViewIcon: IconComponent;
export declare const SidebarChevronDownIcon: IconComponent;
export declare const SidebarChevronUpIcon: IconComponent;
export declare const SidebarCollapseIcon: IconComponent;
export declare const WhatsAppIcon: IconComponent;
/** Props for RevechatLogo and RevechatMark. */
export type LogoProps = IconProps & {
    /** Draw the black parts white, for dark surfaces (the Figma Navbar uses the mark this way). */
    inverse?: boolean;
};
/**
 * Full REVE Chat logo (mark + wordmark), 136 × 28. The Figma frame keeps its padding
 * (about 12px each side, 7px top and bottom), so scale it by height: className="h-7 w-auto".
 */
export declare const RevechatLogo: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    /** Draw the black parts white, for dark surfaces (the Figma Navbar uses the mark this way). */
    inverse?: boolean;
} & React.RefAttributes<SVGSVGElement>>;
/** REVE Chat mark only, 20 × 11. */
export declare const RevechatMark: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    /** Draw the black parts white, for dark surfaces (the Figma Navbar uses the mark this way). */
    inverse?: boolean;
} & React.RefAttributes<SVGSVGElement>>;
/** Figma component name (without the "Icon/" prefix) → component. */
export declare const bdsIcons: {
    "BDS/ArrowUp": IconComponent;
    "BDS/ArrowDown": IconComponent;
    "BDS/Help": IconComponent;
    "BDS/ChevronLeft": IconComponent;
    "BDS/ChevronRight": IconComponent;
    "BDS/ChevronDown": IconComponent;
    "BDS/Columns": IconComponent;
    "BDS/Filter": IconComponent;
    "BDS/Dots": IconComponent;
    "BDS/Edit": IconComponent;
    "BDS/Trash": IconComponent;
    "BDS/Search": IconComponent;
    "BDS/Inbox": IconComponent;
    "BDS/Download": IconComponent;
    "BDS/Notification": IconComponent;
    "BDS/SearchTopbar": IconComponent;
    "BDS/AskAI": IconComponent;
    "BDS/HelpTopbar": IconComponent;
    "BDS/Copy": IconComponent;
    "BDS/TableView": IconComponent;
    "BDS/GridView": IconComponent;
    "BDS/SidebarChevronDown": IconComponent;
    "BDS/SidebarChevronUp": IconComponent;
    "BDS/SidebarCollapse": IconComponent;
};
export type BdsIconName = keyof typeof bdsIcons;

// ---- input.tsx ----
declare const Input: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>>;
export { Input };

// ---- label.tsx ----
declare function Label({ className, required, ...props }: React.ComponentProps<typeof LabelPrimitive.Root> & {
    required?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Label };

// ---- navbar.tsx ----
/**
 * Navbar — the app's 48px vertical navigation bar (Figma "Navbar"): purple gradient (`bg-navbar`),
 * optional logo, icon-only items, footer items and the user's avatar at the bottom.
 * Provide `logo`, `items`, `footerItems`, `user`, and control selection with value/onChange.
 * Each item's `icon` is a 20px SVG; `selectedIcon` (optional) is the filled version shown when selected.
 */
export type NavbarItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    /** Filled icon shown while the item is selected (Figma "Nav icon", Selected=true). Falls back to `icon`. */
    selectedIcon?: React.ReactNode;
    onClick?: () => void;
};
declare function Navbar({ items, footerItems, value, defaultValue, onChange, logo, user, onUserClick, className, ...props }: React.ComponentProps<"nav"> & {
    items?: NavbarItem[];
    footerItems?: NavbarItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (id: string, item: NavbarItem) => void;
    /** Your logo mark, max 36 × 27px. Omit for no logo row. */
    logo?: React.ReactNode;
    /** Signed-in user (28px avatar + status dot); null hides it. */
    user?: {
        name?: string;
        avatarUrl?: string;
        status?: "online" | "away" | "offline" | null;
    } | null;
    onUserClick?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export { Navbar };

// ---- page-header.tsx ----
/**
 * PageHeader — 48px bar at the top of a workspace page: optional back button, title,
 * optional extra content and right-aligned actions.
 * `back` defaults to true when `onBack` is passed (Figma "Back" variant).
 */
declare function PageHeader({ className, title, back, onBack, backLabel, actions, children, ...props }: Omit<React.ComponentProps<"header">, "title"> & {
    title: React.ReactNode;
    back?: boolean;
    onBack?: () => void;
    backLabel?: string;
    actions?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { PageHeader };

// ---- phone-input.tsx ----
type PhoneCountry = {
    /** Unique key, usually the ISO 3166 alpha-2 code ("US"). */
    code: string;
    /** Dialling code shown in the trigger, e.g. "+1". */
    dialCode: string;
    /** Country name, shown in the menu and used for type-ahead. */
    name: string;
    /** 22×16 flag (e.g. an <img>). Falls back to the emoji flag of `code`. */
    flag?: React.ReactNode;
};
/**
 * PhoneInput — Figma "Phone input": a 72px country-code select (flag + dial code + chevron)
 * next to a phone-number Input that fills the rest of the row, 8px apart.
 * All other props go to the number <Input type="tel">.
 */
declare function PhoneInput({ className, countries, country, defaultCountry, onCountryChange, countryLabel, disabled, ...props }: Omit<React.ComponentProps<"input">, "type"> & {
    countries: PhoneCountry[];
    /** Selected country `code` (controlled). */
    country?: string;
    /** Initial country `code` (uncontrolled). Defaults to the first country. */
    defaultCountry?: string;
    onCountryChange?: (code: string) => void;
    /** Accessible name of the country-code select. */
    countryLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
export { PhoneInput, type PhoneCountry };

// ---- popover.tsx ----
declare function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { Popover, PopoverTrigger, PopoverContent };

// ---- radio-group.tsx ----
type RadioSize = "sm" | "md";
declare function RadioGroup({ className, size, orientation, ...props }: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "orientation"> & {
    /** Control size for every item: `sm` 16px circle / 6px dot, `md` 20px / 8px. */
    size?: RadioSize;
    /** Layout only. All four arrow keys move between options either way. */
    orientation?: "vertical" | "horizontal";
}): import("react/jsx-runtime").JSX.Element;
type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    /** Overrides the group's size (plain and labelled items; the box glyph is fixed at 16px). */
    size?: RadioSize;
    /** Text next to the control. Required for `box`. */
    label?: React.ReactNode;
    /** Second line under the label — `box` only. */
    description?: React.ReactNode;
    /** `true` shows a 14px info icon after the label; or pass your own node. Decorative only. */
    info?: boolean | React.ReactNode;
    /** Render as a selectable bordered card. */
    box?: boolean;
    /** Box only: control before or after the text. Default `start` with a description, `end` without. */
    controlPosition?: "start" | "end";
};
declare function RadioGroupItem({ className, size: sizeProp, label, description, info, box, controlPosition, ...props }: RadioGroupItemProps): import("react/jsx-runtime").JSX.Element;
export { RadioGroup, RadioGroupItem };

// ---- result-banner.tsx ----
type ResultBannerState = "info" | "loading" | "empty" | "error";
declare const resultBannerVariants: (props?: ({
    state?: "loading" | "info" | "empty" | "error" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * ResultBanner — full-width one-line result under an audience field
 * (e.g. "12,430 unique contacts found."). The label is `children`.
 */
declare function ResultBanner({ className, state, icon, children, ...props }: React.ComponentProps<"div"> & {
    state?: ResultBannerState;
    /** Replaces the state's icon; `null` hides it. */
    icon?: React.ReactNode | null;
}): import("react/jsx-runtime").JSX.Element;
export { ResultBanner, resultBannerVariants, type ResultBannerState };

// ---- select.tsx ----
declare function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): import("react/jsx-runtime").JSX.Element;
declare function SelectValue({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): import("react/jsx-runtime").JSX.Element;
/** Select trigger — Figma "Select" (State: placeholder · filled · open · invalid · disabled; Leading icon). */
declare function SelectTrigger({ className, icon, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    /** Optional leading icon before the value (Figma "Leading icon"). */
    icon?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** Select · Menu — popover bg, 1px border, radius 8, Shadow/md, 4px padding, 2px between options. */
declare function SelectContent({ className, children, position, sideOffset, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): import("react/jsx-runtime").JSX.Element;
/**
 * Select · Option — 8px padding, radius 6. Hover (keyboard highlight) and selected use the
 * muted bg; selected switches the title to body-500-l and shows a green-90 check.
 */
declare function SelectItem({ className, children, description, icon, ...props }: React.ComponentProps<typeof SelectPrimitive.Item> & {
    /** Second line in text-paragraph-400-m muted-foreground (Figma "Description"). */
    description?: React.ReactNode;
    /** Optional 18px leading icon (Figma "Icon"). */
    icon?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): import("react/jsx-runtime").JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): import("react/jsx-runtime").JSX.Element;
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, };

// ---- separator.tsx ----
/**
 * Separator — 1px border-colored rule (shadcn Separator).
 * Pass `label` for the labelled variant (Figma "OR divider"): two rules with centered text, 12px apart.
 */
declare function Separator({ className, orientation, decorative, label, ...props }: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
    /** Centered text, e.g. "OR". Horizontal only. */
    label?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Separator };

// ---- sidebar.tsx ----
type SidebarMenuItemProps = Omit<React.ComponentProps<"button">, "children" | "type" | "onToggle"> & {
    label: React.ReactNode;
    /** A named icon ("conversation", "campaign", "template", "copilot", "datasource", …) or any node (e.g. a lucide icon). */
    icon?: React.ReactNode;
    /** Selected row; on an expandable row it marks the parent of the active row. */
    active?: boolean;
    disabled?: boolean;
    /** Custom trailing pill content (wins over `badgeCount`). */
    badge?: React.ReactNode;
    badgeCount?: number | string;
    /** Alias of `badgeCount`. */
    count?: number | string;
    /** Leading 8px dot: `true` = gray-60, or a token name ("green-90") / CSS color. */
    dot?: boolean | string;
    /** Named icon or node at the trailing edge (replaces the chevron). */
    trailingIcon?: React.ReactNode;
    /** Expandable parent: shows a chevron; pair with `expanded` + `onToggle`. */
    expandable?: boolean;
    expanded?: boolean;
    onToggle?: (expanded: boolean) => void;
    /** Nested row (level 1); or set `level` (0 top-level, 1+ nested). */
    nested?: boolean;
    level?: number;
    /** `false` → a non-interactive label row. */
    clickable?: boolean;
};
/** THE row — one component for every case; every visual difference is a prop. */
declare function SidebarMenuItem({ className, style, label, icon, active, disabled, badge, badgeCount, count, dot, trailingIcon, expandable, expanded, onToggle, nested, level: levelProp, clickable, onClick, ...props }: SidebarMenuItemProps): import("react/jsx-runtime").JSX.Element;
/** Convenience: SidebarMenuItem pre-set to a nested row (level 1). */
declare function SidebarMenuChildItem(props: SidebarMenuItemProps): import("react/jsx-runtime").JSX.Element;
/** The collapsible container for an expandable row's children. */
declare function SidebarSubmenu({ className, expanded, ...props }: React.ComponentProps<"div"> & {
    expanded?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/** A small section heading. */
declare function SidebarSectionLabel({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
/** A group of rows with an optional heading. Dividers are explicit SidebarDividers. */
declare function SidebarSection({ className, label, children, ...props }: React.ComponentProps<"div"> & {
    label?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** 1px dashed offwhite-100 line; with the 4px row gap it leaves 8px above and 4px below. */
declare function SidebarDivider({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
/** The panel header: title + collapse button, or custom `children`. */
declare function SidebarHeader({ className, title, onCollapse, children, ...props }: Omit<React.ComponentProps<"div">, "title"> & {
    title?: React.ReactNode;
    onCollapse?: () => void;
}): import("react/jsx-runtime").JSX.Element;
/** Optional bottom area, pinned to the panel foot. */
declare function SidebarFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
/** @deprecated compat: an expandable parent that owns its open state. Prefer an expandable node in `items`. */
declare function SidebarGroup({ className, style, label, icon, dot, badge, badgeCount, count, active, disabled, open: openProp, defaultOpen, expanded, onToggle, children, "aria-label": ariaLabel, }: {
    label: React.ReactNode;
    icon?: React.ReactNode;
    dot?: boolean | string;
    badge?: React.ReactNode;
    badgeCount?: number | string;
    count?: number | string;
    active?: boolean;
    disabled?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    expanded?: boolean;
    onToggle?: (open: boolean) => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    "aria-label"?: string;
}): import("react/jsx-runtime").JSX.Element;
/** A node in the `items` config: a divider or a row. Children make the row expandable. */
type SidebarNode = {
    type?: "divider" | "item";
    /** Identity for selection. Without it a positional id is used ("sb-0", "sb-sb-2-1", …) — never the label. */
    id?: string;
    label?: React.ReactNode;
    /** A named icon or any React node. */
    icon?: React.ReactNode;
    /** Forces the active state (otherwise derived from `value`). */
    active?: boolean;
    disabled?: boolean;
    badge?: React.ReactNode;
    badgeCount?: number | string;
    /** Alias of `badgeCount`. */
    count?: number | string;
    dot?: boolean | string;
    trailingIcon?: React.ReactNode;
    expandable?: boolean;
    /** Initial expanded state of a parent. */
    expanded?: boolean;
    defaultOpen?: boolean;
    onClick?: () => void;
    children?: SidebarNode[];
};
/** @deprecated use SidebarNode. Kept for the legacy `groups` API. */
type SidebarItem = SidebarNode & {
    id: string;
};
declare function Sidebar({ className, title, items, groups, footer, value: valueProp, defaultValue, onChange, onCollapse, children, ...props }: Omit<React.ComponentProps<"aside">, "title" | "onChange" | "defaultValue"> & {
    title?: string;
    /** Preferred: a flat list of nodes; dividers are explicit `{ type: "divider" }` nodes. */
    items?: SidebarNode[];
    /** Legacy: groups of nodes, with a dashed line between groups. */
    groups?: SidebarNode[][];
    /** Content pinned to the bottom. */
    footer?: React.ReactNode;
    /** Selected node id (controlled) … */
    value?: string;
    /** … or the initially selected id (uncontrolled). */
    defaultValue?: string;
    onChange?: (id: string, item: SidebarNode) => void;
    /** Shows the collapse button in the header. */
    onCollapse?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export { Sidebar, SidebarHeader, SidebarFooter, SidebarSection, SidebarSectionLabel, SidebarDivider, SidebarSubmenu, SidebarMenuItem, SidebarMenuChildItem, SidebarGroup, type SidebarNode, type SidebarItem, type SidebarMenuItemProps, };

// ---- stepper.tsx ----
type StepperStepState = "current" | "upcoming" | "complete";
/** One step: indicator + label. `current` gets aria-current="step". */
declare function StepperStep({ className, state, children, ...props }: React.ComponentProps<"div"> & {
    state?: StepperStepState;
}): import("react/jsx-runtime").JSX.Element;
type StepperItem = React.ReactNode | {
    label: React.ReactNode;
    state?: StepperStepState;
};
/**
 * Stepper — horizontal progress for multi-step flows.
 * Steps before `current` are complete, `current` is current, the rest are upcoming.
 * A step object may set `state` to override the derived state.
 */
declare function Stepper({ className, steps, current, "aria-label": ariaLabel, ...props }: Omit<React.ComponentProps<"nav">, "children"> & {
    steps: StepperItem[];
    current?: number;
}): import("react/jsx-runtime").JSX.Element;
export { Stepper, StepperStep, type StepperStepState, type StepperItem };

// ---- switch.tsx ----
declare const switchVariants: (props?: ({
    variant?: "default" | "in-button" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Switch({ className, variant, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>): import("react/jsx-runtime").JSX.Element;
declare function SwitchIndicator({ className, checked, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof switchVariants> & {
    checked?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Switch, SwitchIndicator, switchVariants };

// ---- table.tsx ----
declare function Table({ className, ...props }: React.ComponentProps<"table">): import("react/jsx-runtime").JSX.Element;
declare function TableHeader({ className, ...props }: React.ComponentProps<"thead">): import("react/jsx-runtime").JSX.Element;
declare function TableBody({ className, ...props }: React.ComponentProps<"tbody">): import("react/jsx-runtime").JSX.Element;
declare function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">): import("react/jsx-runtime").JSX.Element;
declare function TableRow({ className, ...props }: React.ComponentProps<"tr">): import("react/jsx-runtime").JSX.Element;
declare function TableHead({ className, ...props }: React.ComponentProps<"th">): import("react/jsx-runtime").JSX.Element;
declare function TableCell({ className, ...props }: React.ComponentProps<"td">): import("react/jsx-runtime").JSX.Element;
declare function TableCaption({ className, ...props }: React.ComponentProps<"caption">): import("react/jsx-runtime").JSX.Element;
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

// ---- tabs.tsx ----
declare function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>): import("react/jsx-runtime").JSX.Element;
declare function TabsTrigger({ className, children, count, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
    /** Optional count pill after the label. */
    count?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent };

// ---- textarea.tsx ----
/** Textarea — multiline Input. Figma "Textarea" (State: default · filled · focus · invalid · disabled). */
declare function Textarea({ className, ...props }: React.ComponentProps<"textarea">): import("react/jsx-runtime").JSX.Element;
/**
 * RichTextarea — Figma "Textarea · rich": a Textarea with a bottom toolbar —
 * `{}` variable-insert button on the left, character counter on the right.
 * Visual only: it is a plain <textarea>, no editor library.
 */
declare function RichTextarea({ className, value, defaultValue, onChange, maxLength, disabled, onInsertVariable, insertVariableLabel, toolbar, ...props }: React.ComponentProps<"textarea"> & {
    /** Shows the `{}` button; called with the textarea element so you can insert at the caret. */
    onInsertVariable?: (textarea: HTMLTextAreaElement) => void;
    /** Accessible name of the `{}` button. */
    insertVariableLabel?: string;
    /** Extra controls placed after the `{}` button in the toolbar. */
    toolbar?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Textarea, RichTextarea };

// ---- time-picker.tsx ----
declare function TimePanel({ value, onChange, minuteStep, className, }: {
    value?: string;
    onChange?: (value: string) => void;
    minuteStep?: number;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/** TimePicker — a field (160px) that opens the TimePanel; shows "10:30 AM". */
declare function TimePicker({ value, defaultValue, onChange, minuteStep, placeholder, disabled, className, }: {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    minuteStep?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export { TimePanel, TimePicker };

// ---- topbar.tsx ----
/** The REVE Chat logo (Figma "Logo / REVE Chat"), 24px tall. */
declare function TopbarLogo({ className, ...props }: LogoProps): import("react/jsx-runtime").JSX.Element;
/** Search pill: a button that opens the app's search (command palette). 250 × 28. */
declare function TopbarSearch({ className, placeholder, shortcut, ...props }: React.ComponentProps<"button"> & {
    placeholder?: string;
    /** Keyboard hint on the right ("⌘ +K"). Empty string hides it. */
    shortcut?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** 32px icon button. `boxed` adds the 1px border (help); `dot` shows the red notification dot. */
declare function TopbarIconButton({ className, boxed, dot, children, ...props }: React.ComponentProps<"button"> & {
    boxed?: boolean;
    dot?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/** "Ask AI": 28px, 1px gradient border (120°, offwhite-100 at 55% → purple), white inside. */
declare function TopbarAskAI({ className, children, ...props }: React.ComponentProps<"button">): import("react/jsx-runtime").JSX.Element;
type TopbarUserInfo = {
    name?: string;
    avatarUrl?: string;
    status?: "online" | "away" | "busy" | "offline" | null;
};
/** The signed-in user: 28px avatar in a 32px button, 8px status dot with a 2px white ring. */
declare function TopbarUser({ className, user, ...props }: React.ComponentProps<"button"> & {
    user?: TopbarUserInfo;
}): import("react/jsx-runtime").JSX.Element;
declare function Topbar({ className, children, logo, showSearch, searchPlaceholder, searchShortcut, onSearchClick, showNotifications, hasNotifications, onNotificationsClick, showAskAI, onAskAIClick, showHelp, onHelpClick, user, onUserClick, ...props }: React.ComponentProps<"header"> & {
    /** Left slot. Defaults to the REVE Chat logo; `null` hides it. */
    logo?: React.ReactNode;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchShortcut?: React.ReactNode;
    onSearchClick?: () => void;
    showNotifications?: boolean;
    /** Shows the red dot on the bell. */
    hasNotifications?: boolean;
    onNotificationsClick?: () => void;
    showAskAI?: boolean;
    onAskAIClick?: () => void;
    showHelp?: boolean;
    onHelpClick?: () => void;
    /** Signed-in user. Omit for a generic avatar; `null` hides the avatar. */
    user?: TopbarUserInfo | null;
    onUserClick?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export { Topbar, TopbarLogo, TopbarSearch, TopbarIconButton, TopbarAskAI, TopbarUser, type TopbarUserInfo, };

// ---- upload-dropzone.tsx ----
type UploadDropzoneState = "empty" | "dragging" | "uploading" | "error";
type UploadDropzoneMessage = {
    title?: React.ReactNode;
    description?: React.ReactNode;
};
declare const uploadDropzoneVariants: (props?: ({
    state?: "empty" | "error" | "dragging" | "uploading" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** True when `file` matches an `accept` string (".csv", "text/csv", "image/*"). */
declare function fileMatchesAccept(file: File, accept?: string): boolean;
/**
 * UploadDropzone — click (or Enter/Space) opens the file picker; files can also be dropped.
 * `state` is set by the parent (empty / uploading / error); "dragging" is shown automatically
 * while files are over the zone. Dropped files are filtered by `accept`.
 */
declare function UploadDropzone({ className, state, accept, multiple, disabled, fileName, messages, onFilesSelected, onFilesRejected, onClick, onKeyDown, onDragEnter, onDragOver, onDragLeave, onDrop, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    state?: UploadDropzoneState;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    /** Shown under "Uploading…". */
    fileName?: React.ReactNode;
    /** Overrides the title / description of any state. */
    messages?: Partial<Record<UploadDropzoneState, UploadDropzoneMessage>>;
    onFilesSelected?: (files: File[]) => void;
    /** Dropped files that don't match `accept`. */
    onFilesRejected?: (files: File[]) => void;
}): import("react/jsx-runtime").JSX.Element;
export { UploadDropzone, uploadDropzoneVariants, fileMatchesAccept, type UploadDropzoneState };

// ---- uploaded-file-card.tsx ----
type UploadedFileCardState = "processing" | "success" | "error";
/** Formats a byte count the way the card shows it: 2726297 → "2.6 MB". */
declare function formatFileSize(bytes: number): string;
/**
 * UploadedFileCard — shown after a file is uploaded: file-type badge, name, size · result,
 * a status icon and a remove (trash) button.
 */
declare function UploadedFileCard({ className, state, fileName, fileSize, fileType, result, onRemove, removeLabel, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    state?: UploadedFileCardState;
    fileName: string;
    /** Bytes (formatted for you) or a ready string such as "2.6 MB". */
    fileSize?: number | string;
    /** Badge text; defaults to the file extension ("XLS", "CSV"). */
    fileType?: string;
    /** Text after the size, e.g. "748 contacts found". Defaults to "Processing…" while processing. */
    result?: React.ReactNode;
    /** Shows the trash button. */
    onRemove?: () => void;
    removeLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
export { UploadedFileCard, formatFileSize, type UploadedFileCardState };

// ---- view-toggle.tsx ----
/**
 * ViewToggle — Figma "View toggle" (Value: table · grid). Table / grid switch for index pages.
 * 28px muted container, radius 8, 2px padding and gap; 24px items, radius 6.
 * Active item = white bg + foreground icon; inactive = gray-80 icon (foreground on hover).
 * Single-select with radio semantics; renders the table + grid items unless you pass children.
 */
declare function ViewToggle({ className, children, tableLabel, gridLabel, "aria-label": ariaLabel, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
    /** Accessible name of the table item. */
    tableLabel?: string;
    /** Accessible name of the grid item. */
    gridLabel?: string;
}): import("react/jsx-runtime").JSX.Element;
/** One icon item of a ViewToggle. Always give it an `aria-label`. */
declare function ViewToggleItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>): import("react/jsx-runtime").JSX.Element;
export { ViewToggle, ViewToggleItem };
