# アンケートシステム (Survey System)

React + Next.js + Firebase を使用したアンケートアプリケーション

## 📝 概要

このリポジトリは、管理者がアンケートを作成・管理し、一般ユーザーが匿名で回答できるWebアプリケーションです。

### 主な機能

- 👥 **一般ユーザー**: 匿名ログインでアンケートに回答
- 🔐 **管理者**: メールアドレスでログインし、質問の作成・編集・削除、回答結果の確認
- 🔥 **Firebase**: Authentication（認証）と Firestore（データベース）を使用
- ⚡ **リアルタイム**: 回答結果をリアルタイムで表示

## 🚀 クイックスタート

### 1. 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### 2. 管理者の設定

Firebase Consoleで管理者アカウントを作成してください。詳細は [管理者セットアップガイド](./docs/ADMIN_SETUP.md) を参照。

### 3. 使い方

- **一般ユーザー**: ホーム画面で「アンケートに回答する」をクリック
- **管理者**: メールアドレスとパスワードでログイン → 管理画面で質問を作成

## 📖 ドキュメント

詳細な情報は [docs](./docs) ディレクトリを参照してください：

- **[開発ガイド](./docs/DEVELOPMENT.md)** - 開発環境のセットアップと開発方法
- **[管理者セットアップガイド](./docs/ADMIN_SETUP.md)** - 管理者アカウントの作成方法
- **[実装内容の説明](./docs/IMPLEMENTATION_SUMMARY.md)** - 技術的な詳細と実装内容
- **[次のステップ](./docs/NEXT_STEPS.md)** - テスト手順とトラブルシューティング

## 🛠️ 技術スタック

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Firebase (Authentication + Firestore)

## 📄 ライセンス

このプロジェクトのライセンスについては [LICENSE](./LICENSE) ファイルを参照してください。
