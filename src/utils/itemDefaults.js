export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & pantry',
  'Tools',
  'Office',
  'Other',
]

export const UNITS = ['pcs', 'box', 'pack', 'kg', 'lb', 'L', 'mL']

export const WEIGHT_UNITS = ['g', 'kg', 'lb', 'oz']

export const EMPTY_ITEM = {
  name: '',
  description: '',
  category: 'Other',
  sku: '',
  quantity: 1,
  unit: 'pcs',
  weight: '',
  weightUnit: 'kg',
  length: '',
  width: '',
  height: '',
  dimensionUnit: 'cm',
  location: '',
  minStock: 5,
  imageUrl: '',
}

export function itemToForm(item) {
  if (!item) return { ...EMPTY_ITEM }
  return {
    name: item.name ?? '',
    description: item.description ?? '',
    category: item.category ?? 'Other',
    sku: item.sku ?? '',
    quantity: item.quantity ?? 1,
    unit: item.unit ?? 'pcs',
    weight: item.weight ?? '',
    weightUnit: item.weightUnit ?? 'kg',
    length: item.length ?? '',
    width: item.width ?? '',
    height: item.height ?? '',
    dimensionUnit: item.dimensionUnit ?? 'cm',
    location: item.location ?? '',
    minStock: item.minStock ?? 5,
    imageUrl: item.imageUrl ?? '',
  }
}
