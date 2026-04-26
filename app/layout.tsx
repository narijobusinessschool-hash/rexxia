import type { Metadata } from 'next'
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
