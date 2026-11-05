import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PanelLeftOpen } from "lucide-react";
import { BDS } from "../ds";
import { DemoControls } from "../components/DemoControls";
import { AppNavbar } from "./AppNavbar";

const { Sidebar, Button } = BDS;

const SIDEBAR_ITEMS = [
  { id: "ai-agents", label: "AI Agents", icon: "conversation" },
  { id: "marketing", label: "Marketing campaign", icon: "campaign" },
  {
    id: "template",
    label: "Template",
    icon: "template",
    children: [
      { id: "tpl-agents", label: "AI Agents" },
      { id: "tpl-flows", label: "Campaign flows" },
      { id: "tpl-messages", label: "Campaign messages" },
    ],
  },
  { type: "divider" },
  { id: "copilot", label: "Co-pilot", icon: "copilot" },
  { id: "datasource", label: "Data source", icon: "datasource" },
];

/** Navbar + Automation sidebar around the AI Agents pages (wireframe screens 1–5). */
export function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const ROUTES: Record<string, string> = { "ai-agents": "/agents", "tpl-agents": "/templates" };

  return (
    <div className="flex h-full bg-white">
      <AppNavbar />
      {collapsed ? (
        <div className="border-r border-border p-2">
          <Button variant="ghost" size="icon-sm" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}>
            <PanelLeftOpen />
          </Button>
        </div>
      ) : (
        <Sidebar
          title="Automation"
          value={pathname.startsWith("/templates") ? "tpl-agents" : "ai-agents"}
          onChange={(id: string) => ROUTES[id] && navigate(ROUTES[id])}
          onCollapse={() => setCollapsed(true)}
          items={SIDEBAR_ITEMS as never}
        />
      )}
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
      <DemoControls />
    </div>
  );
}
