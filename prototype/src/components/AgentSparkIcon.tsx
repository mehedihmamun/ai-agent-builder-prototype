/** Chat bubble with a spark — the Agent Builder mark used in the wireframe. */
export function AgentSparkIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="24" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M11 25l-3 4v-4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 11.5l1.3 2.9 2.9 1.3-2.9 1.3L16 19.9l-1.3-2.9-2.9-1.3 2.9-1.3L16 11.5z" fill="currentColor" />
      <circle cx="16" cy="4" r="1.5" fill="currentColor" />
    </svg>
  );
}
