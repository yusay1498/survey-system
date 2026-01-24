"use client";

import { ResultPattern, ResultCondition } from "@/entities/resultPattern";
import type { ResultPatternFormData, ResultPatternManagerProps } from "@/features/admin";
import {
  createResultPattern,
  updateResultPattern,
  deleteResultPattern,
} from "@/features/admin";
import {
  validateResultPatternForm,
  handleError,
  confirmAction,
  useCRUDManager,
} from "@/utils";
import {
  CONFIRMATION_MESSAGES,
  ERROR_MESSAGES,
} from "@/lib/constants";

const createInitialFormData = (): ResultPatternFormData => ({
  name: "",
  message: "",
  description: "",
  conditions: [{ questionId: "", selectedOption: "" }],
  priority: 10,
  order: 0,
});

export const ResultPatternManager = ({ patterns, questions, onUpdate }: ResultPatternManagerProps) => {
  const {
    editing,
    isCreating,
    formData,
    setFormData,
    resetForm,
    startEdit,
    startCreate,
  } = useCRUDManager<ResultPattern, ResultPatternFormData>(createInitialFormData);

  const validateForm = (): ResultCondition[] | undefined => {
    const nameValidationError = validateResultPatternForm(
      formData.name,
      formData.message,
      formData.conditions.length
    );

    if (nameValidationError) {
      alert(nameValidationError);
      return undefined;
    }

    const validConditions = formData.conditions.filter((condition) => {
      // 基本的なチェック: questionIdと selectedOptionが存在するか
      if (!condition.questionId || !condition.selectedOption.trim()) {
        return false;
      }
      
      // questionIdが現在の質問リストに存在するかチェック
      const question = questions.find((question) => question.id === condition.questionId);
      if (!question) {
        return false;
      }
      
      // selectedOptionが質問の選択肢に存在するかチェック
      if (!question.options.includes(condition.selectedOption)) {
        return false;
      }
      
      return true;
    });

    if (validConditions.length === 0) {
      alert("少なくとも1つの有効な条件を設定してください");
      return undefined;
    }

    // 無効な条件が含まれていた場合は警告
    const invalidCount = formData.conditions.length - validConditions.length;
    if (invalidCount > 0) {
      alert(`${invalidCount}件の無効な条件が除外されました。削除された質問や選択肢を参照している条件は保存できません。`);
    }

    return validConditions;
  };

  const handleCreate = async () => {
    const validConditions = validateForm();
    if (!validConditions) return;

    try {
      await createResultPattern({
        name: formData.name,
        message: formData.message,
        description: formData.description,
        conditions: validConditions,
        priority: formData.priority,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      handleError(
        "結果パターンの作成に失敗しました",
        error,
        ERROR_MESSAGES.CREATE_RESULT_PATTERN_FAILED
      );
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;

    const validConditions = validateForm();
    if (!validConditions) return;

    try {
      await updateResultPattern({
        id: editing.id,
        name: formData.name,
        message: formData.message,
        description: formData.description,
        conditions: validConditions,
        priority: formData.priority,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      handleError(
        "結果パターンの更新に失敗しました",
        error,
        ERROR_MESSAGES.UPDATE_RESULT_PATTERN_FAILED
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirmAction(CONFIRMATION_MESSAGES.DELETE_RESULT_PATTERN)) return;

    try {
      await deleteResultPattern(id);
      onUpdate();
    } catch (error) {
      handleError(
        "結果パターンの削除に失敗しました",
        error,
        ERROR_MESSAGES.DELETE_RESULT_PATTERN_FAILED
      );
    }
  };

  const handleStartEdit = (pattern: ResultPattern) => {
    startEdit(pattern, (pattern) => ({
      name: pattern.name,
      message: pattern.message,
      description: pattern.description || "",
      conditions: [...pattern.conditions],
      priority: pattern.priority,
      order: pattern.order,
    }));
  };

  const handleStartCreate = () => {
    startCreate({
      conditions: [{ questionId: "", selectedOption: "" }],
      priority: 10,
      order: patterns.length,
    });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { questionId: "", selectedOption: "" }],
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = formData.conditions.filter((_, conditionIndex) => conditionIndex !== index);
    setFormData({ ...formData, conditions: newConditions });
  };

  const updateCondition = (index: number, field: keyof ResultCondition, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  // Get question text by ID
  const getQuestionText = (questionId: string): string => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      return question.text;
    }
    // 質問が存在しない場合は明確な警告を表示
    if (!questionId) {
      return "";
    }
    return `削除された質問 (ID: ${questionId})`;
  };

  // Get options for a specific question
  const getQuestionOptions = (questionId: string): string[] => {
    const question = questions.find((question) => question.id === questionId);
    return question ? question.options : [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">結果パターン管理</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          onClick={handleStartCreate}
        >
          新規パターン作成
        </button>
      </div>

      {/* パターンリスト */}
      <div className="space-y-4">
        {patterns.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            結果パターンがありません。新規作成してください。
          </p>
        ) : (
          patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="border rounded p-4 bg-white shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{pattern.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                      優先度: {pattern.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 dark:text-gray-300">
                    {pattern.message}
                  </p>
                  {pattern.description && (
                    <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">
                      {pattern.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    <p className="font-semibold mb-1">条件:</p>
                    <ul className="ml-4 space-y-1">
                      {pattern.conditions.map((condition, conditionIndex) => (
                        <li key={conditionIndex}>
                          ・{getQuestionText(condition.questionId)} → 「{condition.selectedOption}」
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => handleStartEdit(pattern)}
                  >
                    編集
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    onClick={() => handleDelete(pattern.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 作成・編集フォーム */}
      {(isCreating || editing) && (
        <div className="border rounded p-6 bg-gray-50 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4">
            {editing ? "結果パターンを編集" : "新規結果パターン"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                パターン名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例: リーダータイプ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="例: あなたは生まれながらのリーダーです！"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                詳細説明（オプション）
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="追加の説明文"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                条件（少なくとも1つ） <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                これらの条件がすべて満たされた場合にこの結果が表示されます
              </p>
              {formData.conditions.map((condition, idx) => (
                <div key={idx} className="mb-3 p-3 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">質問</label>
                      <select
                        className="w-full border rounded px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                        value={condition.questionId}
                        onChange={(e) =>
                          updateCondition(idx, "questionId", e.target.value)
                        }
                      >
                        <option value="">-- 質問を選択 --</option>
                        {questions.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.text}
                          </option>
                        ))}
                      </select>
                    </div>

                    {condition.questionId && (
                      <div>
                        <label className="block text-xs font-medium mb-1">選択肢</label>
                        <select
                          className="w-full border rounded px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                          value={condition.selectedOption}
                          onChange={(e) =>
                            updateCondition(idx, "selectedOption", e.target.value)
                          }
                        >
                          <option value="">-- 選択肢を選択 --</option>
                          {getQuestionOptions(condition.questionId).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formData.conditions.length > 1 && (
                      <button
                        className="text-red-600 text-xs hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => removeCondition(idx)}
                      >
                        この条件を削除
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                className="text-blue-600 text-sm hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={addCondition}
              >
                + 条件を追加
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  優先度
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.priority}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setFormData({
                      ...formData,
                      priority: isNaN(value) ? formData.priority : value,
                    });
                  }}
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  高い方が優先してマッチします
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  表示順序
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setFormData({
                      ...formData,
                      order: isNaN(value) ? formData.order : value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
                onClick={resetForm}
              >
                キャンセル
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={editing ? handleUpdate : handleCreate}
              >
                {editing ? "更新" : "作成"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
