import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BookText, Plus } from "lucide-react";
import { BDS } from "../ds";
import { useAppStore } from "../store/AppStore";
import { AgentGrid } from "../components/AgentGrid";
import { AgentTable } from "../components/AgentTable";
import { EmptyState } from "../components/EmptyState";
import { IntroModal } from "../components/IntroModal";

const { ViewToggle, Input, Button, SearchIcon, FilterIcon } = BDS;

/** AI Agents index: empty state, grid and table (wireframe screens 1–4). */
export function AgentsPage() {
  const navigate = useNavigate();
  const { agents, introSeen, setIntroSeen } = useAppStore();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [query, setQuery] = useState("");

  const isEmpty = agents.length === 0;
  const visible = useMemo(
    () =>
      agents.filter((a) => a.name.toLowerCase().includes(query.trim().toLowerCase())),
    [agents, query],
  );

  return (
    <div className="flex h-full flex-col">
      <header className="bg-white px-4 pt-3 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h6-600 text-foreground">AI Agents</h1>
            <p className="text-paragraph-400-m text-gray-100">All AI agents, credentials owned by you</p>
          </div>
          <Button variant="secondary" size="sm">
            <BookText data-icon="inline-start" />
            Learn more
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-2 border-b border-border bg-white px-4 py-2">
        {/* Disabled (no agents yet): solid gray-80 / gray-60 icons instead of a 50% fade (Figma review). */}
        <ViewToggle
          value={view}
          onValueChange={(v: string) => v && setView(v as typeof view)}
          disabled={isEmpty}
          className="[&_[data-disabled]]:text-gray-60 [&_[data-disabled]]:opacity-100 [&_[data-disabled][data-state=checked]]:text-gray-80"
        />
        <div className="relative w-[200px]">
          <SearchIcon className="text-gray-100 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search agents"
            className="h-7 pl-8"
          />
        </div>
        <Button variant="outline" size="icon-sm" aria-label="Filter">
          <FilterIcon />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/templates")}>
            <BookOpen data-icon="inline-start" />
            Explore template
          </Button>
          <Button size="sm" onClick={() => navigate("/agents/new")}>
            <Plus data-icon="inline-start" />
            Create agent
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-offwhite-40">
        {isEmpty ? (
          <EmptyState />
        ) : visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-body-500-xl text-foreground">No agents found</p>
            <p className="text-paragraph-400-l text-gray-100 mt-1">Try another search term.</p>
          </div>
        ) : view === "grid" ? (
          <AgentGrid agents={visible} />
        ) : (
          <AgentTable agents={visible} />
        )}
      </div>

      <IntroModal open={!introSeen} onClose={() => setIntroSeen(true)} />
    </div>
  );
}
