export function Input({ label, id, hint, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && (
        <span className="font-display text-sm font-semibold text-ink">{label}</span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border-2 border-ink bg-white/90 px-3 py-2.5 font-body text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/40 ${className}`}
        {...props}
      />
      {hint && <span className="font-hand text-lg text-ink-soft">{hint}</span>}
    </label>
  )
}

export function Textarea({ label, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && (
        <span className="font-display text-sm font-semibold text-ink">{label}</span>
      )}
      <textarea
        id={inputId}
        className="min-h-[88px] w-full resize-y rounded-xl border-2 border-ink bg-white/90 px-3 py-2.5 font-body text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/40"
        {...props}
      />
    </label>
  )
}

export function Select({ label, id, children, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && (
        <span className="font-display text-sm font-semibold text-ink">{label}</span>
      )}
      <select
        id={inputId}
        className="w-full rounded-xl border-2 border-ink bg-white/90 px-3 py-2.5 font-body text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/40"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
