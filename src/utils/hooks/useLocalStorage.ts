import { useState, useEffect, useCallback } from "react";

/**
 * SSR対応のlocalStorageフック
 * 
 * @template T - 保存するデータの型
 * @param key - localStorageのキー
 * @param initialValue - 初期値
 * @returns [値, 値を設定する関数, 値をクリアする関数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみlocalStorageから値を読み込む
  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
  }, [key]);

  // 値を保存する関数
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // storedValueは関数内で直接参照するため、依存配列には含めない
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          if (isClient) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    },
    [key, isClient]
  );

  // 値をクリアする関数
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (isClient) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isClient]);

  return [storedValue, setValue, clearValue];
}
