import type { Question, DimensionScores, MBTICode } from '@/types'

export function calculateMBTI(
  answers: Record<number, 'A' | 'B'>,
  questions: Question[]
): { code: MBTICode; scores: DimensionScores } {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  questions.forEach((q) => {
    const answer = answers[q.id]
    if (!answer) return
    if (answer === 'A') counts[q.optionA.value]++
    else counts[q.optionB.value]++
  })

  const code = [
    counts.E >= counts.I ? 'E' : 'I',
    counts.S >= counts.N ? 'S' : 'N',
    counts.T >= counts.F ? 'T' : 'F',
    counts.J >= counts.P ? 'J' : 'P',
  ].join('') as MBTICode

  return {
    code,
    scores: {
      ei: counts.E,
      sn: counts.S,
      tf: counts.T,
      jp: counts.J,
    },
  }
}

export function getDimensionPercent(score: number, total = 3) {
  return Math.round((score / total) * 100)
}
