export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/85 px-8 py-5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-dim)]">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </div>
  );
}
