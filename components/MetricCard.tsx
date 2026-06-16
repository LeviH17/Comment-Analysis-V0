import type { ReactNode } from "react";
import { Info } from "lucide-react";

export function MetricCard({
  label,
  value,
  sparkline,
  hint,
  trailing,
  footer,
}: {
  label: string;
  value: ReactNode;
  sparkline?: ReactNode;
  hint?: string;
  trailing?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {hint && <Info className="h-3.5 w-3.5 text-zinc-300" aria-label={hint} />}
        </div>
        {trailing}
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</div>
        {sparkline}
      </div>
      {footer && (
        <div className="mt-3 border-t border-zinc-100 pt-3">{footer}</div>
      )}
    </div>
  );
}
