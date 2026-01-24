import { User as FirebaseUser } from "firebase/auth";

/**
 * ログイン選択コンポーネントのプロパティ
 */
export type LoginSelectionProps = {
  onAdminLogin: () => void;
  onAnonymousLogin: () => void;
};

/**
 * 管理者ログインフォームのプロパティ
 */
export type AdminLoginFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * 匿名ログインボタンのプロパティ
 */
export type AnonymousLoginButtonProps = {
  onSuccess: (user: FirebaseUser) => void;
};

/**
 * 名前入力コンポーネントのプロパティ
 */
export type NameInputProps = {
  onSubmit: (name: string) => void;
};

/**
 * ユーザーアンケートフローのプロパティ
 */
export type UserSurveyFlowProps = {
  userId: string;
};

/**
 * 認証フックの戻り値
 */
export type AuthState = {
  user: FirebaseUser | null;
  loading: boolean;
};
