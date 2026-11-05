import { CHANNEL_LABEL, type Agent, type Channel } from "../data/agents";

/** One colour per channel (Figma "AI Agents" cards), all from design-system tokens. */
const CHANNEL_TONE: Record<Channel, string> = {
  web: "bg-blue-30 text-blue-100",
  whatsapp: "bg-green-20 text-green-100",
  webpush: "bg-purple-10 text-purple-100",
  sms: "bg-yellow-20 text-yellow-100",
  email: "bg-red-10 text-red-80",
  voice: "bg-navy-20 text-navy-100",
};

/** Inbound / Outbound, same tag shape as channels (Figma review: Outbound text is pitch-100). */
const DIRECTION_TONE: Record<Agent["direction"], string> = {
  Inbound: "bg-green-20 text-green-100",
  Outbound: "bg-pitch-20 text-pitch-100",
};

const tag = "text-body-500-s inline-flex h-5 items-center rounded-sm px-1.5 whitespace-nowrap";

/** Channel tags; after `max` tags the rest collapse into "+N" (full list on hover). */
export function ChannelTags({ channels, max = 3 }: { channels: Channel[]; max?: number }) {
  const shown = channels.slice(0, max);
  const rest = channels.slice(max);
  return (
    <>
      {shown.map((c) => (
        <span key={c} className={`${tag} ${CHANNEL_TONE[c]}`}>
          {CHANNEL_LABEL[c]}
        </span>
      ))}
      {rest.length > 0 && (
        <span className={`${tag} bg-offwhite-80 text-gray-100`} title={rest.map((c) => CHANNEL_LABEL[c]).join(", ")}>
          +{rest.length}
        </span>
      )}
    </>
  );
}

/** Direction + channel tags ("Inbound" · "Website chat" · "WhatsApp"). */
export function AgentTags({ direction, channels, max }: Pick<Agent, "direction" | "channels"> & { max?: number }) {
  return (
    <div className="flex flex-wrap gap-1">
      <span className={`${tag} ${DIRECTION_TONE[direction]}`}>{direction}</span>
      <ChannelTags channels={channels} max={max} />
    </div>
  );
}
