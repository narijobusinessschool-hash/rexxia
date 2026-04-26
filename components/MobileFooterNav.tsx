'use client'

export default function MobileFooterNav() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#e8735a',
        display: 'flex',
        zIndex: 9999,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }} className="mobile-footer-nav">
        <a href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', padding: '8px 0', fontSize: '10px', gap: '3px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </a>
        <a href="https://info.rexxia.jp" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', padding: '8px 0', fontSize: '10px', gap: '3px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <span>記事</span>
        </a>
        <button onClick={scrollToTop} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontSize: '10px', gap: '3px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
          <span>トップ</span>
        </button>
        <a href="/tent" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', padding: '8px 0', fontSize: '10px', gap: '3px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 20L12 4l8 16H4zm3.5-2h9L12 8.5 7.5 18z"/></svg>
          <span>カテゴリ</span>
        </a>
      </nav>
      <style>{`
        .mobile-footer-nav { display: flex; }
        @media (min-width: 768px) {
          .mobile-footer-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
