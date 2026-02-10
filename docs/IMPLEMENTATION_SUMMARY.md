# 実装内容の説明 (Implementation Summary)

このドキュメントでは、アンケートシステムに実装された主要機能について説明します。

## 1. 認証システム

### 一般ユーザーと管理者の分離
- **一般ユーザー**: 匿名ログインでアンケートに回答
- **管理者**: メールアドレスとパスワードでログインし、質問と結果パターンを管理

### 実装されたコンポーネント
- `useAuth` フック: Firebase認証状態の監視
- `LoginSelection`: ログイン方法の選択画面
- `AdminLoginForm`: 管理者用ログインフォーム
- `AnonymousLoginButton`: 匿名ログイン用ボタン

## 2. 質問管理機能

管理者が質問を作成・編集・削除できる機能を実装しました。

### 主要コンポーネント
- `QuestionManager`: 質問のCRUD操作UI
- `AdminDashboard`: 旧: 統合管理画面（非推奨）
- `AdminMenu`: 管理画面メニュー
- `QuestionEditScreen`: 質問編集画面（質問管理、質問回答管理、結果パターン管理を含む）
- `ResultScreen`: アンケート結果確認画面

### API関数
- `createQuestion`: 新しい質問を作成
- `updateQuestion`: 既存の質問を更新
- `deleteQuestion`: 質問を削除
- `getQuestions`: すべての質問を取得

## 3. パーソナライズされた結果表示機能

ユーザーの回答の組み合わせに基づいて、異なる結果を表示する機能を実装しました。
心理テストのように、回答パターンごとに異なるメッセージを表示できます。

### コアロジック
- `ResultPattern` 型: 結果パターンのデータ構造
- `findMatchingPattern`: ユーザーの回答と結果パターンを照合するマッチングアルゴリズム
- 優先度制御: より具体的な条件を優先的に評価

### UI コンポーネント
- `PersonalityResult`: パーソナライズされた結果を表示
- `ResultPatternManager`: 管理画面での結果パターン管理UI
- `SurveyForm`: アンケートフォーム（結果パターン表示機能を統合）

### API関数
- `getResultPatterns`: Firestoreから結果パターンを取得
- `createResultPattern`: 新しい結果パターンを作成
- `updateResultPattern`: 既存の結果パターンを更新
- `deleteResultPattern`: 結果パターンを削除


## アプリケーションのフロー

### 一般ユーザーのフロー
1. ホーム画面 (/) にアクセス
2. 「アンケートに回答する」ボタンをクリック → 匿名ログイン
3. 表示名を入力
4. アンケートに回答
5. パーソナライズされた結果または集計結果を表示

### 管理者のフロー
1. ホーム画面 (/) にアクセス
2. メールアドレスとパスワードを入力してログイン
3. 自動的に管理者画面 (/admin) にリダイレクト
4. 管理者メニューから「質問編集」または「アンケート結果確認」を選択
   - **質問編集画面** (/admin/questions): 質問と結果パターンの作成・編集・削除
   - **アンケート結果確認画面** (/admin/results): 回答結果の確認
5. ログアウト

## セットアップ

### 管理者アカウントの作成

詳細な手順は [ADMIN_SETUP.md](./ADMIN_SETUP.md) を参照してください。

1. Firebase Consoleで管理者用のメールアドレスとパスワードを設定
2. そのユーザーのUIDをFirestoreの `admins` コレクションに追加

### 結果パターンの設定

詳細な手順は [RESULT_PATTERNS.md](./RESULT_PATTERNS.md) を参照してください。

管理画面から結果パターンを作成するか、Firebase Consoleで直接 `resultPatterns` コレクションにデータを追加します。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript 5
- **UI**: React 19
- **スタイリング**: Tailwind CSS 4
- **バックエンド**: Firebase (Authentication + Firestore)

## セキュリティ

現在のFirestoreルールは開発用です。本番環境では [ADMIN_SETUP.md](./ADMIN_SETUP.md) に記載されている適切なセキュリティルールを設定してください。

## 参考ドキュメント

- [開発ガイド](./DEVELOPMENT.md) - 開発環境のセットアップ
- [管理者セットアップガイド](./ADMIN_SETUP.md) - 管理者アカウントの作成
- [結果パターン設定ガイド](./RESULT_PATTERNS.md) - パーソナライズされた結果の設定
- [サンプルデータガイド](./SAMPLE_DATA.md) - テスト用サンプルデータ
