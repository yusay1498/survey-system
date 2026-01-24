# プロジェクト構造ガイド

このドキュメントは、リファクタリング後のプロジェクト構造と設計パターンについて説明します。

## 📁 ディレクトリ構造

```
src/
├── app/                    # Next.js App Router ページ
│   ├── admin/             # 管理者ページ
│   └── page.tsx           # ホームページ
├── components/            # 共通UIコンポーネント
│   └── ui/               # 再利用可能なUIコンポーネント
│       ├── GradientCard.tsx
│       ├── LoadingScreen.tsx
│       └── Spinner.tsx
├── entities/             # ドメインエンティティ（型定義）
│   ├── answer.ts
│   ├── question.ts
│   ├── questionAnswer.ts
│   ├── resultPattern.ts
│   └── user.ts
├── features/             # 機能別モジュール（Feature-Sliced Design）
│   ├── admin/           # 管理者機能
│   │   ├── api/        # API関数
│   │   ├── components/ # コンポーネント
│   │   ├── types.ts    # 型定義
│   │   └── index.ts    # barrel export
│   ├── auth/           # 認証機能
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.ts
│   └── survey/         # アンケート機能
│       ├── api/
│       ├── components/
│       ├── lib/        # ビジネスロジック
│       ├── types/      # 型定義（result.ts）
│       ├── types.ts    # コンポーネント型定義
│       └── index.ts
├── lib/                # 外部ライブラリ設定
│   ├── constants.ts    # アプリケーション定数
│   ├── firebase.ts     # Firebase初期化
│   └── firestore/      # Firestoreヘルパー
└── utils/              # ユーティリティ関数
    ├── hooks/          # カスタムフック
    ├── validation/     # バリデーション関数
    ├── errorHandling.ts
    └── index.ts
```

## 🎯 設計パターン

### 1. Feature-Sliced Design (FSD)

各機能（feature）は独立したモジュールとして構成されています：

- **api/**: Firestore操作やAPI呼び出し
- **components/**: UI コンポーネント
- **hooks/**: カスタムフック（必要に応じて）
- **lib/**: ビジネスロジック
- **types.ts**: 型定義
- **index.ts**: barrel export（公開インターフェース）

### 2. 共通フック

#### `useAsyncData<T>`
非同期データの読み込み状態を管理します。

```typescript
const { data, loading, error, refresh } = useAsyncData(
  () => getQuestions()
);
```

**特徴:**
- AbortControllerによる自動リクエストキャンセル
- ローディング・エラー状態の自動管理
- リフレッシュ機能

#### `useCRUDManager<T, F>`
CRUD操作の共通状態管理パターンを提供します。

```typescript
const {
  editing,
  isCreating,
  formData,
  setFormData,
  resetForm,
  startEdit,
  startCreate,
} = useCRUDManager<Question, QuestionFormData>(createInitialFormData);
```

**使用箇所:**
- QuestionManager
- QuestionAnswerManager
- ResultPatternManager

#### `useLocalStorage<T>`
SSR対応のlocalStorage管理を提供します。

```typescript
const [value, setValue, clearValue] = useLocalStorage<string>(
  'key',
  'initialValue'
);
```

### 3. 型定義の管理

#### エンティティ型（`entities/`）
データベーススキーマに対応する基本的な型定義。

```typescript
// entities/question.ts
export type Question = {
  id: string;
  text: string;
  options: string[];
  order: number;
};
```

#### フィーチャー型（`features/*/types.ts`）
コンポーネントのProps、フォームデータなどの型定義。

```typescript
// features/admin/types.ts
export type QuestionManagerProps = {
  questions: Question[];
  onUpdate: () => void;
};

export type QuestionFormData = {
  text: string;
  options: string[];
  order: number;
};
```

### 4. 命名規則

#### 変数名
- ❌ 短縮形: `q`, `a`, `opt`, `idx`
- ✅ 完全な名前: `question`, `answer`, `option`, `index`

#### Props型
- コンポーネント名 + `Props`: `QuestionManagerProps`

#### フォームデータ型
- エンティティ名 + `FormData`: `QuestionFormData`

### 5. インポートパターン

#### barrel exportの使用
```typescript
// ❌ 直接インポート
import { QuestionManager } from "@/features/admin/components/QuestionManager";

// ✅ barrel export経由
import { QuestionManager } from "@/features/admin";
```

#### 型のインポート
```typescript
// エンティティ型
import { Question } from "@/entities/question";

// フィーチャー型
import type { QuestionManagerProps } from "@/features/admin";
```

## 🔧 開発ガイドライン

### コンポーネント作成時

1. **Props型を定義**: `features/*/types.ts`に追加
2. **実装**: `features/*/components/`に配置
3. **エクスポート**: `features/*/index.ts`に追加

### 新しい機能追加時

1. **フィーチャーディレクトリ作成**: `features/new-feature/`
2. **必要なディレクトリを追加**: `api/`, `components/`, `types.ts`, `index.ts`
3. **型定義**: `types.ts`で全ての型を定義
4. **barrel export**: `index.ts`で公開インターフェースを定義

### CRUD操作を追加する場合

1. **`useCRUDManager`を使用**して状態管理
2. **FormData型を定義**: `features/*/types.ts`
3. **API関数を作成**: `features/*/api/`
4. **バリデーション**: `utils/validation/`に追加

## 📊 コード品質

### リファクタリング結果

- **約200行のコード削減**: CRUD状態管理、重複useEffect
- **統一されたパターン**: 全管理コンポーネントでuseCRUDManager使用
- **パフォーマンス向上**: AbortControllerでの不要なリクエストキャンセル
- **可読性向上**: 明確な変数名、再利用可能なフック
- **保守性向上**: 共通ロジックの抽出、一貫性のある実装

### ベストプラクティス

1. **DRY原則**: 重複コードは共通フックやコンポーネントに抽出
2. **SOLID原則**: 単一責任、依存性逆転を意識
3. **型安全性**: TypeScriptの型システムを最大限活用
4. **一貫性**: 命名規則、ファイル配置、インポートパターンを統一

## 🚀 次のステップ

今後の改善余地：

1. **SurveyForm.tsx の分割**: 469行のモノリシックコンポーネントを複数のコンポーネントとフックに分割
2. **エラーバウンダリー**: 非同期操作周りにエラーバウンダリーを追加
3. **テストの追加**: 各フックとコンポーネントに対するユニットテスト
4. **ドキュメント**: 各機能のREADMEを追加

## 📚 参考資料

- [bulletproof-react](https://github.com/alan2207/bulletproof-react): アーキテクチャの参考
- [Feature-Sliced Design](https://feature-sliced.design/): FSDドキュメント
- [React Hooks](https://react.dev/reference/react): 公式フックドキュメント
