/**
 * Firestoreコレクション名の定数
 * マジックストリングを避けるため、全てのコレクション名をここで定義
 */
export const COLLECTIONS = {
  QUESTIONS: "questions",
  ANSWERS: "answers",
  QUESTION_ANSWERS: "questionAnswers",
  RESULT_PATTERNS: "resultPatterns",
  USERS: "users",
  ADMINS: "admins",
} as const;

/**
 * バリデーションエラーメッセージ
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_QUESTION_TEXT: "質問文を入力してください",
  REQUIRED_OPTIONS: "選択肢を2つ以上入力してください",
  REQUIRED_QUESTION_SELECT: "質問を選択してください",
  REQUIRED_PATTERN_NAME: "回答パターン名を入力してください",
  REQUIRED_MESSAGE: "メッセージを入力してください",
  REQUIRED_OPTION_SELECT: "選択肢を指定してください",
  QUESTION_NOT_FOUND: "選択された質問が見つかりません",
  OPTION_NOT_IN_QUESTION: "選択された選択肢が質問に存在しません",
  REQUIRED_RESULT_NAME: "結果パターン名を入力してください",
  REQUIRED_CONDITIONS: "条件を1つ以上設定してください",
} as const;

/**
 * 確認メッセージ
 */
export const CONFIRMATION_MESSAGES = {
  DELETE_QUESTION: "この質問を削除しますか？",
  DELETE_QUESTION_ANSWER: "この質問回答パターンを削除しますか？",
  DELETE_RESULT_PATTERN: "この結果パターンを削除しますか？",
  SUBMIT_ANSWER: (option: string) =>
    `「${option}」を選択して回答を送信しますか？\n\n送信後は変更できません。`,
} as const;

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  CREATE_QUESTION_FAILED: "質問の作成に失敗しました。もう一度お試しください。",
  UPDATE_QUESTION_FAILED: "質問の更新に失敗しました。もう一度お試しください。",
  DELETE_QUESTION_FAILED: "質問の削除に失敗しました。もう一度お試しください。",
  CREATE_QUESTION_ANSWER_FAILED:
    "質問回答パターンの作成に失敗しました。もう一度お試しください。",
  UPDATE_QUESTION_ANSWER_FAILED:
    "質問回答パターンの更新に失敗しました。もう一度お試しください。",
  DELETE_QUESTION_ANSWER_FAILED:
    "質問回答パターンの削除に失敗しました。もう一度お試しください。",
  CREATE_RESULT_PATTERN_FAILED:
    "結果パターンの作成に失敗しました。もう一度お試しください。",
  UPDATE_RESULT_PATTERN_FAILED:
    "結果パターンの更新に失敗しました。もう一度お試しください。",
  DELETE_RESULT_PATTERN_FAILED:
    "結果パターンの削除に失敗しました。もう一度お試しください。",
  SUBMIT_ANSWER_FAILED: "回答の送信に失敗しました。もう一度お試しください。",
} as const;

/**
 * UI関連の定数
 */
export const UI_CONSTANTS = {
  MIN_OPTIONS: 2,
  DEFAULT_OPTIONS_COUNT: 3,
  MIN_CONDITIONS: 1,
} as const;
