import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BrainCircuit,
  CircleCheck,
  Clock,
  Brush,
  History,
  CalendarDays,
  Plug,
  Copy,
  FileSpreadsheet,
  FolderOpen,
  Globe,
  Headset,
  Maximize2,
  MessageSquare,
  Minimize2,
  Sparkles,
  ShoppingBag,
  X,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { BDS } from "../ds";
import { AgentSparkIcon } from "../components/AgentSparkIcon";
import { canvasTools, type Answer, type Answers, type QuestionId, type Round } from "./script";
import type { Block, ChatMessage } from "./types";
import type { Busy, Stream } from "./useBuilder";
import { ActionList } from "./chat/ActionList";
import { Composer } from "./chat/Composer";
import { Markdown, StreamText } from "./chat/Markdown";
import { QuestionCard } from "./chat/QuestionCard";
import { SummaryCard } from "./chat/SummaryCard";
import { SparkleBadge } from "./chat/SparkleBadge";
import { Thinking } from "./chat/Thinking";

const { Button } = BDS;

const KIND_ICON: Record<string, ReactNode> = {
  trigger: <MessageSquare size={14} className="text-green-90" />,
  agent: <AgentSparkIcon size={14} />,
  model: <BrainCircuit size={14} className="text-black" />,
  sheet: <FileSpreadsheet size={14} className="text-green-90" />,
  shop: <ShoppingBag size={14} className="text-green-100" />,
  drive: <FolderOpen size={14} className="text-yellow-100" />,
  web: <Globe size={14} className="text-blue-90" />,
  calendar: <CalendarDays size={14} className="text-blue-90" />,
  api: <Plug size={14} className="text-purple-100" />,
  clock: <Clock size={14} className="text-navy-100" />,
  handoff: <Headset size={14} className="text-blue-90" />,
};

/** "9:45 pm" */
const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();

/** The user's message: dark bubble on the right, time above. */
function UserBubble({ at, children }: { at: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-paragraph-400-s text-gray-100">{clock(at)}</span>
      <div className="text-paragraph-400-l max-w-[85%] rounded-lg bg-black px-3 py-2 text-white">{children}</div>
    </div>
  );
}

/** "Name · 9:45 PM" above a reply. */
function ReplyLabel({ name, at }: { name: string; at: string }) {
  return (
    <span className="text-paragraph-400-s text-gray-100">
      {name} · {clock(at).toUpperCase()}
    </span>
  );
}

/** A reply's text: white bubble on the left. */
function ReplyBubble({ children }: { children: ReactNode }) {
  return <div className="text-paragraph-400-l text-foreground max-w-[90%] rounded-lg border border-offwhite-80 bg-white px-3 py-2 shadow-xs">{children}</div>;
}

/** Copy and 👍 👎 under a reply, shown on hover. */
function ReplyActions({ text }: { text: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);
  const icon = "text-gray-100 hover:bg-offwhite-60 hover:text-foreground flex size-7 items-center justify-center rounded-md";
  return (
    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
      <button
        aria-label="Copy"
        className={icon}
        onClick={() => {
          navigator.clipboard?.writeText(text.replace(/\*\*/g, "")).catch(() => {});
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        <Copy size={14} />
      </button>
      <button aria-label="Good reply" className={`${icon} ${vote === "up" ? "text-blue-90" : ""}`} onClick={() => setVote(vote === "up" ? null : "up")}>
        <ThumbsUp size={14} />
      </button>
      <button aria-label="Bad reply" className={`${icon} ${vote === "down" ? "text-blue-90" : ""}`} onClick={() => setVote(vote === "down" ? null : "down")}>
        <ThumbsDown size={14} />
      </button>
      {copied && <span className="text-paragraph-400-s text-gray-100 ml-1">Copied</span>}
    </div>
  );
}

interface ReplyContext {
  agentName: string;
  answers: Answers;
  onFocusNode: (node: string) => void;
  onTestNow: () => void;
  onReview: () => void;
  onChip: (text: string) => void;
  onCustomize: () => void;
  /** Setup rounds are running, so the template CTA is done. */
  customizing: boolean;
}

function AssistantReply({ blocks, at, shown, writing, isLast, ctx }: { blocks: Block[]; at: string; shown: number; writing: boolean; isLast: boolean; ctx: ReplyContext }) {
  const visible = blocks.slice(0, shown);
  const plain = blocks.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n\n");
  return (
    <div className="group flex flex-col items-start gap-1">
      <ReplyLabel name="Agent Builder Assistance" at={at} />
      <div className="text-paragraph-400-l text-foreground w-full min-w-0 space-y-2.5">
        {visible.map((b, i) => {
          const animate = writing && i === shown - 1;
          if (b.type === "text")
            return (
              <ReplyBubble key={i}>
                <StreamText text={b.text} animate={animate} />
              </ReplyBubble>
            );
          if (b.type === "actions") return <ActionList key={i} items={b.items} onFocus={ctx.onFocusNode} />;
          if (b.type === "summary")
            return <SummaryCard key={i} agentName={ctx.agentName} answers={ctx.answers} onTestNow={ctx.onTestNow} onReview={ctx.onReview} />;
          if (b.type === "cta")
            return (
              <div key={i} className="flex flex-col items-start gap-2.5 rounded-xl border border-blue-40 bg-blue-20 px-3.5 py-3">
                <span>
                  <span className="text-body-600-xl text-foreground block">Make this template yours</span>
                  <span className="text-paragraph-400-m text-gray-100 block">{b.text}</span>
                </span>
                <Button size="sm" onClick={ctx.onCustomize} disabled={ctx.customizing}>
                  <Sparkles data-icon="inline-start" />
                  {b.label}
                </Button>
              </div>
            );
          return isLast && !writing ? (
            <div key={i} className="flex flex-wrap gap-2">
              {b.items.map((c) => (
                <button
                  key={c}
                  onClick={() => ctx.onChip(c)}
                  className="text-paragraph-400-l text-gray-100 hover:border-blue-60 hover:bg-blue-20 rounded-full border border-border bg-white px-3 py-1"
                >
                  {c}
                </button>
              ))}
            </div>
          ) : null;
        })}
        {!writing && <ReplyActions text={plain} />}
      </div>
    </div>
  );
}

function TestMessage({ m, toolIcon, agentName, showLog }: { m: ChatMessage; toolIcon: (node: string) => ReactNode; agentName: string; showLog: boolean }) {
  if (m.role === "user") return <UserBubble at={m.at}>{m.text}</UserBubble>;
  if (m.role === "trace") {
    if (!showLog) return null;
    // Execution log: plain lines, tools indented under the agent.
    return (
      <ul className="space-y-1.5">
        {m.steps.map((s, i) => (
          <li key={i} className="text-paragraph-400-m text-gray-100 flex items-center gap-2" style={{ paddingLeft: i > 1 ? 18 : 0 }}>
            <span className="flex size-5 items-center justify-center rounded-4 text-purple-100">{toolIcon(s.node)}</span>
            <span>
              <span className="text-body-500-m text-foreground">{s.label}</span> executed, took {s.seconds.toFixed(2)}s
            </span>
          </li>
        ))}
        {m.steps.length === 0 && <li className="text-paragraph-400-m text-gray-100">Starting…</li>}
      </ul>
    );
  }
  if (m.role === "agent") {
    return (
      <div className="flex flex-col items-start gap-1">
        <ReplyLabel name={agentName} at={m.at} />
        <ReplyBubble>
          <Markdown text={m.text} />
        </ReplyBubble>
      </div>
    );
  }
  return null;
}

export interface AssistantPanelProps {
  mode: "build" | "test";
  agentName: string;
  answers: Answers;
  messages: ChatMessage[];
  busy: Busy;
  stream: Stream | null;
  round: Round | null;
  roundNumber: number;
  roundTotal: number;
  suggestions: string[];
  expanded: boolean;
  onToggleExpand: () => void;
  onSubmitRound: (a: Answers) => void;
  skipDefault: (id: QuestionId) => Answer;
  onSend: (text: string) => void;
  onStop: () => void;
  onFocusNode: (node: string) => void;
  onTestNow: () => void;
  onReview: () => void;
  onClose: () => void;
  onClearTest: () => void;
  onCustomize: () => void;
  customizing: boolean;
  /** Shown in Test Flow after the agent has answered and there are unsaved changes. */
  onSave?: () => void;
}

/** Right panel: the Builder Assistant chat (Claude-style), or the Test now chat. */
export function AssistantPanel(p: AssistantPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const testing = p.mode === "test";
  const [showLog, setShowLog] = useState(true);
  const ctx: ReplyContext = {
    agentName: p.agentName,
    answers: p.answers,
    onFocusNode: p.onFocusNode,
    onTestNow: p.onTestNow,
    onReview: p.onReview,
    onChip: p.onSend,
    onCustomize: p.onCustomize,
    customizing: p.customizing,
  };
  const tools = canvasTools(p.answers);
  const toolIcon = (node: string) => KIND_ICON[tools.find((t) => t.id === node)?.kind ?? node];

  // Keep the newest content in view, also while a reply is being written.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const follow = () => el.scrollTo({ top: el.scrollHeight });
    follow();
    if (!p.busy) return;
    const t = window.setInterval(follow, 120);
    return () => clearInterval(t);
  }, [p.messages, p.busy, p.round, p.mode, showLog]);

  const lastAssistant = [...p.messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex h-full flex-col bg-offwhite-40">
      <div className="flex h-12 shrink-0 items-center gap-1 border-b border-border bg-white pr-2 pl-4">
        {testing ? (
          <>
            <span className="text-h6-600 text-foreground flex-1 truncate">Test Flow</span>
            <Button variant="ghost" size="sm" onClick={p.onClearTest} disabled={p.messages.length === 0}>
              <Brush data-icon="inline-start" />
              Clear chat
            </Button>
            <Button variant="ghost" size="sm" aria-pressed={showLog} onClick={() => setShowLog((v) => !v)} className={showLog ? "" : "text-gray-100"}>
              <History data-icon="inline-start" />
              {showLog ? "Hide log" : "Show log"}
            </Button>
          </>
        ) : (
          <>
            <SparkleBadge size={24} />
            <span className="text-h6-600 text-foreground ml-1.5 flex-1 truncate">Agent Builder Assistance</span>
          </>
        )}
        <Button variant="ghost" size="icon-sm" aria-label={p.expanded ? "Collapse panel" : "Expand panel"} onClick={p.onToggleExpand}>
          {p.expanded ? <Minimize2 /> : <Maximize2 />}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Close panel" onClick={p.onClose}>
          <X />
        </Button>
      </div>

      <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {testing && p.messages.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-h6-600 text-foreground">Try your agent</p>
            <p className="text-paragraph-400-l text-gray-100 mt-1">Send a message as a customer, or pick one below.</p>
          </div>
        )}

        {testing
          ? p.messages.map((m) => <TestMessage key={m.id} m={m} toolIcon={toolIcon} agentName={p.agentName} showLog={showLog} />)
          : p.messages.map((m) => {
              if (m.role === "user")
                return (
                  <UserBubble key={m.id} at={m.at}>
                    {m.text}
                  </UserBubble>
                );
              if (m.role === "answers")
                return (
                  <UserBubble key={m.id} at={m.at}>
                    <div className="text-body-500-m text-gray-40 mb-1">{m.title}</div>
                    <dl className="space-y-0.5">
                      {m.items.map((it) => (
                        <div key={it.label} className="flex gap-2">
                          <dt className="text-paragraph-400-l text-gray-40 shrink-0">{it.label}:</dt>
                          <dd className="text-paragraph-400-l text-white">{it.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </UserBubble>
                );
              if (m.role === "assistant") {
                const writing = p.stream?.id === m.id;
                return (
                  <AssistantReply
                    key={m.id}
                    blocks={m.blocks}
                    at={m.at}
                    shown={writing ? p.stream!.shown : m.blocks.length}
                    writing={writing}
                    isLast={m.id === lastAssistant}
                    ctx={ctx}
                  />
                );
              }
              return null;
            })}

        {p.busy?.kind === "thinking" && <Thinking label={p.busy.label} />}
      </div>

      {testing && p.messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          {p.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => p.onSend(s)}
              className="text-paragraph-400-l text-gray-100 hover:border-blue-60 hover:bg-blue-20 rounded-full border border-border bg-white px-3 py-1.5"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {testing && p.onSave && !p.busy && (
        <div className="mx-3 mb-2 flex items-center gap-3 rounded-xl border border-green-40 bg-green-10 px-3.5 py-2.5" role="status">
          <CircleCheck size={18} className="shrink-0 text-green-100" />
          <span className="min-w-0 flex-1">
            <span className="text-body-600-l text-foreground block">Your agent is answering well</span>
            <span className="text-paragraph-400-m text-gray-100 block">Save it to make it active for your customers.</span>
          </span>
          <Button size="sm" onClick={p.onSave}>
            Save
          </Button>
        </div>
      )}

      {!testing && p.round ? (
        <QuestionCard key={p.round.id} round={p.round} initial={p.answers} number={p.roundNumber} total={p.roundTotal} onSubmit={p.onSubmitRound} skipDefault={p.skipDefault} />
      ) : (
        <Composer
          placeholder={testing ? "Write your message.." : "Ask for a change.."}
          busy={!!p.busy}
          onSend={p.onSend}
          onStop={testing ? undefined : p.onStop}
        />
      )}
    </div>
  );
}
