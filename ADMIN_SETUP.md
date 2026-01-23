# 管理者設定ガイド (Admin Setup Guide)

## 管理者の作成方法

このアプリケーションでは、管理者がメールアドレスとパスワードでログインし、アンケートの作成・編集・削除を行えます。

### 1. Firebase Authenticationで管理者ユーザーを作成

Firebase Consoleにアクセスし、Authentication セクションで以下の手順を実行してください：

1. Firebase Console (https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択
3. 左メニューから「Authentication」を選択
4. 「Users」タブを開く
5. 「Add user」ボタンをクリック
6. 管理者用のメールアドレスとパスワードを入力
7. ユーザーが作成されたら、そのユーザーの **UID** をコピー

### 2. Firestoreで管理者権限を付与

1. Firebase Consoleの左メニューから「Firestore Database」を選択
2. 「Start collection」または既存のコレクションを表示
3. `admins` というコレクションを作成（まだない場合）
4. 新しいドキュメントを追加：
   - Document ID: **手順1でコピーしたUID**
   - （フィールドは不要、ドキュメントの存在だけで管理者として認識されます）

### 3. 管理者としてログイン

アプリケーションのホーム画面 (/) にアクセスし、「管理者ログイン」セクションから：

1. 手順1で設定したメールアドレスを入力
2. パスワードを入力
3. 「ログイン」ボタンをクリック

成功すると、自動的に管理者画面 (/admin) にリダイレクトされます。

## トラブルシューティング

### 「管理者権限がありません」と表示される

- Firestoreの `admins` コレクションに、正しいUIDでドキュメントが作成されているか確認してください
- ログインしているユーザーのUIDが画面に表示されるので、それがFirestoreのドキュメントIDと一致しているか確認してください

### ログインできない

- Firebase Authenticationでユーザーが正しく作成されているか確認
- メールアドレスとパスワードが正しいか確認
- Firebase設定（環境変数）が正しく設定されているか確認

## Firestore セキュリティルール

現在のセキュリティルールは期限付きのテスト用設定になっています。本番環境では適切なセキュリティルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 管理者チェック用の関数
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // 質問の読み取りは全ユーザーが可能
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // 回答の読み取りは全ユーザーが可能
    // 書き込みは認証済みユーザーのみ
    match /answers/{answerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
    
    // ユーザー情報
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // 管理者リストは管理者のみ読み取り可能
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow write: if false; // 手動でのみ設定
    }
  }
}
```
