import Link from 'next/link'
import products from '@/data/products.json'
import categories from '@/data/categories.json'
import ProductGrid from '@/components/ProductGrid'

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  const m = a.length
  const n = b.length
  const dp: number[] = new Array(n + 1)
  for (let j = 0; j <= n; j++) dp[j] = j
  for (let i = 1; i <= m; i++) {
    let prevDiag = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prevDiag + cost)
      prevDiag = temp
    }
  }
  return dp[n]
}

function findSuggestions(query: string, candidates: string[], limit = 3): string[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  const maxDistance = Math.max(1, Math.floor(q.length / 3))
  const scored = candidates
    .filter(c => c)
    .map(c => ({ c, d: levenshtein(q, c.toLowerCase()) }))
    .filter(x => x.d > 0 && x.d <= maxDistance)
    .sort((a, b) => a.d - b.d)
  const seen = new Set<string>()
  const out: string[] = []
  for (const { c } of scored) {
    const key = c.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(c)
    if (out.length >= limit) break
  }
  return out
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: rawQ = '' } = await searchParams
  const q = rawQ.toLowerCase().trim()

  const results = q
    ? products.filter(p => {
        const cat = categories.find(c => c.id === p.category)
        const haystack = [
          p.name,
          p.brand || '',
          p.category,
          cat?.name || '',
          cat?.nameEn || '',
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    : []

  const suggestions =
    q && results.length === 0
      ? findSuggestions(rawQ, [
          ...products.map(p => p.name),
          ...products.map(p => p.brand || '').filter(Boolean),
          ...categories.map(c => c.name),
          ...categories.map(c => c.nameEn),
        ])
      : []

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', marginBottom: '4px' }}>
        SEARCH
      </p>
      <h1 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>
        {q ? <>「{rawQ}」 の検索結果 <span style={{ color: '#999', fontWeight: '400', fontSize: '13px' }}>({results.length}件)</span></> : 'キーワードを入力してください'}
      </h1>

      {q && results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#999', fontSize: '13px', marginBottom: '4px' }}>
            該当する商品が見つかりませんでした
          </p>
          {suggestions.length > 0 && (
            <div style={{ marginTop: '24px', borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>もしかして:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {suggestions.map(s => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    style={{
                      fontSize: '13px',
                      color: '#1a1a1a',
                      border: '1px solid #ddd',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      background: '#fff',
                    }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  )
}
