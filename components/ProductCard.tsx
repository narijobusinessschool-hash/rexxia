interface Product {
  id: number
  name: string
  brand: string
  image: string
  url: string
  category: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      border: '1px solid #e8e8e8',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      background: '#fff'
    }}>
      <a href={product.url} target="_blank" rel="nofollow noopener noreferrer">
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            aspectRatio: '1',
            objectFit: 'contain',
            background: '#f8f8f8',
            display: 'block'
          }}
        />
      </a>
      <div style={{ padding: '10px' }}>
        <p style={{
          fontSize: '10px',
          color: '#999',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          {product.brand}
        </p>
        <p style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#1a1a1a',
          lineHeight: '1.5',
          marginBottom: '10px'
        }}>
          {product.name}
        </p>
        <a
          href={product.url}
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
            textDecoration: 'none'
          }}
        >
          Amazonで見る
        </a>
      </div>
    </div>
  )
}
