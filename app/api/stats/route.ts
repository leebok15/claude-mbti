import { NextResponse } from 'next/server'
import { statsStore } from '@/lib/statsStore'

export const dynamic = 'force-static'

export function GET() {
  const data = Object.entries(statsStore).map(([type, count]) => ({ type, count }))
  data.sort((a, b) => b.count - a.count)
  return NextResponse.json(data)
}
