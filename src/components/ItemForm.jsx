import { useState } from 'react'
import { CATEGORIES, UNITS, WEIGHT_UNITS, EMPTY_ITEM } from '../utils/itemDefaults'
import { Input, Textarea, Select } from './ui/Input'
import { Button } from './ui/Button'
import { InteractiveBox } from './InteractiveBox'

export function ItemForm({ initial = EMPTY_ITEM, onSubmit, onCancel, submitLabel = 'Save item' }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        quantity: Number(form.quantity) || 0,
        minStock: Number(form.minStock) || 0,
        weight: form.weight ? Number(form.weight) : null,
        length: form.length ? Number(form.length) : null,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="cartoon-border rounded-2xl bg-white/60 p-4">
        <p className="font-hand text-2xl text-ink-soft">Live box preview</p>
        <p className="mb-2 font-display text-xs text-ink-soft">
          Grows with size & weight · stacks when quantity goes up
        </p>
        <InteractiveBox
          category={form.category}
          length={form.length}
          width={form.width}
          height={form.height}
          weight={form.weight}
          weightUnit={form.weightUnit}
          quantity={form.quantity}
          label={form.name.trim() || 'Your item'}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Item name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Blue widget"
        />
        <Input
          label="SKU / code"
          value={form.sku}
          onChange={(e) => update('sku', e.target.value)}
          placeholder="Optional"
        />
      </div>

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
        placeholder="What is it? Notes, brand, etc."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="Quantity"
          type="number"
          min="0"
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
        />
        <Select label="Unit" value={form.unit} onChange={(e) => update('unit', e.target.value)}>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Weight"
          type="number"
          min="0"
          step="0.01"
          value={form.weight}
          onChange={(e) => update('weight', e.target.value)}
        />
        <Select
          label="Weight unit"
          value={form.weightUnit}
          onChange={(e) => update('weightUnit', e.target.value)}
        >
          {WEIGHT_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
        <Input
          label="Min stock alert"
          type="number"
          min="0"
          value={form.minStock}
          onChange={(e) => update('minStock', e.target.value)}
          hint="ping you when qty hits this"
        />
      </div>

      <fieldset className="rounded-xl border-2 border-dashed border-ink/40 p-4">
        <legend className="font-display px-2 text-sm font-semibold">Dimensions (L × W × H)</legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-4">
          <Input
            label="Length"
            type="number"
            min="0"
            value={form.length}
            onChange={(e) => update('length', e.target.value)}
          />
          <Input
            label="Width"
            type="number"
            min="0"
            value={form.width}
            onChange={(e) => update('width', e.target.value)}
          />
          <Input
            label="Height"
            type="number"
            min="0"
            value={form.height}
            onChange={(e) => update('height', e.target.value)}
          />
          <Input
            label="Unit"
            value={form.dimensionUnit}
            onChange={(e) => update('dimensionUnit', e.target.value)}
            placeholder="cm"
          />
        </div>
      </fieldset>

      <Input
        label="Storage location"
        value={form.location}
        onChange={(e) => update('location', e.target.value)}
        placeholder="Shelf A2, garage, etc."
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="mint" disabled={saving || !form.name.trim()}>
          {saving ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="cream" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
