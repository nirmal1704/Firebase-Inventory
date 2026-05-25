import { Button } from './ui/Button'

const categoryColors = {
  Electronics: 'bg-sky/60',
  Clothing: 'bg-blush/60',
  'Food & pantry': 'bg-butter/70',
  Tools: 'bg-mint/60',
  Office: 'bg-lavender/60',
  Other: 'bg-cream',
}

export function ItemCard({ item, onEdit, onDelete }) {
  const isLowStock = item.quantity <= (item.minStock ?? 5)
  const dims =
    item.length || item.width || item.height
      ? `${item.length || '—'} × ${item.width || '—'} × ${item.height || '—'} ${item.dimensionUnit || 'cm'}`
      : null

  return (
    <article
      className={`cartoon-border wiggle-hover flex flex-col overflow-hidden rounded-2xl ${categoryColors[item.category] || categoryColors.Other}`}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="h-36 w-full border-b-2 border-ink object-cover"
        />
      ) : (
        <div className="flex h-28 items-center justify-center border-b-2 border-ink bg-white/40 text-4xl">
          📦
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">{item.name}</h3>
            {item.sku && (
              <p className="font-mono text-xs text-ink-soft">SKU: {item.sku}</p>
            )}
          </div>
          {isLowStock && (
            <span className="rounded-lg border-2 border-ink bg-coral px-2 py-0.5 font-display text-xs font-bold text-white">
              Low
            </span>
          )}
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm text-ink-soft">{item.description}</p>
        )}

        <ul className="space-y-1 text-sm text-ink">
          <li>
            <span className="font-semibold">Qty:</span> {item.quantity} {item.unit}
          </li>
          {item.weight && (
            <li>
              <span className="font-semibold">Weight:</span> {item.weight} {item.weightUnit}
            </li>
          )}
          {dims && (
            <li>
              <span className="font-semibold">Size:</span> {dims}
            </li>
          )}
          {item.location && (
            <li>
              <span className="font-semibold">Spot:</span> {item.location}
            </li>
          )}
        </ul>

        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="butter" size="sm" className="flex-1" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="coral" size="sm" className="flex-1" onClick={() => onDelete(item)}>
            Remove
          </Button>
        </div>
      </div>
    </article>
  )
}
