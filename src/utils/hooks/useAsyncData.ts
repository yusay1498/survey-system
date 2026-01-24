import { useEffect, useState } from "react";

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refresh: loadData,
  };
}
