# REXXIA - キャンプギア セレクトショップ

## 概要
キャンプを愛するセレクターが選び抜いたギアだけを掲載するセレクトショップです。

## 商品追加方法

`data/products.json` に以下の形式で追加するだけです。

```json
{
  "id": 商品ID（連番）,
  "name": "商品名",
  "brand": "ブランド名",
  "image": "Amazon画像URL",
  "url": "アフィリエイトURL",
  "category": "カテゴリーID"
}
```

## カテゴリーID一覧

- `tent` テント
- `burner` 焚き火・バーナー
- `chairtable` チェア・テーブル
- `lantern` ランタン
- `tableware` クッカー・食器
- `wear` ウェア
- `bedding` 寝具
- `others` その他

## 開発

```bash
npm install
npm run dev
```

## デプロイ

Vercelに接続して自動デプロイ。
