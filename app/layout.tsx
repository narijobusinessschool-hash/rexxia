import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import MobileFooterNav from '@/components/MobileFooterNav'

export const metadata: Metadata = {
  title: 'REXXIA | キャンプギア セレクトショップ',
  description: 'キャンプを愛するセレクターが選び抜いたギアだけを掲載しています。テント・バーナー・チェアなどAmazonで購入できるキャンプ用品を厳選紹介。',
  keywords: 'キャンプ,キャンプ用品,アウトドア,テント,バーナー,チェア,ランタン,おすすめ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZTET9VTLYW" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZTET9VTLYW');
        `}</Script>
      </head>
      <body>
        <Header />
        <main style={{ paddingBottom: '80px' }}>
          {children}
        </main>
        <MobileFooterNav />
      </body>
    </html>
  )
}
