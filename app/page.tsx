import Link from 'next/link'
import { statsStore } from '@/lib/statsStore'

const ALL_TYPES = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
]

export default function Home() {
  const totalCount = Object.values(statsStore).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-black/8">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">MyMBTI</span>
        <Link
          href="/stats"
          className="text-xs font-semibold tracking-widest uppercase text-black/40 hover:text-black transition-colors duration-200"
        >
          통계
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center px-8 py-20 max-w-2xl mx-auto w-full animate-fade-in">
        {/* Label */}
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-black/40 mb-8">
          Personality Test · 12 Questions
        </p>

        {/* Title */}
        <h1 className="text-[clamp(3.5rem,12vw,7rem)] font-black leading-[0.9] tracking-tight text-black mb-8">
          당신은<br />
          어떤<br />
          <span
            className="inline-block px-3 -mx-1"
            style={{ backgroundColor: '#F5E642' }}
          >
            유형
          </span>
          인가요?
        </h1>

        {/* Sub */}
        <p className="text-base text-black/50 leading-relaxed mb-14 max-w-xs">
          단 12개의 질문으로 16가지 MBTI 유형 중<br />
          나의 성격 유형을 발견해보세요.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <Link
            href="/test"
            className="group inline-flex items-center gap-3 bg-black text-white font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-black/80 transition-colors duration-200"
          >
            테스트 시작
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          {totalCount > 0 && (
            <p className="text-xs text-black/40">
              {totalCount.toLocaleString()}명 참여
            </p>
          )}
        </div>
      </section>

      {/* Type ticker */}
      <footer className="border-t border-black/8 px-8 py-5 overflow-hidden">
        <div className="flex gap-3 flex-wrap opacity-20 select-none pointer-events-none">
          {ALL_TYPES.map((t) => (
            <span key={t} className="text-xs font-mono font-bold tracking-widest text-black">
              {t}
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}
