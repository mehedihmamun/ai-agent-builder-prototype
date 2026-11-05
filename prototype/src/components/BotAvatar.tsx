/** Avatar styles an agent can pick in Settings ("Change avatar"). Colors are design-system tokens. */
export const AVATARS: { id: string; label: string; bg: string; face: string; eye: string; ring: string }[] = [
  { id: "classic", label: "Classic", bg: "var(--offwhite-60)", face: "var(--black)", eye: "var(--blue-40)", ring: "var(--blue-60)" },
  { id: "blue", label: "Blue", bg: "var(--blue-90)", face: "var(--white)", eye: "var(--blue-90)", ring: "var(--blue-40)" },
  { id: "purple", label: "Purple", bg: "var(--purple-100)", face: "var(--white)", eye: "var(--purple-100)", ring: "var(--purple-40)" },
  { id: "green", label: "Green", bg: "var(--green-90)", face: "var(--white)", eye: "var(--green-100)", ring: "var(--green-40)" },
  { id: "pitch", label: "Pitch", bg: "var(--pitch-100)", face: "var(--white)", eye: "var(--pitch-100)", ring: "var(--pitch-20)" },
  { id: "navy", label: "Navy", bg: "var(--navy-100)", face: "var(--white)", eye: "var(--navy-100)", ring: "var(--navy-40)" },
];

/** Robot-head avatar used on agent cards and in Settings. */
export function BotAvatar({ size = 40, avatar = "classic" }: { size?: number; avatar?: string }) {
  const a = AVATARS.find((x) => x.id === avatar) ?? AVATARS[0];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <circle cx="20" cy="20" r="19" fill={a.bg} />
      <rect x="7" y="10" width="26" height="20" rx="10" fill={a.face} />
      <rect x="7" y="10" width="26" height="20" rx="10" fill="none" stroke={a.ring} strokeWidth="1.5" />
      <ellipse cx="15.5" cy="20" rx="2.6" ry="3.4" fill={a.eye} />
      <ellipse cx="24.5" cy="20" rx="2.6" ry="3.4" fill={a.eye} />
    </svg>
  );
}
