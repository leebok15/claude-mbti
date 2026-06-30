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
    // Start fresh if no answers yet
    if (Object.keys(answers).length === 0) start()
  }, [])

  const question = questions[currentQuestion]
  const selected = answers[question?.id]

  const handleSelect = (value: 'A' | 'B') => {
    setAnswer(question.id, value)
    setShowError(false)
  }

  const handleNext = () => {
    if (!selected) {
      setShowError(true)
      return
    }
    setShowError(false)

    if (currentQuestion === TOTAL - 1) {
      // Calculate result
      const { code, scores } = calculateMBTI(answers, questions)
      // Increment stats
      fetch(`/api/stats/increment?type=${code}`, { method: 'POST' }).catch(() => {})
      router.push(
        `/result?type=${code}&ei=${scores.ei}&sn=${scores.sn}&tf=${scores.tf}&jp=${scores.jp}`
      )
      reset()
    } else {
      next()
    }
  }

  const handlePrev = () => {
    setShowError(false)
    prev()
  }

  if (!question) return null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <ProgressBar current={currentQuestion + 1} total={TOTAL} />
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-lg mx-auto w-full">
          <div className="mb-6 text-center">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              Question {currentQuestion + 1}
            </span>
          </div>

          <QuestionCard
            key={question.id}
            question={question}
            selected={selected}
            onSelect={handleSelect}
          />

          {/* Error message */}
          {showError && (
            <p className="text-center text-red-500 text-sm mt-4 animate-fade-in">
              선택지를 골라주세요 😊
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <footer className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 font-semibold text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-all"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {currentQuestion === TOTAL - 1 ? '결과 보기 ✨' : '다음 →'}
          </button>
        </div>
      </footer>
    </main>
  )
}
