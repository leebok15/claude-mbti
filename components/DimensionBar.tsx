interface Props {
  leftLabel: string
  rightLabel: string
  leftPct: number
  color: string
}

export default function DimensionBar({ leftLabel, rightLabel, leftPct }: Props) {
  const rightPct = 100 - leftPct
  const dominantSide = leftPct >= 50 ? 'left' : 'right'
  const dominantPct = dominantSide === 'left' ? leftPct : rightPct

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className={`text-sm font-black tracking-widest ${leftPct >= 50 ? 'text-black' : 'text-black/25'}`}>
          {leftLabel}
        </span>
        <span className="text-xs font-bold text-black/40 tabular-nums">
          {dominantSide === 'left' ? leftLabel : rightLabel} {dominantPct}%
        </span>
        <span className={`text-sm font-black tracking-widest ${rightPct > 50 ? 'text-black' : 'text-black/25'}`}>
          {rightLabel}
        </span>
      </div>
      <div className="h-px bg-black/10 w-full overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${leftPct}%`, backgroundColor: '#F5E642' }}
        />
      </div>
    </div>
  )
}
