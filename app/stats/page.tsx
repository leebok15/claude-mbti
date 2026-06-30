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
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white px-4 pt-10 pb-8 text-center">
        <Link href="/" className="inline-block text-white/70 hover:text-white text-sm mb-6 transition-colors">
          ← 홈으로
        </Link>
        <h1 className="text-3xl font-black mb-2">MBTI 유형 분포</h1>
        <p className="text-white/80 text-sm">
          지금까지{' '}
          <span className="font-bold text-white">{total.toLocaleString()}명</span>이 참여했어요
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400">통계를 불러오는 중...</div>
        ) : (
          <>
            {/* TOP 3 */}
            <div className="bg-white rounded-3xl shadow-sm p-6 mb-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                TOP 3 유형
              </h2>
              <div className="flex gap-3">
                {top3.map((s, i) => {
                  const color = colorMap[s.type] ?? '#7C3AED'
                  const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : '0'
                  const medals = ['🥇', '🥈', '🥉']
                  return (
                    <div
                      key={s.type}
                      className="flex-1 rounded-2xl p-4 text-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <div className="text-xl mb-1">{medals[i]}</div>
                      <div className="text-xl font-black">{s.type}</div>
                      <div className="text-sm opacity-80 font-semibold">{pct}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Full chart */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">
                전체 분포
              </h2>
              <div className="space-y-3">
                {stats.map((s) => {
                  const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : '0'
                  const barW = maxCount > 0 ? (s.count / maxCount) * 100 : 0
                  const color = colorMap[s.type] ?? '#7C3AED'

                  return (
                    <div key={s.type} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-bold text-gray-700 flex-shrink-0">
                        {s.type}
                      </span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                          style={{ width: `${barW}%`, backgroundColor: color, minWidth: barW > 0 ? '2rem' : 0 }}
                        />
                      </div>
                      <span className="w-12 text-xs font-semibold text-gray-500 text-right flex-shrink-0">
                        {pct}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Link
              href="/test"
              className="block w-full mt-6 py-4 text-center rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              나도 테스트하기 →
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
