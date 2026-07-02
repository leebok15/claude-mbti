'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import type { MBTIType } from '@/types'
import typesData from '@/data/mbti-types.json'
import DimensionBar from '@/components/DimensionBar'
import ResultClient from './ResultClient'

const VALID_CODES = typesData.map((t) => t.code)

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const code = searchParams.get('type')?.toUpperCase()
  if (!code || !VALID_CODES.includes(code)) {
    if (typeof window !== 'undefined') router.replace('/')
    return null
  }

  const type = typesData.find((t) => t.code === code) as MBTIType

  const ei = parseInt(searchParams.get('ei') ?? '-1')
  const sn = parseInt(searchParams.get('sn') ?? '-1')
  const tf = parseInt(searchParams.get('tf') ?? '-1')
  const jp = parseInt(searchParams.get('jp') ?? '-1')
  const hasScores = [ei, sn, tf, jp].every((v) => v >= 0 && v <= 3)

  const eiPct = hasScores ? Math.round((ei / 3) * 100) : 50
  const snPct = hasScores ? Math.round((sn / 3) * 100) : 50
  const tfPct = hasScores ? Math.round((tf / 3) * 100) : 50
  const jpPct = hasScores ? Math.round((jp / 3) * 100) : 50

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

      {/* Hero */}
      <div className="px-8 py-14 border-b border-black/8 animate-fade-in">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/30 mb-6">
          Your Type
        </p>
        <div className="flex items-end gap-6 mb-5">
          <h1
            className="text-[clamp(5rem,20vw,9rem)] font-black leading-none tracking-tight"
            style={{ color: type.color }}
          >
            {type.code}
          </h1>
          <div className="pb-3">
            <p className="text-xl font-black text-black leading-tight">{type.nickname}</p>
            <p className="text-sm text-black/40 mt-1">{type.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-8">
        {/* Dimension Bars */}
        <div className="py-10 border-b border-black/8">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/30 mb-7">
            성격 척도
          </p>
          <DimensionBar leftLabel="E" rightLabel="I" leftPct={eiPct} color={type.color} />
          <DimensionBar leftLabel="S" rightLabel="N" leftPct={snPct} color={type.color} />
          <DimensionBar leftLabel="T" rightLabel="F" leftPct={tfPct} color={type.color} />
          <DimensionBar leftLabel="J" rightLabel="P" leftPct={jpPct} color={type.color} />
          {!hasScores && (
            <p className="text-xs text-black/30 mt-4">
              * 테스트를 완료하면 정확한 수치를 확인할 수 있어요
            </p>
          )}
        </div>

        {/* Detail tabs */}
        <div className="py-8">
          <ResultClient type={type} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/test"
            className="block w-full py-4 text-center border border-black/15 text-sm font-bold tracking-widest uppercase hover:border-black/50 transition-colors duration-200"
          >
            다시 테스트하기
          </Link>
          <Link
            href="/stats"
            className="block w-full py-4 text-center text-sm font-bold tracking-widest uppercase text-black/30 hover:text-black transition-colors duration-200"
          >
            전체 유형 통계 →
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  )
}
