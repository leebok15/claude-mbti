interface Props {
  leftLabel: string
  rightLabel: string
  leftPct: number  // 0-100 (left side percentage)
  color: string
}

export default function DimensionBar({ leftLabel, rightLabel, leftPct, color }: Props) {
  const rightPct = 100 - leftPct
  const dominantSide = leftPct >= 50 ? 'left' : 'right'
  const dominantPct = dominantSide === 'left' ? leftPct : rightPct

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-sm font-semibold ${leftPct >= 50 ? 'text-gray-900' : 'text-gray-400'}`}>
          {leftLabel}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full`}
          style={{ backgroundColor: `${color}20`, color }}>
          {dominantSide === 'left' ? leftLabel : rightLabel} {dominantPct}%
        </span>
        <span className={`text-sm font-semibold ${rightPct > 50 ? 'text-gray-900' : 'text-gray-400'}`}>
          {rightLabel}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${leftPct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
