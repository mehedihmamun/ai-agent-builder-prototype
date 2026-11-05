import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BDS } from "../../ds";
import { CATEGORIES, INDUSTRIES, USE_CASES, type AgentTemplate } from "../../data/agentTemplates";
import { TemplateIcon, TemplateTags } from "../../components/templates/TemplateParts";
import { useTemplate } from "../../components/templates/useTemplate";
import { ALL, FlowPreview, NoResults, SearchBox, TemplateCard, TemplatesHeader, useTemplateFilters } from "./shared";

const { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = BDS;

function FilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto min-w-[120px]" aria-label={label}>
        <SelectValue>{value === ALL ? label : value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Details drawer that slides over the page from the right (Figma "template details"). */
function DetailsDrawer({ t, onClose }: { t: AgentTemplate; onClose: () => void }) {
  const use = useTemplate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={t.title}>
      <div className="fade-in absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="drawer-in absolute top-0 right-0 flex h-full w-[560px] max-w-full flex-col bg-white shadow-xl">
        <div className="flex items-start gap-3 px-8 pt-8 pb-2">
          <TemplateIcon icon={t.icon} size={28} />
          <h2 className="text-h3-600 text-foreground flex-1">{t.title}</h2>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-8 pb-8">
          <div>
            <h3 className="text-body-600-xl text-gray-100">About this template</h3>
            <div className="text-paragraph-400-l text-gray-100 mt-1 space-y-2">
              {t.about.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <TemplateTags tags={t.tags} size="md" />
          <FlowPreview t={t} className="h-[250px] bg-offwhite-60" />
        </div>
        <div className="flex gap-2 border-t border-border px-8 py-4">
          <Button onClick={() => use(t)}>Use this template</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </aside>
    </div>
  );
}

/** Version A — follows the Figma design: filter dropdowns, 4-column grid, details drawer over the page. */
export function FigmaVersion() {
  const { filters, set, list } = useTemplateFilters();
  const [open, setOpen] = useState<AgentTemplate | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="space-y-3 border-b border-border bg-white px-4 py-3">
        <TemplatesHeader />
        <div className="flex flex-wrap items-center gap-2">
          <SearchBox value={filters.query} onChange={(query) => set({ query })} />
          <FilterSelect label="Use case" options={USE_CASES} value={filters.useCase} onChange={(useCase) => set({ useCase })} />
          <FilterSelect label="Industry" options={INDUSTRIES} value={filters.industry} onChange={(industry) => set({ industry })} />
          <FilterSelect label="Category" options={CATEGORIES} value={filters.category} onChange={(category) => set({ category })} />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto bg-offwhite-40 p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {list.length ? list.map((t) => <TemplateCard key={t.id} t={t} onClick={() => setOpen(t)} />) : <NoResults />}
        </div>
      </div>
      {open && <DetailsDrawer t={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
