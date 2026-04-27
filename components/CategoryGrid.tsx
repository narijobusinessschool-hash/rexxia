import Link from 'next/link'
import categories from '@/data/categories.json'

export default function CategoryGrid() {
  return (
    <>
      <div className="category-grid">
        {categories.map(cat => (
          <Link key={cat.id} href={`/${cat.slug}`} className="category-card">
            <p className="cat-name">{cat.name}</p>
            <p className="cat-name-en">{cat.nameEn}</p>
          </Link>
        ))}
      </div>
      <style>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 24px 0;
        }
        .category-card {
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: border-color 0.2s, background 0.2s;
        }
        .category-card:hover {
          border-color: #aaa;
          background: #f8f8f8;
        }
        .cat-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .cat-name-en {
          font-size: 10px;
          color: #999;
        }
        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
          }
          .category-card {
            grid-column: span 2;
            padding: 12px 8px;
          }
          .category-card:nth-child(n+7) {
            grid-column: span 3;
          }
          .cat-name {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  )
}
