import { NextResponse } from 'next/server'
import { upstashCmd, monthKey, upstashConfigured } from '@/lib/upstash'

export const dynamic = 'force-dynamic'

export async function GET() {
  const key = monthKey()
  const raw = await upstashCmd(['ZREVRANGE', key, 0, -1, 'WITHSCORES'])

  return NextResponse.json({
    envOk: upstashConfigured(),
    key,
    raw,
    note: 'raw is [id1, score1, id2, score2, ...] sorted by descending score',
  })
}
