export default function LiveDataBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-green-400"
      title="Live data — synced across all devices"
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
      </span>
      Live
    </span>
  );
}
