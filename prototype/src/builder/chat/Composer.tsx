import { useRef, useState } from "react";
import { ArrowUp, Mic, Paperclip, Smile, Square } from "lucide-react";
import { BDS } from "../../ds";

const { RevechatMark } = BDS;

const round = "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors";

/**
 * Chat message box (Figma "Test Flow"): attach · message pill with emoji · mic.
 * Enter sends; the mic turns into Send once there is text, and into Stop while the assistant is replying.
 */
export function Composer({ placeholder, busy, onSend, onStop }: { placeholder: string; busy: boolean; onSend: (t: string) => void; onStop?: () => void }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const grow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const send = () => {
    if (!text.trim() || busy) return;
    onSend(text.trim());
    setText("");
    requestAnimationFrame(grow);
  };

  return (
    <div className="border-t border-border bg-white px-3 pt-3 pb-2">
      <div className="flex items-end gap-2">
        <button aria-label="Attach a file" className={`${round} bg-offwhite-60 text-gray-100 hover:bg-offwhite-80`}>
          <Paperclip size={16} />
        </button>
        <div className="focus-within:ring-blue-40 flex min-h-9 flex-1 items-end gap-1 rounded-20 bg-offwhite-60 py-1 pr-1.5 pl-3.5 focus-within:ring-2">
          <textarea
            ref={ref}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              grow();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="text-paragraph-400-l text-foreground placeholder:text-gray-100 block flex-1 resize-none self-center bg-transparent py-0.5 outline-none"
          />
          <button aria-label="Add emoji" className="text-gray-100 hover:text-foreground flex size-7 shrink-0 items-center justify-center">
            <Smile size={18} />
          </button>
        </div>
        {busy && onStop ? (
          <button aria-label="Stop" onClick={onStop} className={`${round} bg-black text-white hover:bg-gray-100`}>
            <Square size={13} className="fill-current" />
          </button>
        ) : text.trim() ? (
          <button aria-label="Send" onClick={send} disabled={busy} className={`${round} bg-blue-90 text-white hover:bg-blue-100 disabled:bg-blue-40`}>
            <ArrowUp size={16} />
          </button>
        ) : (
          <button aria-label="Speak your message" className={`${round} bg-offwhite-60 text-gray-100 hover:bg-offwhite-80`}>
            <Mic size={16} />
          </button>
        )}
      </div>
      <p className="text-paragraph-400-s text-gray-100 mt-2 flex items-center justify-center gap-1">
        Powered by <span className="text-body-500-s text-gray-100">REVE Chat</span>
        <RevechatMark width={16} height={12} />
      </p>
    </div>
  );
}
