import { useEffect, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import {
  AlertTriangle,
  BrainCircuit,
  CalendarDays,
  Plug,
  CircleHelp,
  Clock,
  FileSpreadsheet,
  FolderOpen,
  Globe,
  Headset,
  Languages,
  MessageSquare,
  Minimize2,
  Minus,
  Plus,
  Redo2,
  ShoppingBag,
  Undo2,
  Wand2,
} from "lucide-react";
import { BDS } from "../ds";
import { canvasTools, channelsLabel, triggerFor, type Answers } from "./script";
import type { RunState } from "./useBuilder";

const { Button } = BDS;

type Status = "idle" | "running" | "done";

interface NodeData extends Record<string, unknown> {
  label: string;
  sub?: string;
  kind?: string;
  status: Status;
  glow: boolean;
  warning?: boolean;
  /** Order of appearance, for a staggered entrance. */
  index?: number;
  preview?: boolean;
}

/** Border + ring for a node: running (blue), just changed (green glow), ran (green), or its resting border. */
const frame = (d: NodeData, resting: string) =>
  d.status === "running"
    ? "border-blue-90 ring-3 ring-blue-40"
    : d.glow
      ? "border-green-90 ring-3 ring-green-40"
      : d.status === "done"
        ? "border-green-90"
        : resting;

const hidden = "!size-2 !min-w-0 !border-0 !bg-gray-60";

function TriggerNode({ data }: NodeProps<Node<NodeData>>) {
  return (
    <div className={`node-enter flex w-[210px] items-center gap-2.5 rounded-full border-2 bg-white py-1.5 pr-4 pl-1.5 shadow-sm transition-all ${frame(data, "border-green-80")}`}>
      <span className="flex size-9 items-center justify-center rounded-full bg-green-90 text-white">
        {data.label === "On schedule" ? <Clock size={18} /> : <MessageSquare size={18} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-body-500-l text-foreground block whitespace-nowrap">{data.label}</span>
        <span className="text-paragraph-400-s text-gray-100 block truncate">{data.sub ?? "Trigger"}</span>
      </span>
      {data.warning && <AlertTriangle size={14} className="text-red-90" aria-label="Setup not finished" />}
      <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-green-90" />
    </div>
  );
}

function AgentNode({ data }: NodeProps<Node<NodeData>>) {
  return (
    <div className={`node-enter relative w-[260px] rounded-xl border-2 bg-white shadow-sm transition-all ${frame(data, "border-green-80")}`}>
      <Handle type="target" position={Position.Left} className="!size-2 !border-0 !bg-green-90" />
      <div className="flex items-center gap-2.5 p-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-white">
          <BotGlyph />
        </span>
        <span className="min-w-0">
          <span className="text-body-500-l text-foreground block truncate">{data.label}</span>
          <span className="text-paragraph-400-s text-gray-100 block">AI Agent</span>
        </span>
      </div>
      <Handle id="model" type="source" position={Position.Bottom} style={{ left: "28%" }} className={hidden} />
      <Handle id="tools" type="source" position={Position.Bottom} style={{ left: "72%" }} className={hidden} />
      <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-gray-60" />
      <span className="text-paragraph-400-s text-gray-100 absolute top-full left-[28%] mt-1 -translate-x-1/2 whitespace-nowrap">
        Chat model<span className="text-red-90">*</span>
      </span>
      <span className="text-paragraph-400-s text-gray-100 absolute top-full left-[72%] mt-1 -translate-x-1/2">Tools</span>
      {!data.preview && (
        <span className="absolute top-1/2 -right-12 -translate-y-1/2">
          <AddButton label="Add next step" />
        </span>
      )}
    </div>
  );
}

const TOOL_ICON: Record<string, { icon: typeof Plus; className: string }> = {
  model: { icon: BrainCircuit, className: "text-black" },
  sheet: { icon: FileSpreadsheet, className: "text-green-90" },
  shop: { icon: ShoppingBag, className: "text-green-100" },
  drive: { icon: FolderOpen, className: "text-yellow-100" },
  web: { icon: Globe, className: "text-blue-90" },
  calendar: { icon: CalendarDays, className: "text-blue-90" },
  api: { icon: Plug, className: "text-purple-100" },
  clock: { icon: Clock, className: "text-navy-100" },
  handoff: { icon: Headset, className: "text-blue-90" },
};

function ToolNode({ data }: NodeProps<Node<NodeData>>) {
  const { icon: Icon, className } = TOOL_ICON[data.kind ?? "model"];
  return (
    <div className="node-enter flex w-[92px] flex-col items-center gap-1.5" style={{ animationDelay: `${(data.index ?? 0) * 180}ms` }}>
      <Handle type="target" position={Position.Top} className={hidden} />
      <span className={`flex size-14 items-center justify-center rounded-xl border-2 bg-white shadow-sm transition-all ${frame(data, "border-border")}`}>
        <Icon size={24} strokeWidth={1.75} className={className} />
      </span>
      <span className="text-paragraph-400-m text-gray-100 text-center leading-tight">{data.label}</span>
      {data.sub && <span className="text-paragraph-400-s text-gray-100 -mt-1 text-center">{data.sub}</span>}
    </div>
  );
}

function AddNode() {
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} className={hidden} />
      <AddButton label="Add tool" />
    </div>
  );
}

const nodeTypes = { trigger: TriggerNode, agent: AgentNode, tool: ToolNode, add: AddNode };

function AddButton({ label }: { label: string }) {
  return (
    <Button variant="add" size="icon-sm" aria-label={label} className="nodrag size-6 border border-gray-40">
      <Plus />
    </Button>
  );
}

function BotGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="8" width="16" height="11" rx="4" />
      <path d="M12 4v4M9 13h.01M15 13h.01" strokeLinecap="round" />
    </svg>
  );
}

export interface CanvasProps {
  agentName: string;
  answers: Answers;
  ready: boolean;
  highlight: string[];
  /** Steps that exist but are not shown yet (they appear when the assistant ticks them). */
  hidden: string[];
  run: RunState | null;
  /** Small read-only version, e.g. in template details. */
  preview?: boolean;
  /** Changes when the space around the canvas changes (right panel opened, closed, expanded), to re-fit once. */
  frameKey?: string;
}

function buildGraph({ agentName, answers, ready, highlight, hidden, run, preview }: CanvasProps) {
  const status = (id: string): Status => (run?.active === id ? "running" : run?.done.includes(id) ? "done" : "idle");
  const data = (id: string, extra: Partial<NodeData>): NodeData => ({ label: "", status: status(id), glow: highlight.includes(id), ...extra });

  const tools = canvasTools(answers);
  const handoff = (answers.handover?.ids.length ?? 0) > 0;
  const children = [
    { id: "model", data: data("model", { label: "OpenAI Chat Model", sub: "GPT-4o", kind: "model" }) },
    ...tools.map((t) => ({ id: t.id, data: data(t.id, { label: t.label, sub: t.sub, kind: t.kind }) })),
    ...(handoff ? [{ id: "handoff", data: data("handoff", { label: "Handover to team", kind: "handoff" }) }] : []),
  ].filter((c) => !hidden.includes(c.id));

  const nodes: Node[] = [
    { id: "trigger", type: "trigger", position: { x: 0, y: 8 }, data: data("trigger", { label: triggerFor(answers).label, sub: [triggerFor(answers).sub, answers.channels && channelsLabel(answers)].filter(Boolean).join(" · ") || undefined, warning: !ready }) },
    { id: "agent", type: "agent", position: { x: 290, y: 0 }, data: data("agent", { label: agentName, preview }) },
    ...children.map((c, i) => ({ id: c.id, type: "tool", position: { x: 210 + i * 110, y: 170 }, data: c.data })),
    ...(preview ? [] : [{ id: "add-tool", type: "add", position: { x: 245 + children.length * 110, y: 186 }, data: {} }]),
  ];

  const dashed = { stroke: "var(--gray-60)", strokeWidth: 1.5, strokeDasharray: "5 4" };
  const edges: Edge[] = [
    {
      id: "trigger-agent",
      source: "trigger",
      target: "agent",
      style: { stroke: "var(--green-90)", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--green-90)" },
      animated: status("agent") === "running",
    },
    ...children.map((c) => {
      const live = c.data.glow || c.data.status === "running";
      return {
        id: `agent-${c.id}`,
        source: "agent",
        sourceHandle: c.id === "model" ? "model" : "tools",
        target: c.id,
        type: "smoothstep",
        animated: live,
        style: live ? { ...dashed, stroke: "var(--green-80)" } : dashed,
      };
    }),
    ...(preview ? [] : [{ id: "agent-add", source: "agent", sourceHandle: "tools", target: "add-tool", type: "smoothstep", style: dashed }]),
  ];
  return { nodes, edges };
}

function Controls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const fit = () => fitView({ padding: 0.35, maxZoom: 1, duration: 300 });
  const tool = "text-gray-100 hover:bg-offwhite-60 flex size-8 items-center justify-center rounded-full";

  return (
    <>
      <Panel position="top-right" className="flex flex-col items-center gap-3">
        <button aria-label="Add a step" className="flex size-11 items-center justify-center rounded-full bg-black text-white shadow-md hover:bg-gray-100">
          <Plus size={20} />
        </button>
        <div className="flex flex-col items-center gap-1 rounded-full border border-border bg-white p-1 shadow-sm">
          <button aria-label="Tidy up layout" className={tool} onClick={fit}><Wand2 size={16} /></button>
          <button aria-label="Zoom in" className={tool} onClick={() => zoomIn({ duration: 150 })}><Plus size={16} /></button>
          <span className="text-paragraph-400-s text-gray-100">{Math.round(zoom * 100)}%</span>
          <button aria-label="Zoom out" className={tool} onClick={() => zoomOut({ duration: 150 })}><Minus size={16} /></button>
          <button aria-label="Fit to screen" className={tool} onClick={fit}><Minimize2 size={16} /></button>
          <button aria-label="Language" className={tool}><Languages size={16} /></button>
        </div>
      </Panel>
      <Panel position="bottom-left" className="flex items-center gap-1 rounded-lg border border-border bg-white p-1 shadow-sm">
        <button aria-label="Help" className={tool}><CircleHelp size={16} /></button>
        <span className="h-5 w-px bg-offwhite-100" />
        <button aria-label="Undo" className={tool}><Undo2 size={16} /></button>
        <button aria-label="Redo" className={tool}><Redo2 size={16} /></button>
      </Panel>
    </>
  );
}

function Flow(props: CanvasProps) {
  const { nodes, edges } = useMemo(() => buildGraph(props), [props]);
  const { fitView } = useReactFlow();

  // Re-frame the canvas when steps are added, once the new nodes have been measured.
  useEffect(() => {
    const t = window.setTimeout(() => fitView({ padding: props.preview ? 0.12 : 0.3, maxZoom: 1, duration: 400 }), 350);
    return () => clearTimeout(t);
  }, [nodes.length, fitView, props.preview, props.frameKey]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: props.preview ? 0.12 : 0.35, maxZoom: 1 }}
      nodesConnectable={false}
      nodesDraggable={!props.preview}
      elementsSelectable={!props.preview}
      panOnDrag={!props.preview}
      zoomOnScroll={!props.preview}
      zoomOnPinch={!props.preview}
      zoomOnDoubleClick={!props.preview}
      preventScrolling={!props.preview}
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
      maxZoom={2}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1.2} color="var(--gray-40)" />
      {!props.preview && <Controls />}
    </ReactFlow>
  );
}

/** Node canvas on the Builder tab (wireframe screen 6, left). Positions are fixed; the graph comes from the answers. */
export function Canvas(props: CanvasProps) {
  return (
    <div className="h-full w-full bg-offwhite-60">
      <ReactFlowProvider>
        <Flow {...props} />
      </ReactFlowProvider>
    </div>
  );
}
