import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyMBTI — 나의 성격 유형 테스트',
  description: '12개의 질문으로 알아보는 나의 MBTI 성격 유형. 빠르고 정확한 테스트로 16가지 유형 중 당신의 유형을 찾아보세요.',
  openGraph: {
    title: 'MyMBTI — 나의 성격 유형 테스트',
    description: '12개의 질문으로 알아보는 나의 MBTI 성격 유형',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased" style={{ backgroundColor: '#F7F5F0', color: '#1A1A1A' }}>
        {children}
      </body>
    </html>
  )
}
