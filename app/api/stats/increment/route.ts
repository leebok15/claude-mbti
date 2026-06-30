import { NextResponse } from 'next/server'
import { statsStore, VALID_CODES } from '@/lib/statsStore'

export const dynamic = 'force-static'

export function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')?.toUpperCase()

  if (!type || !VALID_CODES.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  statsStore[type] = (statsStore[type] ?? 0) + 1
  return NextResponse.json({ type, count: statsStore[type] })
}
