import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { MBTIType, MBTICode } from '@/types'
import typesData from '@/data/mbti-types.json'
import DimensionBar from '@/components/DimensionBar'
import ResultClient from './ResultClient'

const VALID_CODES = typesData.map((t) => t.code)

interface Props {
  searchParams: Promise<{
    type?: string
    ei?: string
    sn?: string
    tf?: string
    jp?: string
  }>
}

export async function generateStaticParams() {
  return VALID_CODES.map((code) => ({ type: code }))
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams
  const code = params.type?.toUpperCase()
  if (!code || !VALID_CODES.includes(code)) redirect('/')

  const type = typesData.find((t) => t.code === code) as MBTIType

  const ei = parseInt(params.ei ?? '-1')
  const sn = parseInt(params.sn ?? '-1')
  const tf = parseInt(params.tf ?? '-1')
  const jp = parseInt(params.jp ?? '-1')
  const hasScores = [ei, sn, tf, jp].every((v) => v >= 0 && v <= 3)

  const eiPct = hasScores ? Math.round((ei / 3) * 100) : 50
  const snPct = hasScores ? Math.round((sn / 3) * 100) : 50
  const tfPct = hasScores ? Math.round((tf / 3) * 100) : 50
  const jpPct = hasScores ? Math.round((jp / 3) * 100) : 50

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Hero */}
      <div
        className="w-full pt-12 pb-10 px-4 text-white text-center"
        style={{ background: `linear-gradient(135deg, ${type.color}ee, ${type.color}99)` }}
      >
        <p className="text-sm font-semibold opacity-80 mb-2 uppercase tracking-widest">
          당신의 유형은
        </p>
        <h1 className="text-7xl font-black mb-3 tracking-wide">{type.code}</h1>
        <p className="text-2xl font-bold mb-1">{type.nickname}</p>
        <p className="text-base opacity-80">{type.tagline}</p>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Dimension Bars */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mt-6 mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">
            성격 척도
          </h2>
          <DimensionBar leftLabel="E" rightLabel="I" leftPct={eiPct} color={type.color} />
          <DimensionBar leftLabel="S" rightLabel="N" leftPct={snPct} color={type.color} />
          <DimensionBar leftLabel="T" rightLabel="F" leftPct={tfPct} color={type.color} />
          <DimensionBar leftLabel="J" rightLabel="P" leftPct={jpPct} color={type.color} />
          {!hasScores && (
            <p className="text-xs text-gray-400 text-center mt-3">
              * 테스트를 완료하면 정확한 수치를 확인할 수 있어요
            </p>
          )}
        </div>

        {/* Tabs (client component) */}
        <ResultClient type={type} />

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/test"
            className="block w-full py-3.5 text-center rounded-2xl border-2 font-semibold transition-all hover:shadow-sm"
            style={{ borderColor: type.color, color: type.color }}
          >
            다시 테스트하기
          </Link>
          <Link
            href="/stats"
            className="block w-full py-3.5 text-center rounded-2xl bg-gray-100 font-semibold text-gray-600 hover:bg-gray-200 transition-all"
          >
            전체 유형 통계 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
