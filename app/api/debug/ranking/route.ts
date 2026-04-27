import { NextResponse } from 'next/server'
import { upstashCmd, monthKey, upstashConfigured } from '@/lib/upstash'

export const dynamic = 'force-dynamic'

export async function GET() {
  const key = monthKey()
  const raw = await upstashCmd(['ZREVRANGE', key, 0, -1, 'WITHSCORES'])

  const detected = Object.keys(process.env)
    .filter(k => /KV|REDIS|UPSTASH/i.test(k))
    .sort()

  return NextResponse.json({
    envOk: upstashConfigured(),
    key,
    raw,
    detectedEnvKeys: detected,
    KV_REST_API_URL_set: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN_set: !!process.env.KV_REST_API_TOKEN,
    note: 'raw is [id1, score1, id2, score2, ...] sorted by descending score',
  })
}
