import { useEffect, useMemo, useState } from 'react'
import { InteractiveBox } from './InteractiveBox'
import { Button } from './ui/Button'

const PHASES = ['idle', 'stack', 'pack', 'drive', 'done']

export function PackAndShipModal({ open, onClose, items }) {
  const [phase, setPhase] = useState('idle')

  const shipUnits = useMemo(() => {
    const units = []
    for (const item of items) {
      const count = Math.min(Math.max(Number(item.quantity) || 1, 1), 4)
      for (let i = 0; i < count; i++) {
        units.push({
          key: `${item.id}-${i}`,
          item,
        })
      }
    }
    return units.slice(0, 16)
  }, [items])

  useEffect(() => {
    if (!open) {
      setPhase('idle')
      return
    }
    setPhase('stack')
    const t1 = setTimeout(() => setPhase('pack'), 1400)
    const t2 = setTimeout(() => setPhase('drive'), 3200)
    const t3 = setTimeout(() => setPhase('done'), 5200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [open])

  if (!open) return null

  const statusText = {
    stack: 'Stacking your boxes…',
    pack: 'Packing everything up…',
    drive: 'Truck is rolling out!',
    done: 'All shipped — see you next haul!',
  }[phase]

  return (
    <div
      className="pack-ship-overlay fixed inset-0 z-[60] flex flex-col items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pack and ship animation"
    >
      <div className="pack-ship-backdrop absolute inset-0" onClick={phase === 'done' ? onClose : undefined} />

      <div className="pack-ship-stage cartoon-border relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-cream p-4 sm:p-6">
        <p className="text-center font-hand text-3xl text-ink">{statusText}</p>
        <p className="mb-4 text-center font-display text-sm text-ink-soft">
          {items.length} item type{items.length === 1 ? '' : 's'} ·{' '}
          {items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)} total units
        </p>

        <div className="pack-ship-scene relative mx-auto h-52 w-full max-w-lg sm:h-56">
          <div
            className={`pack-ship-truck absolute bottom-6 left-0 transition-transform duration-[2s] ease-in-out ${
              phase === 'drive' || phase === 'done' ? 'pack-ship-truck--gone' : ''
            }`}
          >
            <div className="truck-body">
              <div className="truck-cab" />
              <div
                className={`truck-bed transition-all duration-700 ${
                  phase === 'pack' || phase === 'drive' || phase === 'done' ? 'truck-bed--loaded' : ''
                }`}
              >
                <div
                  className={`truck-cargo flex flex-wrap items-end justify-center gap-0.5 p-1 transition-opacity duration-500 ${
                    phase === 'pack' || phase === 'drive' || phase === 'done'
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                >
                  {shipUnits.slice(0, 6).map((u) => (
                    <div key={u.key} className="scale-[0.35] origin-bottom">
                      <InteractiveBox
                        compact
                        category={u.item.category}
                        length={u.item.length}
                        width={u.item.width}
                        height={u.item.height}
                        weight={u.item.weight}
                        weightUnit={u.item.weightUnit}
                        quantity={1}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="truck-wheel truck-wheel--back" />
              <div className="truck-wheel truck-wheel--front" />
            </div>
          </div>

          <div
            className={`pack-ship-dock absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-wrap items-end justify-center gap-2 transition-all duration-700 ${
              phase === 'pack' || phase === 'drive' || phase === 'done'
                ? 'pack-ship-dock--packed pointer-events-none opacity-0'
                : 'opacity-100'
            }`}
          >
            {shipUnits.map((u, idx) => (
              <div
                key={u.key}
                className="pack-ship-box-enter transition-all duration-500"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="scale-[0.4] origin-bottom sm:scale-[0.45]">
                  <InteractiveBox
                    compact
                    category={u.item.category}
                    length={u.item.length}
                    width={u.item.width}
                    height={u.item.height}
                    weight={u.item.weight}
                    weightUnit={u.item.weightUnit}
                    quantity={1}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pack-ship-road absolute bottom-0 left-0 right-0 h-3 rounded-full bg-ink/15" />
        </div>

        <div className="mt-6 flex justify-center">
          {phase === 'done' ? (
            <Button variant="mint" onClick={onClose}>
              Back to stash
            </Button>
          ) : (
            <p className="font-hand text-xl text-ink-soft animate-pulse">Please wait…</p>
          )}
        </div>
      </div>
    </div>
  )
}
