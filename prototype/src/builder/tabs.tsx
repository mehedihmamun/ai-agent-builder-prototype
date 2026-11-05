import type { ReactNode } from "react";
import { ArrowLeftRight, Target } from "lucide-react";
import { BDS } from "../ds";
import { DEFAULT_DESIGNATION, PRIORITY_OPTIONS, type Agent, type AgentPriority } from "../data/agents";
import { AVATARS, BotAvatar } from "../components/BotAvatar";
import { HANDOFF_MESSAGE, goalsFor, handoverFor, questionById, type Answer, type Answers, type QuestionId } from "./script";
import { ConnectList, FieldsInput, HoursEditor } from "./chat/SetupInputs";
import type { BuildState } from "./types";

const { Badge, Button, Popover, PopoverTrigger, PopoverContent, Card, CardContent, CardHeader, CardTitle, CardDescription, Checkbox, DataTable, Input, Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = BDS;

function TabPage({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-offwhite-40">
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-6">
        <div>
          <h2 className="text-h4-600 text-foreground">{title}</h2>
          <p className="text-paragraph-400-l text-gray-100">{text}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="text-paragraph-400-l text-gray-100 rounded-xl border border-dashed border-gray-20 bg-white px-6 py-10 text-center">{text}</div>
  );
}

function Row({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-10 text-purple-100">{icon}</span>
      <div>
        <div className="text-body-500-xl text-foreground">{title}</div>
        {text && <div className="text-paragraph-400-l text-gray-100">{text}</div>}
      </div>
    </div>
  );
}

export function GoalsTab({ answers }: { answers: Answers }) {
  const goals = goalsFor(answers);
  return (
    <TabPage title="Goals" text="What this agent is meant to achieve in every conversation.">
      {goals.length ? goals.map((g) => <Row key={g.id} icon={<Target size={18} />} title={g.title} text={g.description} />) : <Empty text="No goals yet. Answer the Builder Assistant's questions to add them." />}
    </TabPage>
  );
}

export function HandoverTab({ answers }: { answers: Answers }) {
  const reasons = handoverFor(answers);
  return (
    <TabPage title="Handover reasons" text="When the agent passes the chat to your team.">
      {reasons.length ? (
        <>
          {reasons.map((r) => <Row key={r.id} icon={<ArrowLeftRight size={18} />} title={r.label} />)}
          <Card>
            <CardHeader>
              <CardTitle>Handover message</CardTitle>
              <CardDescription>What the customer sees when the chat goes to your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-paragraph-400-l text-foreground rounded-md bg-offwhite-40 px-3 py-2">{HANDOFF_MESSAGE}</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Empty text="No handover reasons yet. The Builder Assistant will ask about them." />
      )}
    </TabPage>
  );
}

export function ExecutionsTab({ executions }: { executions: BuildState["executions"] }) {
  return (
    <TabPage title="Executions" text="Every run of this agent, including your tests.">
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <DataTable
          columnToggle={false}
          rows={executions}
          emptyTitle="No executions yet"
          emptyText="Use Test now to run the agent."
          columns={[
            { key: "at", header: "Time", width: 170, render: (r: BuildState["executions"][number]) => new Date(r.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) },
            { key: "input", header: "Customer message", truncate: true, width: 280 },
            { key: "steps", header: "Steps", align: "right" },
            { key: "seconds", header: "Duration", align: "right", render: (r: BuildState["executions"][number]) => `${r.seconds.toFixed(2)}s` },
            {
              key: "status",
              header: "Result",
              render: (r: BuildState["executions"][number]) =>
                r.handedOff ? <Badge tone="yellow" variant="light">Handed off</Badge> : <Badge tone="green" variant="light">Success</Badge>,
            },
          ]}
        />
      </div>
    </TabPage>
  );
}

function Section({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {text && <CardDescription>{text}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/** Label on the left, field on the right (REVE Chat settings layout). */
function FieldRow({ label, required, htmlFor, top, children }: { label: string; required?: boolean; htmlFor?: string; top?: boolean; children: ReactNode }) {
  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr] sm:gap-6 ${top ? "sm:items-start" : "sm:items-center"}`}>
      <Label htmlFor={htmlFor} className={top ? "sm:pt-2" : ""}>
        {label}
        {required && <span className="text-red-90"> *</span>}
      </Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Everything the Builder Assistant set up, editable here afterwards. */
export function SettingsTab({
  agent,
  build,
  onRename,
  onDescription,
  onModel,
  onAnswer,
  onAgent,
}: {
  agent: Agent;
  build: BuildState;
  onRename: (name: string) => void;
  onDescription: (text: string) => void;
  onModel: (model: string) => void;
  onAnswer: (id: QuestionId, value: Answer) => void;
  onAgent: (patch: Partial<Agent>) => void;
}) {
  const answers = build.answers;
  const store = !answers.profile;
  const choice = (id: QuestionId, label: string) => {
    const q = questionById(id);
    return (
      <div className="ds-field">
        <Label>{label}</Label>
        <Select value={answers[id]?.ids[0] ?? ""} onValueChange={(v: string) => onAnswer(id, { ids: [v] })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Not set yet" /></SelectTrigger>
          <SelectContent>
            {q.options.map((o) => (
              <SelectItem key={o.id} value={o.id} description={o.description}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  const checks = (id: QuestionId) => {
    const q = questionById(id);
    const ids = answers[id]?.ids ?? [];
    return (
      <div className="space-y-2">
        {q.options.map((o) => (
          <label key={o.id} className="text-paragraph-400-l text-foreground flex items-center gap-2.5">
            <Checkbox
              checked={ids.includes(o.id)}
              onCheckedChange={(v: boolean) => onAnswer(id, { ids: v ? [...ids, o.id] : ids.filter((x) => x !== o.id) })}
            />
            {o.label}
          </label>
        ))}
      </div>
    );
  };

  return (
    <TabPage title="Settings" text="Everything the Builder assistant set up. Changes here update the agent; press Save to keep them.">
      <Section title="AI agent profile" text="How the agent introduces itself to customers.">
        <FieldRow label="AI agent avatar">
          <div className="flex items-center gap-3">
            <BotAvatar size={52} avatar={agent.avatar} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="default">Change avatar</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-3">
                <p className="text-body-500-m text-gray-100 mb-2">Choose an avatar</p>
                <div className="grid grid-cols-3 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      aria-label={`${av.label} avatar`}
                      aria-pressed={(agent.avatar ?? "classic") === av.id}
                      onClick={() => onAgent({ avatar: av.id })}
                      className={`rounded-full p-0.5 ring-2 transition-shadow ${(agent.avatar ?? "classic") === av.id ? "ring-blue-90" : "ring-transparent hover:ring-blue-40"}`}
                    >
                      <BotAvatar size={44} avatar={av.id} />
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </FieldRow>
        <FieldRow label="AI agent name" htmlFor="agent-name">
          <Input id="agent-name" value={agent.name} onChange={(e) => onRename(e.target.value)} />
        </FieldRow>
        <FieldRow label="Designation" required htmlFor="agent-designation">
          <Input
            id="agent-designation"
            value={agent.designation ?? DEFAULT_DESIGNATION}
            onChange={(e) => onAgent({ designation: e.target.value })}
            aria-invalid={!(agent.designation ?? DEFAULT_DESIGNATION).trim()}
          />
          {!(agent.designation ?? DEFAULT_DESIGNATION).trim() && <p className="text-paragraph-400-m text-red-90 mt-1">Add a designation, e.g. "Customer support assistant".</p>}
        </FieldRow>
        <FieldRow label="Description" htmlFor="agent-desc" top>
          <Textarea id="agent-desc" value={agent.description} onChange={(e) => onDescription(e.target.value)} />
        </FieldRow>
      </Section>

      <Section title="Other Settings" text="Control your agent accuracy, trigger and other settings">
        <FieldRow label="AI agent & human agent priority">
          <Select value={agent.priority ?? "ai-always"} onValueChange={(v: string) => onAgent({ priority: v as AgentPriority })}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((o) => (
                <SelectItem key={o.id} value={o.id} description={o.description}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Chat model">
          <Select value={build.model} onValueChange={onModel}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o" description="Best quality replies">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini" description="Faster, lower cost">GPT-4o mini</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
      </Section>

      <Section title="Business">
        <FieldsInput q={questionById("store")} value={answers.store} onChange={(a) => onAnswer("store", a)} />
        {choice("industry", "Industry")}
      </Section>

      <Section title="Channels" text="Where the agent answers your customers.">
        <ConnectList q={questionById("channels")} value={answers.channels} onChange={(a) => onAnswer("channels", a)} />
      </Section>

      <Section title="Data & integrations" text="What the agent can read and update.">
        {store && (
          <div className="grid grid-cols-2 gap-4">
            {choice("platform", "Store platform")}
            {choice("catalog", "Product catalog")}
            {choice("policies", "Shipping & return policies")}
          </div>
        )}
        <ConnectList q={questionById("integrations")} value={answers.integrations} onChange={(a) => onAnswer("integrations", a)} />
      </Section>

      <Section title="Availability" text="When your team can take over. The agent itself answers 24/7.">
        <HoursEditor value={answers.hours} onChange={(a) => onAnswer("hours", a)} />
        {choice("afterhours", "Outside business hours")}
      </Section>

      <Section title="Rules & handover" text="Handover reasons are listed in the Handover reasons tab.">
        {choice("team", "Hand over to")}
        <div className="ds-field">
          <Label>Rules the agent must follow</Label>
          {checks("limits")}
        </div>
      </Section>

      <Section title="Voice">
        <div className="grid grid-cols-2 gap-4">
          {choice("language", "Reply language")}
          {choice("tone", "Tone")}
        </div>
        <FieldsInput q={questionById("greeting")} value={answers.greeting} onChange={(a) => onAnswer("greeting", a)} />
      </Section>
    </TabPage>
  );
}
