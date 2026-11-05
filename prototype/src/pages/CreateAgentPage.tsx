import { useNavigate } from "react-router-dom";
import { BDS } from "../ds";
import { AgentStarter } from "../components/AgentStarter";

const { PageHeader } = BDS;

/** "+ Create Agent": the same starter as the empty state, under the page header. */
export function CreateAgentPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Create AI Agent" onBack={() => navigate("/agents")} />
      <div className="flex-1 overflow-auto bg-offwhite-40">
        <AgentStarter title="Create a new AI Agent" autoFocus />
      </div>
    </div>
  );
}
