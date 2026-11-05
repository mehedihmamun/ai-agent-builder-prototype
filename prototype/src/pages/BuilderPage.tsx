import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowLeftRight, Check, EllipsisVertical, History, Play, Settings, Target, Timer, Workflow } from "lucide-react";
import { BDS } from "../ds";
import { DEFAULT_DESIGNATION, type Agent } from "../data/agents";
import { useAppStore } from "../store/AppStore";
import { AppNavbar } from "../layout/AppNavbar";
import { Canvas } from "../builder/Canvas";
import { AssistantPanel } from "../builder/AssistantPanel";
import { ExecutionsTab, GoalsTab, HandoverTab, SettingsTab } from "../builder/tabs";
import { testSuggestions } from "../builder/script";
import { useBuilder } from "../builder/useBuilder";
import { SparkleBadge } from "../builder/chat/SparkleBadge";

const { Tabs, TabsList, TabsTrigger, Switch, Button, Input, Alert, AlertTitle } = BDS;

const TABS = [
  { id: "builder", label: "Builder", icon: Workflow },
  { id: "goals", label: "Goals", icon: Target },
  { id: "handover", label: "Handover reasons", icon: ArrowLeftRight },
  { id: "executions", label: "Executions", icon: Timer },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Agent Builder: canvas on the left, Builder Assistant on the right (wireframe screen 6). */
export function BuilderPage() {
  const { id } = useParams();
  const agent = useAppStore().agents.find((a) => a.id === id);
  if (!agent) return <Navigate to="/agents" replace />;
  return <Builder key={agent.id} agent={agent} />;
}

function Builder({ agent }: { agent: Agent }) {
  const navigate = useNavigate();
  const { toggleAgent, updateAgent } = useAppStore();
  const b = useBuilder(agent);
  const [tab, setTab] = useState<TabId>("builder");
  // Right panel: Builder assistant, Test Flow, or closed. Built agents (templates, existing ones)
  // open on Test now; new ones open on the assistant to set up.
  const [mode, setMode] = useState<"build" | "test" | null>(() => (b.ready ? "test" : "build"));
  const [expanded, setExpanded] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(null), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  // Save / Saved: what the agent is made of right now, compared with the last save.
  const configHash = useMemo(
    () =>
      JSON.stringify({
        a: b.build.answers, n: agent.name, d: agent.description, m: b.build.model,
        av: agent.avatar ?? "classic", ds: agent.designation ?? DEFAULT_DESIGNATION, p: agent.priority ?? "ai-always",
      }),
    [b.build.answers, agent.name, agent.description, b.build.model, agent.avatar, agent.designation, agent.priority],
  );
  const dirty = agent.savedHash !== configHash;
  // Agents that existed before (sample list) count as saved and live.
  useEffect(() => {
    if (!agent.savedHash && !agent.prompt && !agent.templateId) updateAgent(agent.id, { savedHash: configHash, launched: true });
  }, []);
  const save = () => {
    // The first save with setup complete makes the agent active; after that the switch decides.
    const launchNow = b.ready && !agent.launched;
    updateAgent(agent.id, { savedHash: configHash, updatedAt: new Date().toISOString(), ...(launchNow ? { launched: true, active: true } : {}) });
    setSaved(launchNow ? "Agent saved and active" : "Agent saved");
  };
  const hasTestReply = b.build.testMessages.some((m) => m.role === "agent");

  const testNow = () => {
    if (b.building) return;
    setMode("test");
    setTab("builder");
  };

  const rename = (name: string) => updateAgent(agent.id, { name });
  const counts: Partial<Record<TabId, number>> = {
    executions: b.build.executions.length || undefined,
  };

  return (
    <div className="flex h-full bg-white">
      <AppNavbar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-white pr-4 pl-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Back to AI Agents" onClick={() => navigate("/agents")}>
              <ArrowLeft />
            </Button>
            {editingName ? (
              <Input
                autoFocus
                defaultValue={agent.name}
                aria-label="Agent name"
                className="h-7 max-w-[260px]"
                onBlur={(e) => {
                  rename(e.target.value.trim() || agent.name);
                  setEditingName(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                title="Rename"
                className="text-body-600-xl text-foreground hover:bg-offwhite-40 truncate rounded-sm px-1.5 py-0.5"
              >
                {agent.name}
              </button>
            )}
          </div>

          <Tabs value={tab} onValueChange={(v: string) => setTab(v as TabId)} className="self-end">
            <TabsList aria-label="Agent sections" className="border-b-0">
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id} count={counts[t.id]} title={t.label} aria-label={t.label}>
                  <t.icon size={16} />
                  {/* Icons only on smaller screens so the top bar fits. */}
                  <span className="hidden xl:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-1 shrink-0 items-center justify-end gap-2">
            <label className="text-body-500-l text-gray-100 flex items-center gap-2" title={agent.launched ? undefined : "Save the agent to make it active"}>
              <span className="hidden lg:inline">{agent.active ? "Active" : "Inactive"}</span>
              <Switch checked={agent.active} disabled={!agent.launched} onCheckedChange={(v: boolean) => toggleAgent(agent.id, v)} aria-label="Agent active" />
            </label>
            <button
              aria-label="Builder assistant"
              title="Builder assistant"
              aria-pressed={mode === "build"}
              onClick={() => setMode("build")}
              className={`rounded-full p-0.5 transition-shadow ${mode === "build" ? "ring-2 ring-purple-40" : "hover:ring-2 hover:ring-purple-20"}`}
            >
              <SparkleBadge size={28} />
            </button>
            {/* Test now waits until the assistant has finished building; the tooltip says why. */}
            <span className="group relative">
              <Button
                variant={mode === "test" ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mode === "test"}
                disabled={b.building}
                aria-describedby={b.building ? "test-now-tip" : undefined}
                onClick={testNow}
              >
                <Play data-icon="inline-start" />
                Test now
              </Button>
              {b.building && (
                <span
                  id="test-now-tip"
                  role="tooltip"
                  className="text-paragraph-400-m pointer-events-none absolute top-full right-0 z-50 mt-2 hidden w-max max-w-[220px] rounded-md bg-black px-2.5 py-1.5 text-white shadow-md group-hover:block"
                >
                  You can test after the agent finishes building.
                </span>
              )}
            </span>
            <Button variant="secondary" size="icon-sm" aria-label="Version history">
              <History />
            </Button>
            {/* "Save" while there are changes since the last save; "Saved" (disabled) when there are none. */}
            <Button size="sm" onClick={save} disabled={!dirty || !(agent.designation ?? DEFAULT_DESIGNATION).trim()} className="min-w-[74px]">
              {dirty ? "Save" : (<><Check data-icon="inline-start" />Saved</>)}
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More actions">
              <EllipsisVertical />
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <section className="min-w-0 flex-1">
            {tab === "builder" && <Canvas agentName={agent.name} answers={b.build.answers} ready={b.ready} highlight={b.highlight} hidden={b.hidden} run={b.run} frameKey={`${mode}-${expanded}`} />}
            {tab === "goals" && <GoalsTab answers={b.build.answers} />}
            {tab === "handover" && <HandoverTab answers={b.build.answers} />}
            {tab === "executions" && <ExecutionsTab executions={b.build.executions} />}
            {tab === "settings" && (
              <SettingsTab
                agent={agent}
                build={b.build}
                onRename={rename}
                onDescription={(description) => updateAgent(agent.id, { description })}
                onModel={b.setModel}
                onAnswer={b.setAnswerValue}
                onAgent={(patch) => updateAgent(agent.id, patch)}
              />
            )}
          </section>
          {/* Fixed on the right, full height. Opens, closes and expands instantly (no width animation). */}
          {mode && (
          <aside className={`shrink-0 border-l border-border ${expanded ? "w-[560px]" : "w-[400px]"}`}>
            <AssistantPanel
              mode={mode}
              agentName={agent.name}
              answers={b.build.answers}
              messages={mode === "test" ? b.build.testMessages : b.build.messages}
              busy={b.busy}
              stream={b.stream}
              round={b.round}
              roundNumber={b.roundNumber}
              roundTotal={b.roundTotal}
              suggestions={testSuggestions(b.build.answers)}
              expanded={expanded}
              onToggleExpand={() => setExpanded((e) => !e)}
              onSubmitRound={b.submitRound}
              skipDefault={b.skipDefault}
              onSend={mode === "test" ? b.sendTest : b.sendToAssistant}
              onStop={b.stop}
              onFocusNode={(node) => {
                setTab("builder");
                b.glow(node);
              }}
              onTestNow={testNow}
              onReview={() => {
                setMode("build");
                setTab("builder");
                ["trigger", "agent", "model", "catalog", "orders", "policies", "handoff"].forEach(b.glow);
              }}
              onClose={() => setMode(null)}
              onClearTest={b.clearTest}
              onCustomize={() => {
                setMode("build");
                b.customize();
              }}
              customizing={b.build.round < b.roundTotal}
              onSave={dirty && b.ready && hasTestReply ? save : undefined}
            />
          </aside>
          )}
        </div>
      </div>

      {saved && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
          <Alert variant="success" onClose={() => setSaved(null)}>
            <AlertTitle>{saved}</AlertTitle>
          </Alert>
        </div>
      )}
    </div>
  );
}
