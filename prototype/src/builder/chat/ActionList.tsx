import { CircleCheck, Loader2 } from "lucide-react";
import type { ActionItem } from "../types";

/** What the assistant changed, one line per change — like Claude's tool-use steps. Click a line to find it on the canvas. */
export function ActionList({ items, onFocus }: { items: ActionItem[]; onFocus: (node: string) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-offwhite-80 bg-white">
      {items.map((it, i) => (
        <button
          key={i}
          onClick={() => it.done && onFocus(it.node)}
          className="hover:bg-offwhite-40 flex w-full items-center gap-2.5 border-b border-offwhite-80 px-3 py-2 text-left last:border-b-0"
        >
          {it.done ? (
            <CircleCheck size={16} className="shrink-0 text-green-90" />
          ) : (
            <Loader2 size={16} className="shrink-0 animate-spin text-gray-100" />
          )}
          <span className={`text-body-500-l shrink-0 ${it.done ? "text-foreground" : "text-gray-100"}`}>{it.label}</span>
          {it.detail && <span className="text-paragraph-400-l text-gray-100 truncate">{it.detail}</span>}
        </button>
      ))}
    </div>
  );
}
