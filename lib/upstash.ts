const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

export const POPULAR_TAG = 'popular-products'

export function monthKey(): string {
  const d = new Date()
  return `clicks:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export function upstashConfigured(): boolean {
  return !!(KV_URL && KV_TOKEN)
}

export async function upstashCmd(args: Array<string | number>): Promise<unknown> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 2000)
    const res = await fetch(KV_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args.map(String)),
      cache: 'no-store',
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const json = await res.json().catch(() => null)
    if (json && typeof json === 'object' && 'result' in json) {
      return (json as { result: unknown }).result
    }
    return null
  } catch {
    return null
  }
}
