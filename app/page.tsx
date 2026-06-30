import Link from 'next/link'
import { statsStore } from '@/lib/statsStore'

export default function Home() {
  const totalCount = Object.values(statsStore).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      <div className="w-full max-w-sm text-center text-white animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 text-sm font-medium">
          <span>✨</span>
          <span>12문항으로 알아보는 나의 성격</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black mb-3 tracking-tight">
          My<span className="text-yellow-300">MBTI</span>
        </h1>
        <p className="text-2xl font-bold mb-4">당신은 어떤 유형인가요?</p>
        <p className="text-white/80 text-base mb-10 leading-relaxed">
          단 12개의 질문으로 16가지 MBTI 유형 중<br />
          나의 성격 유형을 발견해보세요
        </p>

        {/* CTA */}
        <Link
          href="/test"
          className="block w-full bg-white text-purple-700 font-bold text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-6"
        >
          테스트 시작하기 →
        </Link>

        {/* Stats */}
        <p className="text-white/60 text-sm">
          지금까지{' '}
          <span className="text-white font-semibold">
            {totalCount.toLocaleString()}명
          </span>
          이 테스트를 완료했어요
        </p>

        {/* Stats link */}
        <Link
          href="/stats"
          className="inline-block mt-4 text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          유형 분포 통계 보기
        </Link>
      </div>

      {/* Type badges decoration */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2 flex-wrap px-4 opacity-30 pointer-events-none select-none">
        {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
          'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map((t) => (
          <span key={t} className="text-white text-xs font-mono bg-white/20 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
    </main>
  )
}
