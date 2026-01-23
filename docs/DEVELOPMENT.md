# 開発ガイド (Development Guide)

このドキュメントでは、アプリケーションの開発環境のセットアップと開発方法について説明します。

## 📋 前提条件

- Node.js 20以上
- npm または yarn
- Firebase プロジェクト

## 🚀 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yusay1498/my-pages.git
cd my-pages
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. Firebase の設定

環境変数を設定してください（`.env.local` ファイルを作成）：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 📝 開発の流れ

### ページの編集

`app/page.tsx` を編集することで、ホームページを変更できます。ファイルを編集すると、ページが自動的に更新されます。

### フォントの最適化

このプロジェクトは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して、[Geist](https://vercel.com/font) フォントファミリーを自動的に最適化して読み込みます。

## 🏗️ ビルド

本番用ビルドを作成するには：

```bash
npm run build
npm start
```

## 🔍 リンティング

コードの品質チェックを実行：

```bash
npm run lint
```

## 📚 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript 5
- **UI**: React 19
- **スタイリング**: Tailwind CSS 4
- **バックエンド**: Firebase (Authentication + Firestore)

## 📖 Next.js について学ぶ

Next.js について詳しく学ぶには、以下のリソースを参照してください：

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API について学ぶ
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブな Next.js チュートリアル
- [Next.js GitHub repository](https://github.com/vercel/next.js) - フィードバックや貢献を歓迎します！

## 🚢 デプロイ

### Vercel へのデプロイ

Next.js アプリをデプロイする最も簡単な方法は、Next.js の作成者による [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細については、[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) を確認してください。

### Firebase Hosting へのデプロイ

Firebase Hosting を使用してデプロイすることもできます：

```bash
npm run build
firebase deploy
```

## 🔧 トラブルシューティング

開発中に問題が発生した場合は、[NEXT_STEPS.md](./NEXT_STEPS.md) のトラブルシューティングセクションを参照してください。

## 📂 プロジェクト構造

```
my-pages/
├── src/
│   ├── app/              # Next.js App Router ページ
│   ├── features/         # 機能ごとのコンポーネントとロジック
│   ├── entities/         # データモデル
│   ├── lib/              # 共通ライブラリ（Firebase設定など）
│   └── types/            # TypeScript 型定義
├── docs/                 # ドキュメント
├── public/               # 静的ファイル
└── firebase.json         # Firebase 設定
```

## 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストを送信する前に、コードがリントを通過することを確認してください。
