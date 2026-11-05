import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookText, Plus } from "lucide-react";
import { BDS } from "../../ds";
import { AGENT_TEMPLATES, type AgentTemplate } from "../../data/agentTemplates";
import { Canvas } from "../../builder/Canvas";
import { TemplateIcon, TemplateTags } from "../../components/templates/TemplateParts";

const { Button, Input, SearchIcon } = BDS;

export interface TemplateFilters {
  query: string;
  useCase: string;
  industry: string;
  category: string;
}

export const ALL = "all";

export function useTemplateFilters() {
  const [filters, setFilters] = useState<TemplateFilters>({ query: "", useCase: ALL, industry: ALL, category: ALL });
  const list = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return AGENT_TEMPLATES.filter(
      (t) =>
        (filters.useCase === ALL || t.useCase === filters.useCase) &&
        (filters.industry === ALL || t.industry === filters.industry) &&
        (filters.category === ALL || t.category === filters.category) &&
        (!q || `${t.title} ${t.description} ${t.tags.map((x) => x.label).join(" ")}`.toLowerCase().includes(q)),
    );
  }, [filters]);
  const set = (patch: Partial<TemplateFilters>) => setFilters((f) => ({ ...f, ...patch }));
  return { filters, set, list };
}

/** Page title row, as in the Figma: title, subtitle, Learn more, Create agent. */
export function TemplatesHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-h6-600 text-foreground">AI Agent Templates</h1>
        <p className="text-paragraph-400-m text-gray-100">Explore ready-to-use teammates for your business</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          <BookText data-icon="inline-start" />
          Learn more
        </Button>
        <Button size="sm" onClick={() => navigate("/agents/new")}>
          <Plus data-icon="inline-start" />
          Create agent
        </Button>
      </div>
    </div>
  );
}

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-[200px]">
      <SearchIcon className="text-gray-100 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search..." aria-label="Search templates" className="pl-8" />
    </div>
  );
}

export function TemplateCard({ t, onClick }: { t: AgentTemplate; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-xl border border-border bg-white p-4 text-left transition-all hover:shadow-sm"
    >
      <TemplateIcon icon={t.icon} />
      <span className="text-h6-600 text-foreground mt-1">{t.title}</span>
      <span className="text-paragraph-400-l text-gray-100 line-clamp-2">{t.description}</span>
      <span className="mt-auto pt-1">
        <TemplateTags tags={t.tags} />
      </span>
    </button>
  );
}

export function NoResults() {
  return (
    <div className="col-span-full py-16 text-center">
      <p className="text-body-500-xl text-foreground">No templates found</p>
      <p className="text-paragraph-400-l text-gray-100 mt-1">Try another filter or search term.</p>
    </div>
  );
}

/** Read-only flow of what the template builds. */
export function FlowPreview({ t, className = "" }: { t: AgentTemplate; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border ${className}`}>
      <Canvas key={t.id} preview agentName={t.title} answers={t.answers} ready highlight={[]} hidden={[]} run={null} />
    </div>
  );
}
