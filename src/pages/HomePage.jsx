import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { StatsBar } from '../components/StatsBar'
import { SearchFilter } from '../components/SearchFilter'
import { ItemCard } from '../components/ItemCard'
import { ItemForm } from '../components/ItemForm'
import { Modal } from '../components/Modal'
import { PackAndShipModal } from '../components/PackAndShipModal'
import { Button } from '../components/ui/Button'
import { useInventory } from '../hooks/useInventory'
import { itemToForm } from '../utils/itemDefaults'

export function HomePage() {
  const {
    items,
    loading,
    error,
    addItem,
    editItem,
    removeItem,
    lowStockItems,
    totalQuantity,
  } = useInventory()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editItemState, setEditItemState] = useState(null)
  const [shipOpen, setShipOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      if (category && item.category !== category) return false
      if (!q) return true
      const haystack = [
        item.name,
        item.description,
        item.sku,
        item.location,
        item.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, search, category])

  async function handleAdd(data) {
    await addItem(data)
    setAddOpen(false)
  }

  async function handleEdit(data) {
    if (!editItemState) return
    await editItem(editItemState.id, data)
    setEditItemState(null)
  }

  async function handleDelete(item) {
    if (!window.confirm(`Remove "${item.name}" from your stash?`)) return
    await removeItem(item.id)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Header />

      <section className="mt-8 space-y-6">
        <StatsBar
          itemCount={items.length}
          totalQuantity={totalQuantity}
          lowStockCount={lowStockItems.length}
        />

        {lowStockItems.length > 0 && (
          <div className="cartoon-border rounded-2xl border-coral bg-blush/50 px-4 py-3">
            <p className="font-hand text-2xl text-ink">
              Heads up — {lowStockItems.length} item
              {lowStockItems.length === 1 ? '' : 's'} running low:{' '}
              <span className="font-display font-semibold">
                {lowStockItems.map((i) => i.name).join(', ')}
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
          />
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              variant="lavender"
              size="lg"
              onClick={() => setAddOpen(true)}
            >
              + Add item
            </Button>
            <Button
              variant="butter"
              size="lg"
              disabled={filtered.length === 0}
              onClick={() => setShipOpen(true)}
            >
              All done — pack & ship
            </Button>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border-2 border-ink bg-coral px-4 py-2 text-white" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-display text-center text-ink-soft">Fetching your shelves…</p>
        ) : filtered.length === 0 ? (
          <div className="cartoon-border rounded-2xl bg-mint/40 px-6 py-12 text-center">
            <p className="font-display text-xl font-bold text-ink">
              {items.length === 0 ? 'Your stash is empty — time to add something!' : 'No matches for that search.'}
            </p>
            <p className="mt-2 font-hand text-2xl text-ink-soft">
              {items.length === 0
                ? 'Tap the button above to stock your first shelf.'
                : 'Try different words or clear the filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-in">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={setEditItemState}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Stock a new item">
        <ItemForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} submitLabel="Add to stash" />
      </Modal>

      <Modal
        open={!!editItemState}
        onClose={() => setEditItemState(null)}
        title={`Edit ${editItemState?.name ?? 'item'}`}
      >
        {editItemState && (
          <ItemForm
            initial={itemToForm(editItemState)}
            onSubmit={handleEdit}
            onCancel={() => setEditItemState(null)}
            submitLabel="Update item"
          />
        )}
      </Modal>

      <PackAndShipModal
        open={shipOpen}
        onClose={() => setShipOpen(false)}
        items={filtered}
      />
    </div>
  )
}
