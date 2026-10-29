export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-stencil text-2xl font-semibold uppercase tracking-wide text-text">{title}</h1>
      {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
    </div>
  );
}
