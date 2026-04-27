import products from '@/data/products.json'
import ProductCard from './ProductCard'

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

function monthKey(): string {
  const d = new Date()
  return `clicks:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function fetchTopIds(limit: number): Promise<number[]> {
  if (!KV_URL || !KV_TOKEN) return []
  try {
    const key = monthKey()
    const res = await fetch(
      `${KV_URL}/zrevrange/${encodeURIComponent(key)}/0/${limit - 1}`,
      {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        next: { revalidate: 600 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    const arr: unknown = data?.result
    if (!Array.isArray(arr)) return []
    return arr
      .map(s => Number(s))
      .filter((n): n is number => Number.isFinite(n))
  } catch {
    return []
  }
}

export default async function PopularProducts() {
  const ids = await fetchTopIds(10)
  const ranked = ids
    .map(id => products.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.published !== false)

  if (ranked.length < 10) {
    const have = new Set(ranked.map(p => p.id))
    for (const p of products) {
      if (ranked.length >= 10) break
      if (have.has(p.id)) continue
      if (p.published === false) continue
      ranked.push(p)
    }
  }

  if (ranked.length === 0) return null

  return (
    <section style={{ marginTop: '32px' }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        borderBottom: '1px solid #e8e8e8',
        paddingBottom: '8px',
        marginBottom: '0',
      }}>
        RANKING <span style={{ fontSize: '11px', color: '#888', fontWeight: 400, letterSpacing: '0.05em', marginLeft: '8px' }}>今月のランキング</span>
      </p>
      <div className="popular-scroller">
        {ranked.map((p, i) => (
          <div key={p.id} className="popular-item">
            <span className="popular-rank" style={{
              background: i < 3 ? '#e8735a' : 'rgba(0,0,0,0.78)',
            }}>
              {i + 1}
            </span>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <style>{`
        .popular-scroller {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 16px 4px 8px;
          margin: 0 -4px;
          scrollbar-width: thin;
        }
        .popular-scroller::-webkit-scrollbar { height: 6px; }
        .popular-scroller::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .popular-scroller::-webkit-scrollbar-track { background: transparent; }
        .popular-item {
          flex: 0 0 auto;
          width: 150px;
          scroll-snap-align: start;
          position: relative;
        }
        .popular-rank {
          position: absolute;
          top: 6px;
          left: 6px;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 3px;
          z-index: 2;
          letter-spacing: 0.05em;
        }
        @media (min-width: 768px) {
          .popular-item { width: 180px; }
        }
      `}</style>
    </section>
  )
}
