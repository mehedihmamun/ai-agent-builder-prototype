import { useCallback, useEffect, useRef, useState } from "react";
import type { Agent, Channel } from "../data/agents";
import { findTemplate } from "../data/agentTemplates";
import { useAppStore } from "../store/AppStore";
import {
  CHANGE_THINKING,
  DEFAULT_ANSWERS,
  FOLLOW_UPS,
  READY_TEXT,
  ROUNDS,
  START_ACTIONS,
  START_FOLLOW_UP,
  START_TEXT,
  START_THINKING,
  THINKING,
  ALL_SET,
  CHANGE_IDEAS,
  CUSTOMIZE_LABEL,
  CUSTOMIZE_TEXT,
  answersFromPrompt,
  knownFromPrompt,
  questionsFor,
  changeIdeas,
  CHANGE_PROMPT,
  templateReady,
  answerLabel,
  canvasTools,
  changeText,
  questionById,
  roundActions,
  roundText,
  storeName,
  testRun,
  type Answer,
  type Answers,
  type QuestionId,
  type ScriptAction,
} from "./script";
import type { Block, BuildState, ChatMessage } from "./types";

/** Speed of the word-by-word reply, shared with the StreamText renderer. */
export const WORD_MS = 28;
const ACTION_MS = 480;

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const words = (text: string) => text.split(/\s+/).length;
const actions = (items: ScriptAction[]): Block => ({ type: "actions", items: items.map((a) => ({ ...a, done: false })) });

/** Mark every action as done, e.g. for a reply that was interrupted by leaving the page. */
const settle = (messages: ChatMessage[]): ChatMessage[] =>
  messages.map((m) =>
    m.role === "assistant"
      ? { ...m, blocks: m.blocks.map((b) => (b.type === "actions" ? { ...b, items: b.items.map((i) => ({ ...i, done: true })) } : b)) }
      : m,
  );

const ALL_ROUNDS = ROUNDS.map((r) => r.id);

function initialBuild(agent: Agent, saved?: BuildState): BuildState {
  if (saved) return { ...saved, rounds: saved.rounds ?? ALL_ROUNDS, messages: settle(saved.messages) };
  const base = { testMessages: [], executions: [], model: "gpt-4o", rounds: ALL_ROUNDS };
  // From a template: already built, so it opens on Test now with no setup questions.
  const template = findTemplate(agent.templateId);
  if (template) {
    return {
      ...base,
      round: ROUNDS.length,
      greeted: true,
      // General templates (appointments, billing…) don't inherit the demo store's name and industry.
      answers: {
        ...DEFAULT_ANSWERS,
        ...(template.answers.profile ? { store: undefined, industry: undefined, limits: { ids: ["noPayment"] } } : {}),
        ...template.answers,
        channels: { ids: template.channels },
      },
      messages: [
        {
          id: uid(),
          role: "assistant",
          at: now(),
          blocks: [
            { type: "text", text: templateReady(template.title) },
            { type: "summary" },
            { type: "text", text: CHANGE_PROMPT },
            { type: "cta", label: CUSTOMIZE_LABEL, text: "Answer 6 short rounds — business, channels, data, hours, rules and voice — already filled in from the template." },
            { type: "chips", items: changeIdeas(template.answers) },
          ],
        },
      ],
    };
  }
  // A freshly created agent starts the question flow from its prompt.
  if (agent.prompt) {
    // Channels picked on an empty-state card come ticked in the channel question.
    const answers = { ...answersFromPrompt(agent.prompt), ...(agent.channels.length ? { channels: { ids: agent.channels } } : {}) };
    return { ...base, round: 0, greeted: false, answers, messages: [{ id: uid(), role: "user", text: agent.prompt, at: now() }] };
  }
  // Agents that existed before open as already built.
  return {
    ...base,
    round: ROUNDS.length,
    greeted: true,
    answers: { ...DEFAULT_ANSWERS, channels: { ids: agent.channels } },
    messages: [
      {
        id: uid(),
        role: "assistant",
        at: now(),
        blocks: [{ type: "text", text: READY_TEXT }, { type: "summary" }, { type: "chips", items: CHANGE_IDEAS }],
      },
    ],
  };
}

export interface RunState {
  active?: string;
  done: string[];
}

/** What the assistant is doing right now: thinking (with a label) or writing a reply. */
export type Busy = { kind: "thinking"; label: string } | { kind: "writing" } | null;

/** The reply being written: which message, and how many of its blocks are shown so far. */
export interface Stream {
  id: string;
  shown: number;
}

/** Drives the scripted Builder Assistant conversation and Test now runs for one agent. */
export function useBuilder(agent: Agent) {
  const { builds, saveBuild, updateAgent } = useAppStore();
  const [build, setBuild] = useState<BuildState>(() => initialBuild(agent, builds[agent.id]));
  const [busy, setBusy] = useState<Busy>(null);
  const [stream, setStream] = useState<Stream | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  /** Canvas steps that exist in the answers but appear only when their action line ticks. */
  const [hidden, setHidden] = useState<string[]>([]);
  const [run, setRun] = useState<RunState | null>(null);
  /** The assistant is writing a reply and changing the agent (Test now waits for it). */
  const [replying, setReplying] = useState(false);
  const timers = useRef<number[]>([]);
  const finish = useRef<(() => void) | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);
  useEffect(() => saveBuild(agent.id, build), [agent.id, build, saveBuild]);

  const activeRounds = ROUNDS.filter((r) => build.rounds.includes(r.id));
  const ready = build.round >= activeRounds.length;
  const round = build.greeted && !ready && !busy ? activeRounds[build.round] : null;

  const push = (m: ChatMessage) => setBuild((b) => ({ ...b, messages: [...b.messages, m] }));

  const glow = (node: string) => {
    setHighlight((h) => [...h, node]);
    later(() => setHighlight((h) => h.filter((x) => x !== node)), 1600);
  };

  /** Tick an action line: ✓ it, reveal and glow its canvas step, and apply its effect. */
  const tick = (id: string, blockIndex: number, itemIndex: number, item: ScriptAction, answers: Answers) => {
    setBuild((b) => ({
      ...b,
      messages: b.messages.map((m) =>
        m.id === id && m.role === "assistant"
          ? {
              ...m,
              blocks: m.blocks.map((blk, bi) =>
                bi === blockIndex && blk.type === "actions"
                  ? { ...blk, items: blk.items.map((it, ii) => (ii === itemIndex ? { ...it, done: true } : it)) }
                  : blk,
              ),
            }
          : m,
      ),
    }));
    setHidden((h) => h.filter((x) => x !== item.node));
    glow(item.node);
    if (item.label === "Renamed agent" && item.detail) updateAgent(agent.id, { name: item.detail, updatedAt: now() });
  };

  /**
   * Think for a moment, then write a reply block by block: text appears word by word,
   * action lines tick one at a time. `done` runs at the end, or at once if the user presses Stop.
   */
  const reply = (thinking: string, blocks: Block[], answers: Answers, done?: () => void) => {
    const id = uid();
    setReplying(true);
    setBusy({ kind: "thinking", label: thinking });

    const complete = () => {
      finish.current = null;
      setReplying(false);
      setStream(null);
      setBusy(null);
      setHidden([]);
      done?.();
    };

    later(() => {
      setBusy({ kind: "writing" });
      setBuild((b) => ({ ...b, messages: [...b.messages, { id, role: "assistant", blocks, at: now() }] }));
      setStream({ id, shown: 1 });

      let t = 0;
      blocks.forEach((block, i) => {
        if (i > 0) later(() => setStream({ id, shown: i + 1 }), t);
        if (block.type === "text") t += words(block.text) * WORD_MS + 250;
        if (block.type === "actions") {
          block.items.forEach((item, j) => later(() => tick(id, i, j, item, answers), t + 350 + j * ACTION_MS));
          t += 350 + block.items.length * ACTION_MS + 150;
        }
        if (block.type === "summary") t += 500;
      });
      later(complete, t);
    }, 1300);

    // Stop: skip the animation and show the finished reply.
    finish.current = () => {
      clearTimers();
      setBuild((b) => {
        const has = b.messages.some((m) => m.id === id);
        return { ...b, messages: settle(has ? b.messages : [...b.messages, { id, role: "assistant", blocks, at: now() }]) };
      });
      const rename = blocks.flatMap((b) => (b.type === "actions" ? b.items : [])).find((i) => i.label === "Renamed agent");
      if (rename?.detail) updateAgent(agent.id, { name: rename.detail, updatedAt: now() });
      setHighlight([]);
      complete();
    };
  };

  // Greet once: set up the basics, then ask the first round (only agents created from a prompt).
  useEffect(() => {
    if (build.greeted) return;
    const greeted = () => setBuild((b) => ({ ...b, greeted: true }));
    const known = knownFromPrompt(build.answers);
    const follow = known.length ? `${START_FOLLOW_UP} I picked up **${known.join("**, **")}** from your prompt and filled it in.` : START_FOLLOW_UP;
    reply(START_THINKING, [{ type: "text", text: START_TEXT }, actions(START_ACTIONS), { type: "text", text: follow }], {}, greeted);
  }, [build.greeted]);

  /** Submit one round of answers (skipped questions already carry their defaults). */
  const submitRound = (roundAnswers: Answers) => {
    const r = activeRounds[build.round];
    const answers = { ...build.answers, ...roundAnswers };
    const last = build.round + 1 >= activeRounds.length;
    push({
      id: uid(),
      role: "answers",
      title: r.title,
      at: now(),
      items: questionsFor(r, answers).map((q) => ({ label: q.tab, value: answerLabel(q.id, roundAnswers[q.id]) || "—" })),
    });
    setBuild((b) => ({ ...b, answers, round: b.round + 1 }));
    // The channels picked here show on the agent's card in the list.
    if (roundAnswers.channels) updateAgent(agent.id, { channels: roundAnswers.channels.ids as Channel[] });

    // New canvas steps wait for their action line.
    const before = new Set(canvasTools(build.answers).map((t) => t.id));
    const fresh: string[] = canvasTools(answers).map((t) => t.id).filter((id) => !before.has(id));
    if (r.id === "rules" && answers.handover?.ids.length && !build.answers.handover?.ids.length) fresh.push("handoff");
    setHidden(fresh);

    const { intro, outro } = roundText(r.id, answers);
    const template = findTemplate(agent.templateId);
    // A template agent keeps its template name after the store name.
    const roundSteps = roundActions(r.id, answers).map((a) =>
      a.label === "Renamed agent" && template ? { ...a, detail: `${storeName(answers)} ${template.title}` } : a,
    );
    const blocks: Block[] = [{ type: "text", text: intro }, actions(roundSteps)];
    if (last) {
      if (r.id !== "voice") blocks.push({ type: "text", text: ALL_SET });
      blocks.push({ type: "summary" }, { type: "text", text: roundText("voice", answers).outro! }, { type: "chips", items: FOLLOW_UPS });
    } else if (outro) {
      blocks.push({ type: "text", text: outro });
    }

    reply(THINKING[r.id], blocks, answers, last ? () => updateAgent(agent.id, { updatedAt: now() }) : undefined);
  };

  const skipDefault = (id: QuestionId) => DEFAULT_ANSWERS[id];

  /** "Customize with your info" on a template agent: run the setup rounds, filled in from the template. */
  const customize = () => {
    if (busy) return;
    push({ id: uid(), role: "user", text: "Customize this template with my business info.", at: now() });
    setBuild((b) => ({ ...b, rounds: ROUNDS.map((r) => r.id), round: 0, greeted: true }));
    reply(THINKING.business, [{ type: "text", text: CUSTOMIZE_TEXT }], build.answers);
  };

  /** A change from the Settings tab. */
  const setAnswerValue = (id: QuestionId, value: Answer) => {
    setBuild((b) => ({ ...b, answers: { ...b.answers, [id]: value } }));
    if (id === "channels") updateAgent(agent.id, { channels: value.ids as Channel[], updatedAt: now() });
  };

  /** Free-text request to the Builder Assistant. */
  const sendToAssistant = (text: string) => {
    push({ id: uid(), role: "user", text, at: now() });
    reply(CHANGE_THINKING, [{ type: "text", text: changeText(text) }, actions([{ label: "Updated instructions", detail: text, node: "agent" }])], build.answers);
  };

  const stop = () => finish.current?.();

  /** Send a customer message to the agent in Test now. */
  const sendTest = (text: string) => {
    const { trace, reply: answer } = testRun(text, { ready, agentName: agent.name, answers: build.answers });
    const traceId = uid();
    setBuild((b) => ({ ...b, testMessages: [...b.testMessages, { id: uid(), role: "user", text, at: now() }, { id: traceId, role: "trace", steps: [], at: now() }] }));
    setBusy({ kind: "thinking", label: "Running your agent" });

    trace.forEach((step, i) => {
      later(() => {
        setRun({ active: step.node, done: trace.slice(0, i).map((s) => s.node) });
        setBuild((b) => ({
          ...b,
          testMessages: b.testMessages.map((m) => (m.id === traceId && m.role === "trace" ? { ...m, steps: [...m.steps, step] } : m)),
        }));
      }, 300 + i * 550);
    });

    later(() => {
      setRun({ done: trace.map((s) => s.node) });
      setBusy(null);
      setBuild((b) => ({
        ...b,
        testMessages: [...b.testMessages, { id: uid(), role: "agent", text: answer, at: now() }],
        executions: [
          {
            id: uid(),
            at: now(),
            input: text,
            steps: trace.length,
            seconds: Math.round(trace.reduce((t, s) => t + s.seconds, 0) * 100) / 100,
            handedOff: trace.some((s) => s.node === "handoff"),
          },
          ...b.executions,
        ],
      }));
      later(() => setRun(null), 1500);
    }, 300 + trace.length * 550);
  };

  const clearTest = () => setBuild((b) => ({ ...b, testMessages: [] }));
  const setModel = (model: string) => setBuild((b) => ({ ...b, model }));
  const setAnswer = (id: QuestionId, ids: string[]) => setBuild((b) => ({ ...b, answers: { ...b.answers, [id]: { ids } } }));

  return {
    build,
    ready,
    /** Setup is not finished, or the assistant is still changing the agent. */
    building: !ready || replying,
    round,
    roundNumber: build.round + 1,
    roundTotal: activeRounds.length,
    busy,
    stream,
    highlight,
    hidden,
    run,
    glow,
    submitRound,
    skipDefault,
    sendToAssistant,
    stop,
    sendTest,
    clearTest,
    setModel,
    setAnswer,
    setAnswerValue,
    customize,
    questionById,
  };
}
