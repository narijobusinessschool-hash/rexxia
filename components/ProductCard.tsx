interface Product {
  id: number
  name: string
  brand: string
  image: string
  url: string
  category: string
  published?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      border: '1px solid #e8e8e8',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <a href={`/r/${product.id}`} target="_blank" rel="nofollow noopener noreferrer" style={{ display: 'block', flexShrink: 0 }}>
        <div style={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          background: '#f8f8f8',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </a>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{
          fontSize: '10px',
          color: '#999',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '4px',
          minHeight: '14px',
        }}>
          {product.brand}
        </p>
        <p style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#1a1a1a',
          lineHeight: '1.5',
          marginBottom: '10px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '39px',
        }}>
          {product.name}
        </p>
        <a
          href={`/r/${product.id}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            background: '#FF9900',
            color: '#111',
            fontSize: '12px',
            fontWeight: '500',
            padding: '8px',
            borderRadius: '4px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          Amazonで見る
        </a>
      </div>
    </div>
  )
}
