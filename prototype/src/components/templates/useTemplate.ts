import { useNavigate } from "react-router-dom";
import type { AgentTemplate } from "../../data/agentTemplates";
import { useAppStore } from "../../store/AppStore";

/** "Use this template": create a draft agent from the template and open the Builder. */
export function useTemplate() {
  const navigate = useNavigate();
  const { addAgent } = useAppStore();

  return (t: AgentTemplate) => {
    const id = `agent-${Date.now()}`;
    const now = new Date().toISOString();
    addAgent({
      id,
      name: t.title,
      description: t.description,
      prompt: t.prompt,
      templateId: t.id,
      direction: t.direction ?? "Inbound",
      channels: t.channels,
      createdBy: "Mehedi Hasan Mamun",
      createdAt: now,
      updatedAt: now,
      active: false,
    });
    navigate(`/agents/${id}/builder`);
  };
}
