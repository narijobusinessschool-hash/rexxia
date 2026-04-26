'use client'
import { useState } from 'react'
import Link from 'next/link'
import categories from '@/data/categories.json'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      background: '#1a1a1a',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '0.15em' }}>REXXIA</div>
            <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.18em' }}>CAMP GEAR SELECT</div>
          </div>
        </Link>

        {/* デスクトップナビ */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          {categories.map(cat => (
            <Link key={cat.id} href={`/${cat.slug}`} style={{
              fontSize: '11px',
              color: '#aaa',
              letterSpacing: '0.05em',
              transition: 'color 0.2s'
            }}>
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }}></span>
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div style={{
          background: '#111',
          borderTop: '1px solid #333',
          padding: '16px 20px'
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: '#fff', padding: '10px 0', fontSize: '13px', borderBottom: '1px solid #222' }}>
            ホーム
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: '#aaa', padding: '10px 0', fontSize: '13px', borderBottom: '1px solid #222' }}
            >
              {cat.name}
            </Link>
          ))}
          <a
            href="https://info.rexxia.jp"
            style={{ display: 'block', color: '#aaa', padding: '10px 0', fontSize: '13px' }}
          >
            特集記事
          </a>
        </div>
      )}

      <style>{`
        .desktop-nav { display: none !important; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
