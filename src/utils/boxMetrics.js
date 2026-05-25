const CATEGORY_BOX_COLORS = {
  Electronics: { front: '#87ceeb', side: '#6bb8e8', top: '#a8daf5' },
  Clothing: { front: '#ffb3ba', side: '#ff9aa5', top: '#ffc9ce' },
  'Food & pantry': { front: '#ffe566', side: '#f5d84d', top: '#fff099' },
  Tools: { front: '#a8e6cf', side: '#8fd9bd', top: '#c4f0dc' },
  Office: { front: '#d4b5ff', side: '#c19ef5', top: '#e8d4ff' },
  Other: { front: '#fff8e7', side: '#f0e6cc', top: '#fffdf5' },
}

export function getBoxColors(category) {
  return CATEGORY_BOX_COLORS[category] || CATEGORY_BOX_COLORS.Other
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function normalizeWeight(weight, unit = 'kg') {
  const w = Number(weight) || 0
  if (w <= 0) return 0
  switch (unit) {
    case 'g':
      return w / 1000
    case 'lb':
      return w * 0.453592
    case 'oz':
      return w * 0.0283495
    default:
      return w
  }
}

/** Scale factors for the 3D box from dimensions, weight, and stack count */
export function computeBoxMetrics({
  length,
  width,
  height,
  weight,
  weightUnit,
  quantity = 1,
}) {
  const l = Number(length) || 14
  const w = Number(width) || 14
  const h = Number(height) || 14
  const kg = normalizeWeight(weight, weightUnit)

  const scaleX = clamp(l / 28, 0.55, 1.85)
  const scaleY = clamp(h / 28, 0.55, 1.85)
  const scaleZ = clamp(w / 28, 0.55, 1.85)
  const weightBulge = clamp(1 + kg * 0.08, 1, 1.4)

  const qty = Math.max(1, Math.min(Number(quantity) || 1, 12))
  const displayStack = Math.min(qty, 8)
  const overflow = qty > 8 ? qty - 8 : 0

  return {
    scaleX,
    scaleY,
    scaleZ,
    weightBulge,
    stackCount: displayStack,
    overflow,
    totalQuantity: qty,
  }
}
