'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import typesData from '@/data/mbti-types.json'

interface StatItem {
  type: string
  count: number
}

const colorMap: Record<string, string> = Object.fromEntries(
  typesData.map((t) => [t.code, t.color])
)

export default function StatsPage() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = stats.reduce((sum, s) => sum + s.count, 0)
  const top3 = stats.slice(0, 3)
  const maxCount = stats[0]?.count ?? 1

  return (
    <main className="min-h-screen pb-16" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-black/8">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/30">MyMBTI</span>
        <Link
          href="/"
          className="text-xs font-semibold tracking-widest uppercase text-black/30 hover:text-black transition-colors duration-200"
        >
          ← 홈
        </Link>
      </nav>

      {/* Header */}
      <div className="px-8 py-14 border-b border-black/8 animate-fade-in">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/30 mb-4">
          Statistics
        </p>
        <h1 className="text-5xl font-black tracking-tight text-black mb-3">
          유형 분포
        </h1>
        <p className="text-sm text-black/40">
          {total > 0 ? (
            <><span className="font-bold text-black">{total.toLocaleString()}명</span>이 참여했어요</>
          ) : '데이터를 불러오는 중입니다'}
        </p>
      </div>

      <div className="max-w-lg mx-auto px-8">
        {loading ? (
          <div className="py-24 text-center text-xs font-bold tracking-widest uppercase text-black/20">
            Loading...
          </div>
        ) : (
          <>
            {/* TOP 3 */}
            {top3.length > 0 && (
              <div className="py-10 border-b border-black/8">
                <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/30 mb-6">
                  Top 3
                </p>
                <div className="flex gap-3">
                  {top3.map((s, i) => {
                    const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : '0'
                    const sizes = ['text-5xl', 'text-4xl', 'text-3xl']
                    const ranks = ['01', '02', '03']
                    return (
                      <div key={s.type} className="flex-1 border border-black/8 p-4" style={{ backgroundColor: '#FDFCF8' }}>
                        <p className="text-xs font-bold text-black/20 mb-3 tracking-widest">{ranks[i]}</p>
                        <p
                          className={`${sizes[i]} font-black tracking-tight leading-none mb-2`}
                          style={{ color: colorMap[s.type] }}
                        >
                          {s.type}
                        </p>
                        <p className="text-sm font-bold text-black/40">{pct}%</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Full chart */}
            <div className="py-10">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/30 mb-6">
                전체 분포
              </p>
              <div className="space-y-4">
                {stats.map((s) => {
                  const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : '0'
                  const barW = maxCount > 0 ? (s.count / maxCount) * 100 : 0

                  return (
                    <div key={s.type} className="flex items-center gap-4">
                      <span className="w-10 text-xs font-black text-black/60 flex-shrink-0 tracking-wider">
                        {s.type}
                      </span>
                      <div className="flex-1 h-px bg-black/8 overflow-hidden relative">
                        <div
                          className="absolute top-1/2 left-0 -translate-y-1/2 h-2 transition-all duration-700"
                          style={{
                            width: `${barW}%`,
                            backgroundColor: '#F5E642',
                            minWidth: barW > 0 ? '4px' : 0,
                          }}
                        />
                      </div>
                      <span className="w-10 text-xs font-bold text-black/30 text-right flex-shrink-0 tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Link
              href="/test"
              className="group flex items-center justify-center gap-3 w-full py-4 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-colors duration-200"
            >
              테스트하기
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
