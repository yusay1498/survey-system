/**
 * エラーハンドリングユーティリティ
 */

/**
 * エラーをコンソールに記録し、ユーザーにアラートを表示
 */
export const handleError = (
  context: string,
  error: unknown,
  userMessage: string
): void => {
  console.error(`${context}:`, error);
  alert(userMessage);
};

/**
 * 非同期処理をtry-catchでラップしてエラーハンドリングを行う
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  context: string,
  userMessage: string
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    handleError(context, error, userMessage);
    return null;
  }
};

/**
 * 確認ダイアログを表示し、ユーザーの同意を得る
 */
export const confirmAction = (message: string): boolean => {
  return window.confirm(message);
};
