export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MBTICode =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export interface Question {
  id: number
  category: MBTIDimension
  text: string
  optionA: { text: string; value: 'E' | 'S' | 'T' | 'J' }
  optionB: { text: string; value: 'I' | 'N' | 'F' | 'P' }
}

export interface MBTIType {
  code: MBTICode
  nickname: string
  tagline: string
  summary: string
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  compatibleTypes: MBTICode[]
  conflictTypes: MBTICode[]
  color: string
  bgColor: string
}

export interface TestProgress {
  currentQuestion: number
  answers: Record<number, 'A' | 'B'>
  startedAt: string
}

export interface DimensionScores {
  ei: number  // E 답변 수 (0-3)
  sn: number  // S 답변 수 (0-3)
  tf: number  // T 답변 수 (0-3)
  jp: number  // J 답변 수 (0-3)
}

export interface Stats {
  type: MBTICode
  count: number
}
