'use client'

import { useState, useRef } from 'react'
import type { MBTIType } from '@/types'
import ShareButtons from '@/components/ShareButtons'

const TABS = [
  { id: 'summary', label: '요약' },
  { id: 'strengths', label: '강점' },
  { id: 'weaknesses', label: '약점' },
  { id: 'careers', label: '직업' },
  { id: 'compat', label: '궁합' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ResultClient({ type }: { type: MBTIType }) {
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Share card (hidden, for screenshot) */}
      <div
        ref={cardRef}
        className="fixed -left-[9999px] top-0 w-[540px] h-[540px] flex flex-col items-center justify-center rounded-none p-12"
        style={{ backgroundColor: '#F7F5F0' }}
        aria-hidden
      >
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/40 mb-6">
          My MBTI Type
        </p>
        <p
          className="text-9xl font-black tracking-tight mb-3"
          style={{ color: type.color }}
        >
          {type.code}
        </p>
        <p className="text-2xl font-bold text-black mb-2">{type.nickname}</p>
        <p className="text-sm text-black/50 mb-8">{type.tagline}</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {type.strengths.slice(0, 3).map((s) => (
            <span key={s} className="px-3 py-1 text-xs font-bold tracking-wide border border-black/15 text-black/60">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-10 text-xs font-mono text-black/20 tracking-widest">mymbti.vercel.app</p>
      </div>

      {/* Tabs */}
      <div className="border border-black/8" style={{ backgroundColor: '#FDFCF8' }}>
        {/* Tab nav */}
        <div className="flex border-b border-black/8 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-5 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors relative"
              style={
                activeTab === tab.id
                  ? { color: '#1A1A1A' }
                  : { color: 'rgba(26,26,26,0.3)' }
              }
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#F5E642' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 min-h-[140px] animate-fade-in" key={activeTab}>
          {activeTab === 'summary' && (
            <p className="text-base text-black/70 leading-relaxed">{type.summary}</p>
          )}

          {activeTab === 'strengths' && (
            <ul className="space-y-3">
              {type.strengths.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-black/30 flex-shrink-0" />
                  <span className="text-sm font-medium text-black/70">{s}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'weaknesses' && (
            <ul className="space-y-3">
              {type.weaknesses.map((w) => (
                <li key={w} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />
                  <span className="text-sm font-medium text-black/50">{w}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'careers' && (
            <div className="flex flex-wrap gap-2">
              {type.careers.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 text-sm font-semibold border border-black/10 text-black/60"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {activeTab === 'compat' && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-black/30 mb-3">잘 맞는 유형</p>
                <div className="flex gap-2 flex-wrap">
                  {type.compatibleTypes.map((t2) => (
                    <span
                      key={t2}
                      className="px-3 py-1.5 text-sm font-black tracking-wider"
                      style={{ backgroundColor: '#F5E642', color: '#1A1A1A' }}
                    >
                      {t2}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-black/30 mb-3">주의가 필요한 유형</p>
                <div className="flex gap-2 flex-wrap">
                  {type.conflictTypes.map((t2) => (
                    <span
                      key={t2}
                      className="px-3 py-1.5 text-sm font-black tracking-wider border border-black/10 text-black/40"
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

      {/* Share */}
      <div className="mt-4">
        <ShareButtons type={type} shareCardRef={cardRef} />
      </div>
    </>
  )
}
