import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import products from '@/data/products.json'
import { upstashCmd, monthKey, POPULAR_TAG } from '@/lib/upstash'

export const dynamic = 'force-dynamic'

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

  await upstashCmd(['ZINCRBY', monthKey(), 1, productId])
  try {
    revalidateTag(POPULAR_TAG)
  } catch {
    // ignore
  }

  return NextResponse.redirect(product.url, 302)
}
