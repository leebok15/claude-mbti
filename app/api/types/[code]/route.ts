import { NextResponse } from 'next/server'
import types from '@/data/mbti-types.json'

const VALID_CODES = types.map((t) => t.code)

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params
  const code = rawCode.toUpperCase()
  if (!VALID_CODES.includes(code)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }
  const type = types.find((t) => t.code === code)
  return NextResponse.json(type)
}
