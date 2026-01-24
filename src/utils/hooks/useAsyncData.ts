import { useEffect, useState, useCallback, useRef } from "react";

/**
 * 非同期データの読み込み状態を管理するフック
 * 
 * @template T - データの型
 * @param fetcher - データを取得する非同期関数
 * @param dependencies - useEffectの依存配列（省略時は初回のみ実行）
 * @returns データ、ローディング状態、エラー状態、リフレッシュ関数
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

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      
      // リクエストがキャンセルされていない場合のみ状態を更新
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      // キャンセルエラーは無視
      if (!abortControllerRef.current.signal.aborted) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("Failed to load data:", err);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
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
    // dependencies配列は意図的に渡された依存関係を使用
    // この警告は誤検知のため無効化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refresh: loadData,
  };
}
