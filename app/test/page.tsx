'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import QuestionCard from '@/components/QuestionCard'
import { useTestStore } from '@/store/testStore'
import { calculateMBTI } from '@/lib/calculateMBTI'
import type { Question } from '@/types'
import questionsData from '@/data/questions.json'

const questions = questionsData as Question[]
const TOTAL = questions.length

export default function TestPage() {
  const router = useRouter()
  const { answers, currentQuestion, setAnswer, next, prev, start, reset } = useTestStore()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (Object.keys(answers).length === 0) start()
  }, [])

  const question = questions[currentQuestion]
  const selected = answers[question?.id]

  const handleSelect = (value: 'A' | 'B') => {
    setAnswer(question.id, value)
    setShowError(false)
  }

  const handleNext = () => {
    if (!selected) { setShowError(true); return }
    setShowError(false)

    if (currentQuestion === TOTAL - 1) {
      const { code, scores } = calculateMBTI(answers, questions)
      fetch(`/api/stats/increment?type=${code}`, { method: 'POST' }).catch(() => {})
      router.push(`/result?type=${code}&ei=${scores.ei}&sn=${scores.sn}&tf=${scores.tf}&jp=${scores.jp}`)
      reset()
    } else {
      next()
    }
  }

  const handlePrev = () => { setShowError(false); prev() }

  if (!question) return null

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Header */}
      <header className="px-8 py-6 border-b border-black/8 sticky top-0 z-10" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="max-w-lg mx-auto">
          <ProgressBar current={currentQuestion + 1} total={TOTAL} />
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="max-w-lg mx-auto w-full">
          <QuestionCard
            key={question.id}
            question={question}
            selected={selected}
            onSelect={handleSelect}
          />

          {showError && (
            <p className="text-xs font-semibold text-black/40 mt-6 animate-fade-in tracking-wide">
              선택지를 골라주세요
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <footer className="px-8 py-6 border-t border-black/8" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3.5 border border-black/15 text-sm font-bold text-black/40 disabled:opacity-20 hover:border-black/50 hover:text-black transition-all duration-200 tracking-widest uppercase"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-colors duration-200 group"
          >
            {currentQuestion === TOTAL - 1 ? (
              '결과 보기'
            ) : (
              <span className="flex items-center justify-center gap-2">
                다음
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            )}
          </button>
        </div>
      </footer>
    </main>
  )
}
