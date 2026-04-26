import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  brand: string
  image: string
  url: string
  category: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 24px 0;
        }
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </>
  )
}
