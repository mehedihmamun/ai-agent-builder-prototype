import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, PenLine } from "lucide-react";
import { BDS } from "../../ds";
import { questionsFor, type Answer, type Answers, type Question, type QuestionId, type Round } from "../script";
import { ConnectList, FieldsInput, HoursEditor } from "./SetupInputs";

const { Button, Checkbox } = BDS;

/**
 * A round of questions in one card, Claude-style: tabs per question, numbered options,
 * a "something else" row, Skip, and Submit on the last tab.
 */
export function QuestionCard({
  round,
  number,
  total,
  initial,
  onSubmit,
  skipDefault,
}: {
  round: Round;
  initial: Answers;
  number: number;
  total: number;
  onSubmit: (a: Answers) => void;
  skipDefault: (id: QuestionId) => Answer;
}) {
  const [tab, setTab] = useState(0);
  const questions = useMemo(() => questionsFor(round, initial), [round, initial]);
  // Where a question starts: what is known already (template, prompt, earlier rounds); otherwise
  // multi-choice questions start with the usual picks, hours and greeting with a sensible default,
  // and business details and connections start empty (the user has to give them).
  const start = (q: Question): Answer | undefined => {
    if (initial[q.id]) return initial[q.id];
    if (q.kind === "connect" || q.id === "store") return undefined;
    if (q.multi || q.kind === "hours" || q.kind === "fields") return skipDefault(q.id);
    return undefined;
  };
  const [answers, setAnswers] = useState<Answers>(() => Object.fromEntries(questions.flatMap((q) => (start(q) ? [[q.id, start(q)]] : []))));
  const otherRef = useRef<HTMLInputElement>(null);
  const q = questions[tab];
  const a = answers[q.id];
  const last = tab === questions.length - 1;
  const kind = q.kind ?? "choice";
  const answered = (id: QuestionId) => {
    const x = answers[id];
    const qq = questions.find((y) => y.id === id)!;
    if (qq.kind === "hours") return true;
    if (qq.kind === "fields") {
      const req = qq.fields?.filter((f) => f.required) ?? [];
      return req.length ? req.every((f) => !!x?.fields?.[f.id]?.trim()) : true;
    }
    if (qq.kind === "connect") return qq.required ? !!x?.ids.length : true;
    return !!x && (x.ids.length > 0 || !!x.text?.trim());
  };
  const allAnswered = useMemo(() => questions.every((x) => answered(x.id)), [answers, questions]);

  const set = (value: Answer) => setAnswers((s) => ({ ...s, [q.id]: value }));
  const next = () => (last ? undefined : setTab((t) => t + 1));
  const submit = () => onSubmit(answers);

  const choose = (id: string) => {
    if (q.multi) {
      const ids = a?.ids ?? [];
      set({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
      return;
    }
    set({ ids: [id] });
    // Single choice moves on by itself.
    if (!last) window.setTimeout(next, 220);
  };

  const skip = () => {
    set(skipDefault(q.id));
    if (last) onSubmit({ ...answers, [q.id]: skipDefault(q.id) });
    else next();
  };

  // Number keys pick options; Enter goes on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, [role=switch], [role=combobox]")) return;
      if (kind !== "choice") return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(q.options[n - 1].id);
      else if (q.otherPlaceholder && n === q.options.length + 1) otherRef.current?.focus();
      else if (e.key === "Enter" && answered(q.id)) (last ? allAnswered && submit() : next());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const keyBox = (n: ReactNode, on: boolean) => (
    <span
      className={`text-body-500-m flex size-6 shrink-0 items-center justify-center rounded-md border ${
        on ? "border-primary bg-primary text-white" : "border-offwhite-80 bg-white text-gray-100"
      }`}
    >
      {n}
    </span>
  );

  return (
    <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-offwhite-80 bg-white shadow-md">
      <div className="flex items-center gap-1 border-b border-offwhite-80 px-3 py-2">
        {questions.map((x, i) => (
          <button
            key={x.id}
            onClick={() => setTab(i)}
            className={`text-body-500-m flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              i === tab ? "bg-offwhite-60 text-foreground" : "text-gray-100 hover:text-foreground"
            }`}
          >
            {answered(x.id) && i !== tab && <Check size={12} className="text-green-90" />}
            {x.tab}
          </button>
        ))}
        <span className="text-paragraph-400-m text-gray-100 ml-auto">
          {total > 1 ? `${number} of ${total}` : round.title}
        </span>
      </div>

      <div className="max-h-[52vh] overflow-y-auto px-4 pt-3 pb-2">
        <p className="text-h6-600 text-foreground">
          {q.text}
          {q.required && <span className="text-paragraph-400-m text-red-90 ml-1.5 align-middle">Required</span>}
        </p>
        {q.hint ? (
          <p className="text-paragraph-400-m text-gray-100">{q.hint}</p>
        ) : (
          q.multi && kind === "choice" && <p className="text-paragraph-400-m text-gray-100">Select all that apply.</p>
        )}
        {kind === "fields" && <div className="mt-2.5"><FieldsInput q={q} value={a} onChange={set} /></div>}
        {kind === "connect" && <div className="mt-2.5"><ConnectList q={q} value={a} onChange={set} /></div>}
        {kind === "hours" && <div className="mt-2.5"><HoursEditor value={a} onChange={set} /></div>}
        {kind === "choice" && (<div className="mt-2.5 space-y-1">
          {q.options.map((o, i) => {
            const on = !!a?.ids.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  on ? "bg-blue-20 ring-1 ring-blue-60" : "hover:bg-offwhite-40"
                }`}
              >
                {keyBox(i + 1, on && !q.multi)}
                <span className="min-w-0 flex-1">
                  <span className="text-body-500-l text-foreground block">{o.label}</span>
                  {o.description && <span className="text-paragraph-400-m text-gray-100 block">{o.description}</span>}
                </span>
                {q.multi && <Checkbox checked={on} tabIndex={-1} aria-hidden="true" className="pointer-events-none" />}
              </button>
            );
          })}
          {q.otherPlaceholder && (
            <label className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${a?.text ? "bg-blue-20 ring-1 ring-blue-60" : "hover:bg-offwhite-40"}`}>
              {keyBox(<PenLine size={12} />, !!a?.text)}
              <input
                ref={otherRef}
                value={a?.text ?? ""}
                onChange={(e) => set({ ids: [], text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && a?.text?.trim()) (last ? allAnswered && submit() : next());
                }}
                placeholder={`${q.otherPlaceholder}…`}
                className="text-paragraph-400-l text-foreground placeholder:text-gray-100 min-w-0 flex-1 bg-transparent outline-none"
              />
            </label>
          )}
        </div>)}
      </div>

      <div className="flex items-center gap-2 px-4 pt-1 pb-3">
        {kind === "choice" && <span className="text-paragraph-400-s text-gray-100">Press 1–{q.options.length} to choose</span>}
        <div className="ml-auto flex gap-2">
          {!q.required && (
            <Button variant="ghost" size="sm" onClick={skip}>
              Skip
            </Button>
          )}
          {last ? (
            <Button size="sm" disabled={!allAnswered} onClick={submit}>
              Submit
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled={!answered(q.id)} onClick={next}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
