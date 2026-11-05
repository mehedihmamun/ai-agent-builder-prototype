import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  Copy,
  Globe,
  LifeBuoy,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import { BDS } from "../../ds";
import { DAYS, DAY_LABEL, HOURS_PRESETS, TIMEZONES, type Answer, type DayHours, type Question } from "../script";

const { Button, Input, Textarea, Label, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, WhatsAppIcon } = BDS;

const ICON: Record<string, React.ReactNode> = {
  web: <Globe size={16} className="text-blue-90" />,
  whatsapp: <WhatsAppIcon width={16} height={16} />,
  email: <Mail size={16} className="text-red-80" />,
  sms: <MessageSquareText size={16} className="text-yellow-100" />,
  voice: <Phone size={16} className="text-navy-100" />,
  webpush: <Bell size={16} className="text-purple-100" />,
  shopify: <ShoppingBag size={16} className="text-green-100" />,
  woocommerce: <ShoppingCart size={16} className="text-purple-100" />,
  gcal: <CalendarDays size={16} className="text-blue-90" />,
  hubspot: <Users size={16} className="text-pitch-100" />,
  zendesk: <LifeBuoy size={16} className="text-green-100" />,
};

// ---------- Text fields (business details, greeting) ----------

/** Example details "read" from a website, for the demo. */
const FROM_WEBSITE = { name: "ShopEase", website: "shopease.com", about: "Online store for fashion & footwear, delivering across Bangladesh." };

export function FieldsInput({ q, value, onChange }: { q: Question; value?: Answer; onChange: (a: Answer) => void }) {
  const fields = value?.fields ?? {};
  const [reading, setReading] = useState(false);
  const set = (id: string, v: string) => onChange({ ids: [], fields: { ...fields, [id]: v } });
  const hasWebsite = q.fields?.some((f) => f.id === "website");

  const readWebsite = () => {
    setReading(true);
    window.setTimeout(() => {
      setReading(false);
      onChange({ ids: [], fields: { ...FROM_WEBSITE, ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v?.trim())) } });
    }, 1100);
  };

  return (
    <div className="space-y-3">
      {q.fields?.map((f) => (
        <div key={f.id} className="ds-field">
          <Label htmlFor={`f-${q.id}-${f.id}`}>
            {f.label}
            {f.required && <span className="text-red-90"> *</span>}
          </Label>
          {f.multiline ? (
            <Textarea id={`f-${q.id}-${f.id}`} value={fields[f.id] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.id, e.target.value)} className="min-h-[60px]" />
          ) : (
            <Input id={`f-${q.id}-${f.id}`} value={fields[f.id] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.id, e.target.value)} />
          )}
        </div>
      ))}
      {hasWebsite && (
        <Button variant="secondary" size="sm" onClick={readWebsite} disabled={reading}>
          {reading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
          {reading ? "Reading your website…" : "Fill from website"}
        </Button>
      )}
    </div>
  );
}

// ---------- Connect cards (channels, integrations) ----------

export function ConnectList({ q, value, onChange }: { q: Question; value?: Answer; onChange: (a: Answer) => void }) {
  const connected = value?.ids ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const finish = (id: string) => {
    setBusy(id);
    window.setTimeout(() => {
      setBusy(null);
      setOpen(null);
      onChange({ ids: [...connected.filter((x) => x !== id), id] });
    }, 1000);
  };
  const disconnect = (id: string) => onChange({ ids: connected.filter((x) => x !== id) });

  return (
    <div className="divide-y divide-offwhite-80 overflow-hidden rounded-lg border border-offwhite-80">
      {q.options.map((o) => {
        const on = connected.includes(o.id);
        const flow = o.connect;
        return (
          <div key={o.id} className={on ? "bg-green-10/40" : "bg-white"}>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-offwhite-80 bg-white">{ICON[o.id]}</span>
              <span className="min-w-0 flex-1">
                <span className="text-body-500-l text-foreground block">{o.label}</span>
                <span className="text-paragraph-400-m text-gray-100 block truncate">{o.description}</span>
              </span>
              {on ? (
                <span className="flex items-center gap-2">
                  <span className="text-body-500-m text-green-100 flex items-center gap-1">
                    <Check size={14} /> Connected
                  </span>
                  <button className="text-paragraph-400-m text-gray-100 hover:text-red-90 underline-offset-2 hover:underline" onClick={() => disconnect(o.id)}>
                    Disconnect
                  </button>
                </span>
              ) : open === o.id ? (
                <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>
                  Cancel
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setOpen(o.id)}>
                  Connect
                </Button>
              )}
            </div>

            {open === o.id && flow && !on && (
              <div className="space-y-2.5 border-t border-offwhite-80 bg-offwhite-20 px-3 py-3">
                <p className="text-paragraph-400-l text-gray-100">{flow.text}</p>
                {flow.type === "code" && (
                  <div className="relative rounded-md bg-black px-3 py-2.5 pr-10">
                    <code className="text-paragraph-400-m block font-mono break-all text-white">{flow.value}</code>
                    <button
                      aria-label="Copy code"
                      className="text-gray-40 absolute top-2 right-2 rounded-sm p-1 hover:text-white"
                      onClick={() => {
                        navigator.clipboard?.writeText(flow.value ?? "").catch(() => {});
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1200);
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
                {flow.type === "input" && (
                  <Input value={edits[o.id] ?? flow.value ?? ""} onChange={(e) => setEdits((s) => ({ ...s, [o.id]: e.target.value }))} aria-label={o.label} />
                )}
                {flow.type === "info" && (
                  <p className="text-body-500-l text-foreground rounded-md border border-offwhite-80 bg-white px-3 py-2 font-mono break-all">{flow.value}</p>
                )}
                <Button size="sm" onClick={() => finish(o.id)} disabled={busy === o.id}>
                  {busy === o.id && <Loader2 className="animate-spin" data-icon="inline-start" />}
                  {busy === o.id ? "Connecting…" : flow.cta}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Business hours ----------

export function HoursEditor({ value, onChange }: { value?: Answer; onChange: (a: Answer) => void }) {
  const hours = value?.hours ?? HOURS_PRESETS[0].hours;
  const tz = value?.tz ?? TIMEZONES[0];
  const preset = HOURS_PRESETS.find((p) => JSON.stringify(p.hours) === JSON.stringify(hours))?.id ?? "custom";
  const emit = (h: Record<string, DayHours>, t = tz) => {
    const match = HOURS_PRESETS.find((p) => JSON.stringify(p.hours) === JSON.stringify(h));
    onChange({ ids: [match?.id ?? "custom"], hours: h, tz: t });
  };
  const setDay = (d: string, patch: Partial<DayHours>) => emit({ ...hours, [d]: { ...hours[d], ...patch } });
  const time = "text-paragraph-400-l text-foreground h-7 w-[112px] rounded-sm border border-input bg-white px-1.5 disabled:text-gray-40";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {HOURS_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => emit(p.hours)}
            className={`text-body-500-m rounded-full border px-2.5 py-1 transition-colors ${
              preset === p.id ? "border-blue-60 bg-blue-20 text-blue-100" : "border-offwhite-80 bg-white text-gray-100 hover:border-blue-60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="divide-y divide-offwhite-80 rounded-lg border border-offwhite-80">
        {DAYS.map((d) => {
          const h = hours[d];
          return (
            <div key={d} className="flex items-center gap-3 px-3 py-1.5">
              <Switch checked={h.on} onCheckedChange={(v: boolean) => setDay(d, { on: v })} aria-label={`Open on ${DAY_LABEL[d]}`} />
              <span className={`text-body-500-l w-9 ${h.on ? "text-foreground" : "text-gray-40"}`}>{DAY_LABEL[d]}</span>
              {h.on ? (
                <span className="flex items-center gap-1.5">
                  <input type="time" className={time} value={h.from} onChange={(e) => setDay(d, { from: e.target.value })} aria-label={`${DAY_LABEL[d]} from`} />
                  <span className="text-gray-100">–</span>
                  <input type="time" className={time} value={h.to} onChange={(e) => setDay(d, { to: e.target.value })} aria-label={`${DAY_LABEL[d]} to`} />
                </span>
              ) : (
                <span className="text-paragraph-400-l text-gray-40">Closed</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="ds-field">
        <Label>Time zone</Label>
        <Select value={tz} onValueChange={(t: string) => emit(hours, t)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
