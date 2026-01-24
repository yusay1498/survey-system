import { useEffect, useState, useCallback, useRef } from "react";

/**
 * 非同期データの読み込み状態を管理するフック
 * 
 * @template T - データの型
 * @param fetcher - データを取得する非同期関数。呼び出し側で変更したくない場合はuseCallbackでメモ化してください
 * @param dependencies - useEffectの依存配列（省略時は初回のみ実行）
 * @returns データ、ローディング状態、エラー状態、リフレッシュ関数
 * 
 * @example
 * // 初回のみ実行（dependenciesを省略）
 * const { data } = useAsyncData(() => getQuestions());
 * 
 * // userIdが変更されたら再実行
 * const { data } = useAsyncData(() => getUserData(userId), [userId]);
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    // 前回のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成し、ローカル変数として保持
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      
      // 最新のリクエストであり、かつキャンセルされていない場合のみ状態を更新
      if (abortControllerRef.current === controller && !controller.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      // キャンセルエラーは無視
      if (abortControllerRef.current === controller && !controller.signal.aborted) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("Failed to load data:", err);
      }
    } finally {
      if (abortControllerRef.current === controller && !controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    loadData();
    
    // クリーンアップ: コンポーネントのアンマウント時に実行中のリクエストをキャンセル
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh: loadData,
  };
}
