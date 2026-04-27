import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const REPO = 'narijobusinessschool-hash/rexxia'
const FILE_PATH = 'data/products.json'
const GITHUB_API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

function getGithubToken(): string | undefined {
  const direct =
    process.env.GITHUB_TOKEN ||
    process.env.Github ||
    process.env.github ||
    process.env.GITHUB ||
    process.env.GH_TOKEN
  if (direct) return direct
  for (const [k, v] of Object.entries(process.env)) {
    if (!v) continue
    if (k === 'AWS_LAMBDA_METADATA_TOKEN') continue
    if (/^(ghp_|github_pat_|gho_|ghu_|ghs_)/.test(v)) return v
    if (k.toLowerCase().includes('github')) return v
  }
  return undefined
}

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

async function getFile() {
  const token = getGithubToken()
  if (!token) {
    const envKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes('GITHUB') || k.toUpperCase().includes('TOKEN')).join(', ') || '(none)'
    throw new Error(`GITHUB_TOKEN is not set (related env vars: ${envKeys})`)
  }
  const res = await fetch(GITHUB_API, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return { products: JSON.parse(content), sha: data.sha }
}

async function saveFile(products: unknown[], sha: string, message: string) {
  const token = getGithubToken()
  if (!token) throw new Error('GITHUB_TOKEN is not set')
  const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64')
  const res = await fetch(GITHUB_API, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content, sha }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub PUT ${res.status}: ${text.slice(0, 300)}`)
  }
}

export async function GET() {
  try {
    const { products } = await getFile()
    return NextResponse.json(products)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, brand, image, url, category } = await req.json()
  if (!name || !image || !url || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { products, sha } = await getFile()
    const newId = products.length > 0 ? Math.max(...(products as {id:number}[]).map(p => p.id)) + 1 : 1
    const updated = [...products, { id: newId, name, brand: brand || '', image, url, category }]
    await saveFile(updated, sha, `Add product: ${name}`)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, image, url, published, category } = body
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const { products, sha } = await getFile()
    const target = (products as {id:number, name:string}[]).find(p => p.id === id)
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = (products as Record<string, unknown>[]).map(p => {
      if (p.id !== id) return p
      const next = { ...p }
      if (typeof image === 'string') next.image = image
      if (typeof url === 'string') next.url = url
      if (typeof published === 'boolean') next.published = published
      if (typeof category === 'string') next.category = category
      return next
    })
    await saveFile(updated, sha, `Update product: ${target.name}`)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(new URL(req.url).searchParams.get('id') || '0')

  try {
    const { products, sha } = await getFile()
    const deleted = (products as {id:number, name:string}[]).find(p => p.id === id)
    const updated = (products as {id:number}[]).filter(p => p.id !== id)
    await saveFile(updated, sha, `Remove product: ${deleted?.name || id}`)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
