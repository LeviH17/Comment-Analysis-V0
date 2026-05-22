import type { ReactNode } from "react";

export function PageShell({
  breadcrumb,
  title,
  subtitle,
  actions,
  children,
}: {
  breadcrumb?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="px-8 pt-6">
        {breadcrumb && (
          <div className="mb-3 text-sm text-zinc-500">{breadcrumb}</div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
      <div className="px-8 pt-6 pb-12">{children}</div>
    </div>
  );
}
