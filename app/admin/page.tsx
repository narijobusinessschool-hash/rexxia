'use client'

import { useState, useEffect } from 'react'

const CATEGORIES = [
  { id: 'tent', name: 'テント' },
  { id: 'burner', name: '焚き火・バーナー' },
  { id: 'chairtable', name: 'チェア・テーブル' },
  { id: 'lantern', name: 'ランタン' },
  { id: 'tableware', name: 'クッカー・食器' },
  { id: 'wear', name: 'ウェア' },
  { id: 'bedding', name: '寝具' },
  { id: 'others', name: 'その他' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
}

interface Product {
  id: number
  name: string
  brand: string
  image: string
  url: string
  category: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ name: '', brand: '', image: '', url: '', category: 'tent' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (localStorage.getItem('admin_authed') === 'true') {
      setIsAuthed(true)
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products')
    setProducts(await res.json())
  }

  const handleLogin = async () => {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      localStorage.setItem('admin_authed', 'true')
      localStorage.setItem('admin_pw', password)
      setIsAuthed(true)
      fetchProducts()
    } else {
      setMessage('パスワードが違います')
    }
  }

  const handleAdd = async () => {
    if (!form.name || !form.url || !form.image) {
      setMessage('商品名・画像URL・アフィリエイトURLは必須です')
      return
    }
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': localStorage.getItem('admin_pw') || '',
      },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setMessage('✓ 追加しました。1〜2分後にサイトに反映されます。')
      setForm({ name: '', brand: '', image: '', url: '', category: 'tent' })
      fetchProducts()
    } else {
      setMessage('エラーが発生しました')
    }
    setLoading(false)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return
    setLoading(true)
    setMessage('')
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': localStorage.getItem('admin_pw') || '' },
    })
    if (res.ok) {
      setMessage('✓ 削除しました。1〜2分後に反映されます。')
      fetchProducts()
    } else {
      setMessage('エラーが発生しました')
    }
    setLoading(false)
  }

  if (!isAuthed) {
    return (
      <div style={{ maxWidth: '360px', margin: '120px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', letterSpacing: '0.05em' }}>REXXIA 管理画面</h1>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={inputStyle}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
        >
          ログイン
        </button>
        {message && <p style={{ color: '#e55', marginTop: '8px', fontSize: '13px' }}>{message}</p>}
      </div>
    )
  }

  const isError = message.includes('エラー') || message.includes('違')

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '0.05em' }}>REXXIA 管理画面</h1>
        <button
          onClick={() => { localStorage.removeItem('admin_authed'); setIsAuthed(false) }}
          style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ログアウト
        </button>
      </div>

      {/* 追加フォーム */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: '10px', padding: '24px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', letterSpacing: '0.05em' }}>商品を追加</h2>
        <div style={{ display: 'grid', gap: '14px' }}>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>商品名 <span style={{ color: '#e55' }}>*</span></span>
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: ツーリングドーム ST" />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>ブランド</span>
            <input style={inputStyle} value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="例: Coleman" />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>画像URL <span style={{ color: '#e55' }}>*</span></span>
            <input style={inputStyle} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://m.media-amazon.com/..." />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>アフィリエイトURL <span style={{ color: '#e55' }}>*</span></span>
            <input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://amzn.to/..." />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>カテゴリ</span>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        {form.image && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>画像プレビュー</p>
            <img src={form.image} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #e8e8e8', borderRadius: '6px', background: '#f8f8f8' }} />
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ marginTop: '20px', padding: '10px 32px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '処理中...' : '追加する'}
        </button>

        {message && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: isError ? '#e55' : '#2a9d5c' }}>{message}</p>
        )}
      </div>

      {/* 商品一覧 */}
      <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px', letterSpacing: '0.05em' }}>
        商品一覧 <span style={{ color: '#999', fontWeight: '400' }}>({products.length}件)</span>
      </h2>
      <div style={{ display: 'grid', gap: '8px' }}>
        {products.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '10px 12px' }}>
            <img src={p.image} alt={p.name} style={{ width: '52px', height: '52px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '4px', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
              <p style={{ fontSize: '11px', color: '#999' }}>
                {p.brand && `${p.brand} / `}{CATEGORIES.find(c => c.id === p.category)?.name}
              </p>
            </div>
            <button
              onClick={() => handleDelete(p.id, p.name)}
              disabled={loading}
              style={{ padding: '5px 12px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', color: '#e55', cursor: 'pointer', flexShrink: 0 }}
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
