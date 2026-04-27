import { NextRequest, NextResponse } from 'next/server'
import products from '@/data/products.json'

export const dynamic = 'force-dynamic'

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

function monthKey(): string {
  const d = new Date()
  return `clicks:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function trackClick(productId: number): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  const key = monthKey()
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 1500)
    await fetch(
      `${KV_URL}/zincrby/${encodeURIComponent(key)}/1/${productId}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        signal: ctrl.signal,
        cache: 'no-store',
      }
    )
    clearTimeout(timer)
  } catch {
    // 計測失敗時はサイレントにフォールスルー（ユーザーのリダイレクトを止めない）
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = Number(id)
  const product = products.find(p => p.id === productId)

  if (!product) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  await trackClick(productId)

  return NextResponse.redirect(product.url, 302)
}
