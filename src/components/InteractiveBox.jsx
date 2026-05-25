import { useMemo } from 'react'
import { computeBoxMetrics, getBoxColors } from '../utils/boxMetrics'

const BASE = 44

export function InteractiveBox({
  length,
  width,
  height,
  weight,
  weightUnit,
  quantity = 1,
  category = 'Other',
  label,
  compact = false,
  className = '',
}) {
  const metrics = useMemo(
    () =>
      computeBoxMetrics({
        length,
        width,
        height,
        weight,
        weightUnit,
        quantity,
      }),
    [length, width, height, weight, weightUnit, quantity],
  )

  const colors = getBoxColors(category)
  const boxW = BASE * metrics.scaleX * metrics.weightBulge
  const boxH = BASE * metrics.scaleY * metrics.weightBulge
  const boxD = BASE * metrics.scaleZ * 0.75

  const sceneH = compact
    ? 100 + metrics.stackCount * 10
    : 120 + metrics.stackCount * 14

  return (
    <div
      className={`flex flex-col items-center justify-end ${className}`}
      style={{ minHeight: sceneH }}
      aria-hidden={!label}
    >
      <div
        className="relative flex flex-col items-center justify-end transition-all duration-300 ease-out"
        style={{ width: boxW + 24, height: sceneH }}
      >
        {Array.from({ length: metrics.stackCount }).map((_, i) => {
          const offset = i * (compact ? 8 : 11)
          const stackScale = 1 - i * 0.03
          return (
            <div
              key={i}
              className="interactive-box-3d absolute bottom-0 transition-all duration-300 ease-out"
              style={{
                width: boxW,
                height: boxH,
                transform: `translateY(-${offset}px) scale(${stackScale})`,
                zIndex: i,
                ['--box-front']: colors.front,
                ['--box-side']: colors.side,
                ['--box-top']: colors.top,
                ['--box-depth']: `${boxD}px`,
              }}
            >
              <div className="box-face box-face--front" />
              <div className="box-face box-face--back" />
              <div className="box-face box-face--right" />
              <div className="box-face box-face--left" />
              <div className="box-face box-face--top" />
              <div className="box-face box-face--bottom" />
            </div>
          )
        })}
        {metrics.overflow > 0 && (
          <span className="absolute -top-1 right-0 rounded-lg border-2 border-ink bg-butter px-1.5 py-0.5 font-display text-xs font-bold text-ink">
            +{metrics.overflow}
          </span>
        )}
      </div>
      {label && (
        <p className="mt-2 text-center font-hand text-lg text-ink-soft">{label}</p>
      )}
      {!compact && metrics.totalQuantity > 1 && (
        <p className="font-display text-xs font-semibold text-ink">
          {metrics.totalQuantity} stacked
        </p>
      )}
    </div>
  )
}
