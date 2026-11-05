import { useRef, useState, type ChangeEvent } from "react";
import { FileText, Image as ImageIcon, Link2, Plus, X } from "lucide-react";
import { BDS } from "../../ds";

const { Popover, PopoverTrigger, PopoverContent, Button, Input } = BDS;

export interface Attachment {
  id: string;
  kind: "file" | "photo" | "link";
  name: string;
  /** Object URL of a photo, for the thumbnail. */
  preview?: string;
}

const uid = () => Math.random().toString(36).slice(2, 10);

/** The prompt box's + button: add files, photos or a website link. Nothing is uploaded in the prototype. */
export function AttachMenu({ disabled, onAdd }: { disabled?: boolean; onAdd: (items: Attachment[]) => void }) {
  const [open, setOpen] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setLinkMode(false);
    setUrl("");
  };

  const pick = (kind: "file" | "photo") => (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    onAdd(files.map((f) => ({ id: uid(), kind, name: f.name, preview: kind === "photo" ? URL.createObjectURL(f) : undefined })));
    e.target.value = "";
    close();
  };

  const addLink = () => {
    const value = url.trim();
    if (!value) return;
    onAdd([{ id: uid(), kind: "link", name: value.replace(/^https?:\/\//, "") }]);
    close();
  };

  const item = "text-paragraph-400-l text-foreground hover:bg-offwhite-40 flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left";

  return (
    <>
      <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.txt" className="hidden" onChange={pick("file")} />
      <input ref={photoRef} type="file" multiple accept="image/*" className="hidden" onChange={pick("photo")} />
      <Popover open={open} onOpenChange={(o: boolean) => (o ? setOpen(true) : close())}>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon-sm" aria-label="Add files, photos or a link" disabled={disabled}>
            <Plus />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-1">
          {linkMode ? (
            <form
              className="space-y-2 p-2"
              onSubmit={(e) => {
                e.preventDefault();
                addLink();
              }}
            >
              <p className="text-body-500-l text-foreground">Add a website link</p>
              <Input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourstore.com/faq" aria-label="Website link" />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setLinkMode(false)}>
                  Back
                </Button>
                <Button type="submit" size="sm" disabled={!url.trim()}>
                  Add link
                </Button>
              </div>
            </form>
          ) : (
            <>
              <button className={item} onClick={() => fileRef.current?.click()}>
                <FileText size={16} className="text-gray-100" />
                <span className="flex-1">
                  Upload a file
                  <span className="text-paragraph-400-m text-gray-100 block">PDF, Word, CSV or Excel</span>
                </span>
              </button>
              <button className={item} onClick={() => photoRef.current?.click()}>
                <ImageIcon size={16} className="text-gray-100" />
                <span className="flex-1">
                  Add photos
                  <span className="text-paragraph-400-m text-gray-100 block">Product images or screenshots</span>
                </span>
              </button>
              <button className={item} onClick={() => setLinkMode(true)}>
                <Link2 size={16} className="text-gray-100" />
                <span className="flex-1">
                  Add a website link
                  <span className="text-paragraph-400-m text-gray-100 block">Your store, FAQ or policy page</span>
                </span>
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}

const KIND_ICON = { file: FileText, photo: ImageIcon, link: Link2 };

/** Added files, photos and links, shown inside the prompt box. */
export function AttachmentChips({ items, onRemove }: { items: Attachment[]; onRemove: (id: string) => void }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {items.map((a) => {
        const Icon = KIND_ICON[a.kind];
        return (
          <span key={a.id} className="text-body-500-m text-gray-100 flex max-w-[220px] items-center gap-1.5 rounded-md border border-border bg-offwhite-40 py-1 pr-1 pl-1.5">
            {a.preview ? (
              <img src={a.preview} alt="" className="size-5 rounded-4 object-cover" />
            ) : (
              <Icon size={14} className="shrink-0 text-gray-100" />
            )}
            <span className="truncate">{a.name}</span>
            <button aria-label={`Remove ${a.name}`} onClick={() => onRemove(a.id)} className="hover:bg-offwhite-80 rounded-4 p-0.5 text-gray-100">
              <X size={12} />
            </button>
          </span>
        );
      })}
    </div>
  );
}
