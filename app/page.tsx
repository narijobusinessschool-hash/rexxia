import products from '@/data/products.json'
import CategoryGrid from '@/components/CategoryGrid'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <>
      {/* ヒーローセクション */}
      <div style={{
        background: '#1a1a1a',
        padding: '40px 24px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#888', marginBottom: '12px' }}>
          REXXIA SELECTION
        </p>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '500',
          color: '#fff',
          lineHeight: '1.6',
          marginBottom: '8px'
        }}>
          本当に使える<br />
          キャンプギアだけを届ける。
        </h1>
        <div style={{ width: '40px', height: '2px', background: '#e8735a', margin: '12px auto 16px' }}></div>
        <p style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.8' }}>
          キャンプを愛するセレクターが選び抜いた<br />
          ギアだけを掲載しています。
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* カテゴリー */}
        <p style={{
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.1em',
          borderBottom: '1px solid #e8e8e8',
          paddingBottom: '8px',
          marginBottom: '0'
        }}>
          CATEGORY
        </p>
        <CategoryGrid />

        {/* 商品一覧 */}
        <p style={{
          fontSize: '13px',
          fontWeight: '500',
          letterSpacing: '0.1em',
          borderBottom: '1px solid #e8e8e8',
          paddingBottom: '8px',
          marginTop: '32px'
        }}>
          ITEMS
        </p>
        <ProductGrid products={products} />

        {/* 特集記事へのリンク */}
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          borderTop: '1px solid #e8e8e8',
          marginTop: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
            キャンプギアの詳しい解説・比較記事はこちら
          </p>
          <a
            href="https://info.rexxia.jp"
            style={{
              display: 'inline-block',
              border: '1px solid #1a1a1a',
              color: '#1a1a1a',
              fontSize: '12px',
              padding: '10px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              letterSpacing: '0.05em'
            }}
          >
            特集記事を見る →
          </a>
        </div>
      </div>
    </>
  )
}
