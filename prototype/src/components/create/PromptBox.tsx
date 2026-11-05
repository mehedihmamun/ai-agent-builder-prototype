import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mic, SendHorizontal, Square } from "lucide-react";
import { BDS } from "../../ds";
import { useAppStore } from "../../store/AppStore";
import { AttachMenu, AttachmentChips, type Attachment } from "./AttachMenu";
import { useSpeechToText } from "./useSpeechToText";

const { Button, Textarea } = BDS;

const PLACEHOLDER = /\[[^\]]*\]/g;

/** Select the first [placeholder] at or after `from` so the user can type over it. */
function selectPlaceholder(el: HTMLTextAreaElement, from = 0) {
  const matches = [...el.value.matchAll(PLACEHOLDER)];
  const next = matches.find((m) => m.index! >= from) ?? matches[0];
  if (!next) return false;
  el.focus();
  el.setSelectionRange(next.index!, next.index! + next[0].length);
  return true;
}

export interface PromptBoxApi {
  /** Put an example in the box and select its first [placeholder]. */
  applyExample: (text: string) => void;
  creating: boolean;
}

/**
 * The "describe your agent" box: attachments, voice, send. Sending creates a draft agent
 * and opens the Builder, where the assistant asks the setup questions.
 * `children` renders below the box (examples, or "Creating your agent…").
 */
export function PromptBox({
  autoFocus = false,
  hero = false,
  children,
}: {
  autoFocus?: boolean;
  /** Bigger, raised box for when it is the main thing on the page. */
  hero?: boolean;
  children?: (api: PromptBoxApi) => ReactNode;
}) {
  const navigate = useNavigate();
  const { addAgent } = useAppStore();
  // The DS Textarea does not forward refs, so reach the <textarea> through its wrapper.
  const boxRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("");
  const [pendingSelect, setPendingSelect] = useState(false);
  const [creating, setCreating] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const speech = useSpeechToText(setPrompt);

  // Voice errors fade out after a few seconds.
  useEffect(() => {
    if (!speech.error) return;
    const t = window.setTimeout(speech.clearError, 4500);
    return () => clearTimeout(t);
  }, [speech.error]);

  useEffect(() => {
    const el = boxRef.current?.querySelector("textarea");
    if (!el) return;
    if (pendingSelect) {
      selectPlaceholder(el);
      setPendingSelect(false);
    } else if (autoFocus && !creating) {
      el.focus();
    }
  }, [pendingSelect, creating, autoFocus]);

  const applyExample = (text: string) => {
    setPrompt(text);
    setPendingSelect(true);
  };

  const send = () => {
    const text = prompt.trim();
    if (!text || creating) return;
    speech.stop();
    setCreating(true);
    const id = `agent-${Date.now()}`;
    const now = new Date().toISOString();
    // Short pause so "Creating your agent…" is visible before the builder opens.
    setTimeout(() => {
      addAgent({
        id,
        name: "Untitled AI Agent",
        description: text,
        prompt: text,
        direction: "Inbound",
        channels: [],
        createdBy: "Mehedi Hasan Mamun",
        createdAt: now,
        updatedAt: now,
        active: false,
      });
      navigate(`/agents/${id}/builder`);
    }, 1200);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Tab jumps to the next [placeholder], if there is one.
      if (selectPlaceholder(e.currentTarget, e.currentTarget.selectionEnd)) e.preventDefault();
    }
  };

  return (
    <>
      <div
        ref={boxRef}
        className={`focus-within:border-blue-90 border border-offwhite-80 bg-white transition-all ${
          hero ? "focus-within:ring-blue-30 rounded-xl shadow-md focus-within:ring-4" : "rounded-md"
        }`}
      >
        <Textarea
          value={prompt}
          disabled={creating}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Describe your agent"
          placeholder="Example, answer customer questions using our help docs & hand off complex issues to team."
          className={`${hero ? "text-paragraph-400-xl min-h-[104px] px-4 pt-4" : "min-h-[88px]"} resize-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:bg-transparent`}
        />
        <AttachmentChips items={attachments} onRemove={(id) => setAttachments((a) => a.filter((x) => x.id !== id))} />
        <div className="flex items-center justify-between px-3 pb-3">
          <AttachMenu disabled={creating} onAdd={(items) => setAttachments((a) => [...a, ...items])} />
          <div className="flex items-center gap-1">
            {speech.listening && (
              <span className="text-body-500-m text-red-90 mr-1 flex items-center gap-1.5" role="status">
                <span className="size-2 animate-pulse rounded-full bg-red-90" />
                Listening… speak now
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={speech.listening ? "Stop listening" : "Speak your prompt"}
              aria-pressed={speech.listening}
              disabled={creating}
              onClick={() => speech.toggle(prompt)}
              className={speech.listening ? "bg-red-10 text-red-90 ring-2 ring-red-40 hover:bg-red-10" : ""}
            >
              {speech.listening ? <Square className="fill-current" /> : <Mic />}
            </Button>
            <Button size="icon-sm" aria-label="Create agent" disabled={!prompt.trim() || creating} onClick={send}>
              {creating ? <Loader2 className="animate-spin" /> : <SendHorizontal />}
            </Button>
          </div>
        </div>
      </div>
      {speech.error && (
        <p className="text-paragraph-400-m text-red-90 mt-2" role="alert">
          {speech.error}
        </p>
      )}
      {children?.({ applyExample, creating })}
    </>
  );
}

export function CreatingAgent() {
  return (
    <div className="text-body-500-l text-gray-100 flex items-center justify-center gap-2 py-10" role="status">
      <Loader2 className="size-4 animate-spin" />
      Creating your agent…
    </div>
  );
}
