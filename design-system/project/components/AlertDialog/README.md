# Alert Dialog

A modal that asks the user to confirm an action (built on the Radix Dialog; components are `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`) — used for confirmations and short forms; every destructive action is confirmed here first.

**Consumer provides:** `Dialog` (`open`/`onOpenChange` or `defaultOpen`), a `DialogTrigger asChild` button, and `DialogContent` holding `DialogHeader` (`DialogTitle`, `DialogDescription`) and `DialogFooter`. `showCloseButton` on `DialogContent` (default on) shows the top-right ghost X.

- Title 16/24 SemiBold (600), `black`; description 13/20 Regular, `gray-100`; 8px between them. Both are built in — don't add type classes.
- Footer: buttons hug their content, sit in one row aligned left, 8px apart. The main action comes **first** (primary or destructive, e.g. `destructive` "Delete"), then `secondary` "Cancel". Wrap Cancel in `DialogClose asChild`. For destructive dialogs, focus Cancel when the dialog opens (`onOpenAutoFocus` on `DialogContent`), so Enter never deletes by accident.
- Panel `bg-popover`, **12px** corner radius, **20px** padding, **420px** wide (full width minus 16px each side on small screens), **no border**, `shadow-md` (Elevation 3); overlay `black/10` with a light blur.
- Footer has no background and no divider line; buttons sit 24px below the description.
