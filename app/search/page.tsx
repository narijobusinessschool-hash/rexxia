import products from '@/data/products.json'
import categories from '@/data/categories.json'
import ProductGrid from '@/components/ProductGrid'

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <p style={{ fontSize: '11px', color: '#888', letterSpacing: '0.15em', marginBottom: '4px' }}>
        SEARCH
      </p>
      <h1 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>
        {q ? <>「{rawQ}」 の検索結果 <span style={{ color: '#999', fontWeight: '400', fontSize: '13px' }}>({results.length}件)</span></> : 'キーワードを入力してください'}
      </h1>

      {q && results.length === 0 ? (
        <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '60px 0' }}>
          該当する商品が見つかりませんでした
        </p>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  )
}
