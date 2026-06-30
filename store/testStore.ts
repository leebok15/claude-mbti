'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TestStore {
  answers: Record<number, 'A' | 'B'>
  currentQuestion: number
  startedAt: string | null
  setAnswer: (id: number, value: 'A' | 'B') => void
  next: () => void
  prev: () => void
  reset: () => void
  start: () => void
}

export const useTestStore = create<TestStore>()(
  persist(
    (set) => ({
      answers: {},
      currentQuestion: 0,
      startedAt: null,

      setAnswer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),

      next: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),
      prev: () =>
        set((s) => ({
          currentQuestion: Math.max(0, s.currentQuestion - 1),
        })),

      reset: () =>
        set({ answers: {}, currentQuestion: 0, startedAt: null }),

      start: () =>
        set({ answers: {}, currentQuestion: 0, startedAt: new Date().toISOString() }),
    }),
    { name: 'mbti-test-progress' }
  )
)
