import { useEffect } from 'react'

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="cartoon-border relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-cream p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="font-display text-xl font-bold text-ink sm:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cartoon-border-sm rounded-lg bg-blush px-3 py-1 font-display text-sm font-bold hover:bg-blush/80"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
