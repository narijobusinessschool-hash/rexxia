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
  published?: boolean
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ name: '', brand: '', image: '', url: '', category: 'tent' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({ image: '', url: '', published: true, category: 'tent' })

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

  const openEdit = (p: Product) => {
    setEditing(p)
    setEditForm({ image: p.image, url: p.url, published: p.published !== false, category: p.category })
    setMessage('')
  }

  const closeEdit = () => {
    setEditing(null)
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    if (!editForm.image || !editForm.url) {
      setMessage('画像URL・アフィリエイトURLは必須です')
      return
    }
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': localStorage.getItem('admin_pw') || '',
      },
      body: JSON.stringify({
        id: editing.id,
        image: editForm.image,
        url: editForm.url,
        published: editForm.published,
        category: editForm.category,
      }),
    })
    if (res.ok) {
      setMessage('✓ 更新しました。1〜2分後に反映されます。')
      setEditing(null)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#1a1a1a', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 14px', textDecoration: 'none', letterSpacing: '0.03em' }}
          >
            Topを見る →
          </a>
          <button
            onClick={() => { localStorage.removeItem('admin_authed'); setIsAuthed(false) }}
            style={{ fontSize: '12px', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
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
      <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>商品をクリックすると編集できます</p>
      <div style={{ display: 'grid', gap: '8px' }}>
        {products.map(p => {
          const isPublished = p.published !== false
          return (
            <div
              key={p.id}
              onClick={() => openEdit(p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                background: isPublished ? '#fff' : '#fafafa',
                opacity: isPublished ? 1 : 0.6,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#aaa')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
            >
              <img src={p.image} alt={p.name} style={{ width: '52px', height: '52px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '4px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.name}</p>
                  {!isPublished && (
                    <span style={{ fontSize: '10px', color: '#999', border: '1px solid #ddd', borderRadius: '3px', padding: '1px 6px', flexShrink: 0 }}>非公開</span>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: '#999' }}>
                  {p.brand && `${p.brand} / `}{CATEGORIES.find(c => c.id === p.category)?.name}
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(p.id, p.name) }}
                disabled={loading}
                style={{ padding: '5px 12px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', color: '#e55', cursor: 'pointer', flexShrink: 0 }}
              >
                削除
              </button>
            </div>
          )
        })}
      </div>

      {/* 編集モーダル */}
      {editing && (
        <div
          onClick={closeEdit}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '28px',
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>編集中</p>
                <h2 style={{ fontSize: '15px', fontWeight: '600' }}>{editing.name}</h2>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                  {editing.brand && `${editing.brand} / `}{CATEGORIES.find(c => c.id === editing.category)?.name}
                </p>
              </div>
              <button
                onClick={closeEdit}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer', lineHeight: 1, padding: '4px 8px' }}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div className="edit-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
              {/* 左：現在の画像 */}
              <div>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>現在の画像</p>
                <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#f8f8f8', border: '1px solid #e8e8e8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={editForm.image || editing.image} alt={editing.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                {editForm.image && editForm.image !== editing.image && (
                  <p style={{ fontSize: '10px', color: '#2a9d5c', marginTop: '6px' }}>※ 新しい画像でプレビュー中</p>
                )}
              </div>

              {/* 右：編集フォーム */}
              <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
                {/* 公開・非公開 */}
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>公開状態</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, published: true })}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: editForm.published ? '1px solid #1a1a1a' : '1px solid #ddd',
                        background: editForm.published ? '#1a1a1a' : '#fff',
                        color: editForm.published ? '#fff' : '#666',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      公開
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, published: false })}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: !editForm.published ? '1px solid #1a1a1a' : '1px solid #ddd',
                        background: !editForm.published ? '#1a1a1a' : '#fff',
                        color: !editForm.published ? '#fff' : '#666',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      非公開
                    </button>
                  </div>
                </div>

                {/* カテゴリー */}
                <label style={{ display: 'block' }}>
                  <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>カテゴリー</span>
                  <select
                    style={inputStyle}
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {editForm.category !== editing.category && (
                    <p style={{ fontSize: '10px', color: '#2a9d5c', marginTop: '4px' }}>
                      ※ {CATEGORIES.find(c => c.id === editing.category)?.name} → {CATEGORIES.find(c => c.id === editForm.category)?.name} に変更
                    </p>
                  )}
                </label>

                {/* 画像URL */}
                <label style={{ display: 'block' }}>
                  <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>画像URL</span>
                  <input
                    style={inputStyle}
                    value={editForm.image}
                    onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="https://m.media-amazon.com/..."
                  />
                </label>

                {/* アフィリエイトURL */}
                <label style={{ display: 'block' }}>
                  <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>アフィリエイトURL</span>
                  <input
                    style={inputStyle}
                    value={editForm.url}
                    onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                    placeholder="https://amzn.to/..."
                  />
                  <a
                    href={editForm.url || editing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '11px', color: '#666', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}
                  >
                    現在のリンクを開く →
                  </a>
                </label>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    style={{ flex: 1, padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? '保存中...' : '保存する'}
                  </button>
                  <button
                    onClick={closeEdit}
                    disabled={loading}
                    style={{ padding: '10px 20px', background: '#fff', color: '#666', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>

            <style>{`
              @media (max-width: 640px) {
                .edit-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  )
}
