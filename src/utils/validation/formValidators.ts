import { Question } from "@/entities/question";
import { VALIDATION_MESSAGES, UI_CONSTANTS } from "@/lib/constants";

/**
 * 質問フォームのバリデーション
 */
export const validateQuestionForm = (
  text: string,
  options: string[]
): string | null => {
  if (!text.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_QUESTION_TEXT;
  }

  const validOptions = options.filter((opt) => opt.trim());
  if (validOptions.length < UI_CONSTANTS.MIN_OPTIONS) {
    return VALIDATION_MESSAGES.REQUIRED_OPTIONS;
  }

  return null;
};

/**
 * 質問回答パターンフォームのバリデーション
 */
export const validateQuestionAnswerForm = (
  questionId: string,
  name: string,
  message: string,
  selectedOption: string,
  questions: Question[]
): string | null => {
  if (!questionId) {
    return VALIDATION_MESSAGES.REQUIRED_QUESTION_SELECT;
  }

  if (!name.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_PATTERN_NAME;
  }

  if (!message.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_MESSAGE;
  }

  if (!selectedOption.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_OPTION_SELECT;
  }

  // 選択された質問が存在するか確認
  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return VALIDATION_MESSAGES.QUESTION_NOT_FOUND;
  }

  // 選択肢が質問のオプションに含まれているか確認
  if (!question.options.includes(selectedOption)) {
    return VALIDATION_MESSAGES.OPTION_NOT_IN_QUESTION;
  }

  return null;
};

/**
 * 結果パターンフォームのバリデーション
 */
export const validateResultPatternForm = (
  name: string,
  message: string,
  conditionsCount: number
): string | null => {
  if (!name.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_RESULT_NAME;
  }

  if (!message.trim()) {
    return VALIDATION_MESSAGES.REQUIRED_MESSAGE;
  }

  if (conditionsCount < UI_CONSTANTS.MIN_CONDITIONS) {
    return VALIDATION_MESSAGES.REQUIRED_CONDITIONS;
  }

  return null;
};

/**
 * 汎用バリデーションヘルパー: 空文字チェック
 */
export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * 汎用バリデーションヘルパー: 最小配列長チェック
 */
export const hasMinLength = <T>(array: T[], minLength: number): boolean => {
  return array.length >= minLength;
};
