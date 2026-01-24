# 結果パターンの設定ガイド (Result Pattern Setup Guide)

## 概要

このアプリケーションでは、ユーザーの回答の組み合わせに基づいて、異なるパーソナライズされた結果を表示する機能が実装されています。

## 結果パターンとは？

結果パターンは、特定の質問と選択肢の組み合わせに基づいて表示されるメッセージです。
心理テストのように、ユーザーの回答によって異なる結果（例：「リーダータイプ」「クリエイティブタイプ」など）を表示できます。

## Firebase Firestoreでのデータ構造

### コレクション名: `resultPatterns`

各ドキュメントは以下のフィールドを持ちます：

```typescript
{
  name: string;              // 結果のタイトル（例：「リーダータイプ」）
  message: string;           // メインメッセージ
  description?: string;      // 詳細説明（オプション）
  conditions: Array<{        // マッチング条件
    questionId: string;      // 質問ID
    selectedOption: string;  // 選択肢テキスト
  }>;
  priority: number;          // 優先度（高い方が先にチェックされる）
  order: number;             // 表示順序
  createdAt: timestamp;      // 作成日時
}
```

## 設定例

### 例1: シンプルな2択アンケート

質問:
- Q1: 「あなたは朝型？夜型？」選択肢: ["朝型", "夜型"]
- Q2: 「コーヒーと紅茶、どちらが好き？」選択肢: ["コーヒー", "紅茶"]

結果パターン:

#### パターン1: 「朝型コーヒー愛好家」
```json
{
  "name": "朝型コーヒー愛好家",
  "message": "あなたは早起きしてコーヒーを楽しむ、エネルギッシュな朝型タイプです！",
  "description": "朝の静かな時間を大切にし、コーヒーの香りで一日をスタートするあなたは、計画的で生産的な日々を送っています。",
  "conditions": [
    {
      "questionId": "question1_id",
      "selectedOption": "朝型"
    },
    {
      "questionId": "question2_id",
      "selectedOption": "コーヒー"
    }
  ],
  "priority": 10,
  "order": 1,
  "createdAt": "2024-01-24T00:00:00Z"
}
```

#### パターン2: 「夜型紅茶派」
```json
{
  "name": "夜型紅茶派",
  "message": "あなたは夜の静けさを愛する、創造的な夜型タイプです！",
  "description": "夜の落ち着いた雰囲気の中で紅茶を楽しむあなたは、じっくりと物事を考え、創造性を発揮します。",
  "conditions": [
    {
      "questionId": "question1_id",
      "selectedOption": "夜型"
    },
    {
      "questionId": "question2_id",
      "selectedOption": "紅茶"
    }
  ],
  "priority": 10,
  "order": 2,
  "createdAt": "2024-01-24T00:00:00Z"
}
```

### 例2: 複雑な条件（3つ以上の質問）

```json
{
  "name": "完璧主義の計画家",
  "message": "細部にこだわる完璧主義者で、計画的に物事を進めるタイプです！",
  "description": "あなたは計画を立てることが得意で、細かいところまで気を配る丁寧な仕事ぶりが特徴です。",
  "conditions": [
    {
      "questionId": "q1_id",
      "selectedOption": "計画的"
    },
    {
      "questionId": "q2_id",
      "selectedOption": "細部重視"
    },
    {
      "questionId": "q3_id",
      "selectedOption": "慎重"
    }
  ],
  "priority": 15,
  "order": 1,
  "createdAt": "2024-01-24T00:00:00Z"
}
```

## マッチングロジック

1. **優先度順**: `priority`が高い結果パターンから順にチェックされます
2. **条件の完全一致**: `conditions`配列内のすべての条件がユーザーの回答と一致する必要があります
3. **最初の一致**: 最初にマッチしたパターンが表示されます
4. **フォールバック**: どのパターンにもマッチしない場合は、デフォルトの完了メッセージが表示されます

## Firebaseコンソールでの設定手順

### 0. Firestore インデックスの作成（重要）
結果パターンを正しく取得するため、以下のインデックスを作成してください：

1. Firebase Console で「Firestore Database」→「インデックス」タブを選択
2. 「インデックスを追加」をクリック
3. 以下を設定:
   - コレクション: `resultPatterns`
   - フィールド1: `priority` - 降順
   - クエリのスコープ: コレクション

**注**: 現在の実装では単一フィールドのインデックスのみ必要です。複数orderBy句を避けることで、複雑な複合インデックス設定が不要になっています。

### 1. Firestoreコンソールにアクセス
1. Firebase Console (https://console.firebase.google.com/) にログイン
2. プロジェクトを選択
3. 左メニューから「Firestore Database」を選択

### 2. コレクションの作成
1. 「コレクションを開始」または「コレクションを追加」をクリック
2. コレクションID: `resultPatterns`
3. 「次へ」をクリック

### 3. ドキュメントの追加
1. ドキュメントIDは自動生成でOK
2. 以下のフィールドを追加:
   - `name` (string): 結果のタイトル
   - `message` (string): メインメッセージ
   - `description` (string, optional): 詳細説明
   - `conditions` (array): 
     - 「配列に要素を追加」をクリック
     - 「マップ」を選択
     - フィールドを追加:
       - `questionId` (string): 質問のID（Firestoreの`questions`コレクションから取得）
       - `selectedOption` (string): 選択肢のテキスト
   - `priority` (number): 優先度（例: 10）
   - `order` (number): 表示順序（例: 1）
   - `createdAt` (timestamp): 現在のタイムスタンプ

### 4. 質問IDの確認方法
1. Firestoreコンソールで`questions`コレクションを開く
2. 各質問のドキュメントIDをコピー
3. そのIDを`resultPatterns`の`conditions`内の`questionId`に使用

## テスト方法

1. 複数の結果パターンを作成
2. アプリケーションでアンケートに回答
3. 回答の組み合わせが、作成した結果パターンの条件と一致するようにする
4. 完了画面で、該当する結果パターンのメッセージが表示されることを確認

## トラブルシューティング

### 結果パターンが表示されない
- **原因1**: `conditions`の`questionId`が正しくない
  - **解決**: Firestoreの`questions`コレクションから正しいIDをコピー
  
- **原因2**: `selectedOption`のテキストが質問の選択肢と完全一致していない
  - **解決**: 大文字小文字、スペースなど、完全に一致するテキストを使用

- **原因3**: すべての条件が満たされていない
  - **解決**: ユーザーがすべての条件に該当する回答をしているか確認

### デフォルトメッセージが表示される
これは正常な動作です。どの結果パターンにもマッチしない場合、デフォルトの完了メッセージが表示されます。

## 今後の拡張

現在は管理画面での結果パターン管理機能は未実装ですが、以下の機能を追加できます：

1. 管理画面での結果パターンの作成・編集・削除UI
2. 部分マッチング（すべての条件ではなく、一部の条件のみ満たす）
3. スコアリングシステム（条件ごとにポイントを加算）
4. 複数の結果を同時に表示（例：「あなたは70%リーダータイプ、30%クリエイティブタイプです」）

## 参考

- Firebase Firestore ドキュメント: https://firebase.google.com/docs/firestore
- プロジェクトのREADME: [README.md](../README.md)
