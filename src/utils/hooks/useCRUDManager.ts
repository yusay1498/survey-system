import { useState, useCallback } from "react";

/**
 * CRUD操作の共通状態管理フック
 * 
 * @template T - エンティティの型。必ず`id: string`プロパティを持つ必要があります
 * @template F - フォームデータの型。編集・作成に使用されるフォームの形状を定義します
 * @param createInitialFormData - フォームの初期値を作成する関数
 * @returns CRUD操作に必要な状態と関数
 */
export function useCRUDManager<T extends { id: string }, F>(
  createInitialFormData: () => F
) {
  const [editing, setEditing] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<F>(createInitialFormData());

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setEditing(null);
    setIsCreating(false);
  }, [createInitialFormData]);

  const startEdit = useCallback(
    (item: T, transformToFormData: (item: T) => F) => {
      setEditing(item);
      setFormData(transformToFormData(item));
      setIsCreating(false);
    },
    []
  );

  const startCreate = useCallback(
    (defaultFormData?: Partial<F>) => {
      setIsCreating(true);
      setEditing(null);
      setFormData({
        ...createInitialFormData(),
        ...defaultFormData,
      });
    },
    [createInitialFormData]
  );

  return {
    editing,
    isCreating,
    formData,
    setFormData,
    resetForm,
    startEdit,
    startCreate,
  };
}
