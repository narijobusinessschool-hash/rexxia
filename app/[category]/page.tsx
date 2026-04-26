import { notFound } from 'next/navigation'
import products from '@/data/products.json'
import categories from '@/data/categories.json'
import ProductGrid from '@/components/ProductGrid'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return categories.map(cat => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = categories.find(c => c.slug === params.category)
  if (!category) return {}
  return {
    title: `${category.name} | REXXIA`,
    description: `キャンプ用品の${category.name}を厳選して紹介。Amazonで購入できるおすすめギアをまとめました。`,
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find(c => c.slug === params.category)
  if (!category) notFound()

  const categoryProducts = products.filter(p => p.category === params.category)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', marginBottom: '4px' }}>
        REXXIA
      </p>
      <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
        {category.name}
      </h1>
      <div style={{ width: '30px', height: '2px', background: '#e8735a', marginBottom: '24px' }}></div>

      {categoryProducts.length > 0 ? (
        <ProductGrid products={categoryProducts} />
      ) : (
        <p style={{ color: '#999', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          現在商品を準備中です
        </p>
      )}

      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e8e8e8' }}>
        <a href="/" style={{ fontSize: '12px', color: '#666' }}>← トップに戻る</a>
      </div>
    </div>
  )
}
