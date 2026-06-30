'use client'

import { useState, useRef } from 'react'
import type { MBTIType } from '@/types'
import ShareButtons from '@/components/ShareButtons'

const TABS = [
  { id: 'summary', label: '요약' },
  { id: 'strengths', label: '강점' },
  { id: 'weaknesses', label: '약점' },
  { id: 'careers', label: '추천직업' },
  { id: 'compat', label: '궁합' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ResultClient({ type }: { type: MBTIType }) {
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Share card (hidden, used for screenshot) */}
      <div
        ref={cardRef}
        className="fixed -left-[9999px] top-0 w-[540px] h-[540px] flex flex-col items-center justify-center text-white rounded-3xl p-10"
        style={{ background: `linear-gradient(135deg, ${type.color}, ${type.color}99)` }}
        aria-hidden
      >
        <p className="text-lg font-semibold opacity-80 mb-2">나의 MBTI 유형은</p>
        <p className="text-8xl font-black mb-3">{type.code}</p>
        <p className="text-3xl font-bold mb-2">{type.nickname}</p>
        <p className="text-lg opacity-80 mb-6">{type.tagline}</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {type.strengths.slice(0, 3).map((s) => (
            <span key={s} className="bg-white/25 rounded-full px-4 py-1 text-sm font-semibold">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-8 text-sm opacity-60">mymbti.vercel.app</p>
      </div>

      {/* Detail tabs */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-4 py-3.5 text-sm font-semibold transition-colors relative"
              style={activeTab === tab.id ? { color: type.color } : { color: '#9CA3AF' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 animate-fade-in" key={activeTab}>
          {activeTab === 'summary' && (
            <p className="text-gray-700 leading-relaxed text-base">{type.summary}</p>
          )}

          {activeTab === 'strengths' && (
            <ul className="space-y-2.5">
              {type.strengths.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
                  <span className="text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'weaknesses' && (
            <ul className="space-y-2.5">
              {type.weaknesses.map((w) => (
                <li key={w} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="text-gray-700">{w}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'careers' && (
            <div className="flex flex-wrap gap-2">
              {type.careers.map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: type.bgColor, color: type.color }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {activeTab === 'compat' && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-3">잘 맞는 유형</p>
                <div className="flex gap-2">
                  {type.compatibleTypes.map((t2) => (
                    <span
                      key={t2}
                      className="px-4 py-2 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: type.color }}
                    >
                      {t2}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-3">주의가 필요한 유형</p>
                <div className="flex gap-2">
                  {type.conflictTypes.map((t2) => (
                    <span
                      key={t2}
                      className="px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-600"
                    >
                      {t2}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share buttons */}
      <div className="mt-4">
        <ShareButtons type={type} shareCardRef={cardRef} />
      </div>
    </>
  )
}
