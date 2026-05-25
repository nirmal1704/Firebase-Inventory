import { Input, Select } from './ui/Input'
import { CATEGORIES } from '../utils/itemDefaults'

export function SearchFilter({ search, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="cartoon-border rounded-2xl bg-white/70 p-4">
      <p className="mb-3 font-hand text-2xl text-ink-soft">Find something in your stash</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name, SKU, location…"
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
