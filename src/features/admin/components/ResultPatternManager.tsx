"use client";

import { useState } from "react";
import { ResultPattern, ResultCondition } from "@/entities/resultPattern";
import { Question } from "@/entities/question";
import { createResultPattern } from "../api/createResultPattern";
import { updateResultPattern } from "../api/updateResultPattern";
import { deleteResultPattern } from "../api/deleteResultPattern";

type Props = {
  patterns: ResultPattern[];
  questions: Question[];
  onUpdate: () => void;
};

type FormData = {
  name: string;
  message: string;
  description: string;
  conditions: ResultCondition[];
  priority: number;
  order: number;
};

export const ResultPatternManager = ({ patterns, questions, onUpdate }: Props) => {
  const [editing, setEditing] = useState<ResultPattern | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    message: "",
    description: "",
    conditions: [{ questionId: "", selectedOption: "" }],
    priority: 10,
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      message: "",
      description: "",
      conditions: [{ questionId: "", selectedOption: "" }],
      priority: 10,
      order: 0,
    });
    setEditing(null);
    setIsCreating(false);
  };

  const validateForm = (): ResultCondition[] | null => {
    if (!formData.name.trim()) {
      alert("結果パターン名を入力してください");
      return null;
    }
    
    if (!formData.message.trim()) {
      alert("メッセージを入力してください");
      return null;
    }

    const validConditions = formData.conditions.filter(
      (c) => c.questionId && c.selectedOption.trim()
    );

    if (validConditions.length === 0) {
      alert("少なくとも1つの条件を設定してください");
      return null;
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
      console.error("結果パターンの作成に失敗しました:", error);
      alert("結果パターンの作成に失敗しました。もう一度お試しください。");
    }
  };

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }

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
      console.error("結果パターンの更新に失敗しました:", error);
      alert("結果パターンの更新に失敗しました。もう一度お試しください。");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この結果パターンを削除しますか？")) return;

    try {
      await deleteResultPattern(id);
      onUpdate();
    } catch (error) {
      console.error("結果パターンの削除に失敗しました:", error);
      alert("結果パターンの削除に失敗しました。もう一度お試しください。");
    }
  };

  const startEdit = (pattern: ResultPattern) => {
    setEditing(pattern);
    setFormData({
      name: pattern.name,
      message: pattern.message,
      description: pattern.description || "",
      conditions: [...pattern.conditions],
      priority: pattern.priority,
      order: pattern.order,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditing(null);
    setFormData({
      name: "",
      message: "",
      description: "",
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
    const newConditions = formData.conditions.filter((_, i) => i !== index);
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
    return question ? question.text : questionId;
  };

  // Get options for a specific question
  const getQuestionOptions = (questionId: string): string[] => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.options : [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">結果パターン管理</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          onClick={startCreate}
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
                      {pattern.conditions.map((condition, idx) => (
                        <li key={idx}>
                          ・{getQuestionText(condition.questionId)} → 「{condition.selectedOption}」
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => startEdit(pattern)}
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
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
