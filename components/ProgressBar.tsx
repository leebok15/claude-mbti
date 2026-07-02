interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">
          Question
        </span>
        <span className="text-xs font-bold text-black/40 tabular-nums">
          {current} <span className="text-black/20">/ {total}</span>
        </span>
      </div>
      <div className="h-px bg-black/10 w-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: '#F5E642' }}
        />
      </div>
    </div>
  )
}
