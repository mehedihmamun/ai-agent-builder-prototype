import { useNavigate } from "react-router-dom";
import { BDS } from "../ds";
import { formatDate, type Agent } from "../data/agents";
import { useAppStore } from "../store/AppStore";
import { AgentTags } from "./AgentTags";
import { BotAvatar } from "./BotAvatar";

const { Switch } = BDS;

/** Card view of agents (wireframe screen 3). */
export function AgentGrid({ agents }: { agents: Agent[] }) {
  const navigate = useNavigate();
  const { toggleAgent } = useAppStore();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 p-4">
      {agents.map((a) => (
        <div
          key={a.id}
          role="link"
          tabIndex={0}
          onClick={() => navigate(`/agents/${a.id}/builder`)}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/agents/${a.id}/builder`)}
          className="flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <BotAvatar avatar={a.avatar} />
            <span onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={a.active}
                onCheckedChange={(v: boolean) => toggleAgent(a.id, v)}
                aria-label={`${a.name} active`}
              />
            </span>
          </div>
          <div className="text-h4 text-foreground truncate">{a.name}</div>
          <AgentTags direction={a.direction} channels={a.channels} />
          <div className="text-paragraph-400-l text-gray-100 space-y-1">
            <div>Created {formatDate(a.createdAt, "; ")}</div>
            <div>Last updated {formatDate(a.updatedAt, "; ")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
