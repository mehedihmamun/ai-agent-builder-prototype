import type { Answers, RoundId, ScriptAction, TraceStep } from "./script";

export interface ActionItem extends ScriptAction {
  done: boolean;
}

/** Pieces of a Builder Assistant reply, shown top to bottom. */
export type Block =
  | { type: "text"; text: string }
  | { type: "actions"; items: ActionItem[] }
  | { type: "summary" }
  | { type: "chips"; items: string[] }
  /** A call-to-action card, e.g. "Customize with your info" on a template agent. */
  | { type: "cta"; label: string; text: string };

export type ChatMessage =
  | { id: string; role: "user"; text: string; at: string }
  /** The user's answers to one round of questions. */
  | { id: string; role: "answers"; title: string; items: { label: string; value: string }[]; at: string }
  | { id: string; role: "assistant"; blocks: Block[]; at: string }
  /** Test now: the agent's reply to a customer. */
  | { id: string; role: "agent"; text: string; at: string }
  /** Test now: the steps the agent ran. */
  | { id: string; role: "trace"; steps: TraceStep[]; at: string };

export interface Execution {
  id: string;
  at: string;
  input: string;
  steps: number;
  seconds: number;
  handedOff: boolean;
}

/** Everything the builder remembers for one agent. */
export interface BuildState {
  /** Rounds this agent is asked (all three, or only "store" when built from a template). */
  rounds: RoundId[];
  /** Index into `rounds` of the current round; rounds.length when setup is done. */
  round: number;
  greeted: boolean;
  answers: Answers;
  messages: ChatMessage[];
  testMessages: ChatMessage[];
  executions: Execution[];
  model: string;
}
