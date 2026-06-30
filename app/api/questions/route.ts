import { NextResponse } from 'next/server'
import questions from '@/data/questions.json'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(questions)
}
