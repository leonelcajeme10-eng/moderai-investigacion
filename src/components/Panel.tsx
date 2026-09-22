import type { ReactNode } from 'react'
export function Panel({ title, subtitle, actions, children, className = '' }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>
    {(title || actions) && <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div>{title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}{subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}</div>{actions}</div>}
    {children}
  </section>
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">{children}</p>
}
