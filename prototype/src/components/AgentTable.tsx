import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BDS } from "../ds";
import { formatDate, type Agent } from "../data/agents";
import { useAppStore } from "../store/AppStore";
import { ChannelTags } from "./AgentTags";

const { DataTable, DataTableAvatar, Switch } = BDS;

const PAGE_SIZE = 10;

/** Table view of agents (wireframe screen 4). */
export function AgentTable({ agents }: { agents: Agent[] }) {
  const navigate = useNavigate();
  const { toggleAgent } = useAppStore();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(agents.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const rows = agents.slice(start, start + PAGE_SIZE);

  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <DataTable
          selectable
          columnToggle={false}
          rows={rows}
          onRowClick={(r: Agent) => navigate(`/agents/${r.id}/builder`)}
          columns={[
            { key: "name", header: "AI Agent name", sortable: true, width: 240, truncate: true, render: (r: Agent) => <span className="text-body-500-l text-foreground">{r.name}</span> },
            {
              key: "channels",
              header: "Channels",
              width: 190,
              render: (r: Agent) =>
                r.channels.length ? (
                  <span className="flex gap-1">
                    <ChannelTags channels={r.channels} max={2} />
                  </span>
                ) : (
                  <span className="text-gray-100">Not set</span>
                ),
            },
            { key: "createdBy", header: "Created by", sortable: true, render: (r: Agent) => <DataTableAvatar name={r.createdBy} /> },
            { key: "createdAt", header: "Created date", sortable: true, render: (r: Agent) => formatDate(r.createdAt) },
            { key: "updatedAt", header: "Last updated", sortable: true, render: (r: Agent) => formatDate(r.updatedAt) },
            {
              key: "active",
              header: "Status",
              sortable: true,
              render: (r: Agent) => (
                <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Switch checked={r.active} onCheckedChange={(v: boolean) => toggleAgent(r.id, v)} aria-label={`${r.name} active`} />
                  {r.active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ]}
          pagination={{
            page: current,
            pageCount,
            info: `Showing (${agents.length ? start + 1 : 0}-${start + rows.length}) of ${agents.length}`,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
