"use client";

import { useState } from "react";
import { QuestionAnswer, QuestionAnswerCondition } from "@/entities/questionAnswer";
import { Question } from "@/entities/question";
import { createQuestionAnswer } from "../api/createQuestionAnswer";
import { updateQuestionAnswer } from "../api/updateQuestionAnswer";
import { deleteQuestionAnswer } from "../api/deleteQuestionAnswer";

type Props = {
  questionAnswers: QuestionAnswer[];
  questions: Question[];
  onUpdate: () => void;
};

type FormData = {
  questionId: string;
  name: string;
  message: string;
  description: string;
  condition: QuestionAnswerCondition;
  order: number;
};

export const QuestionAnswerManager = ({ questionAnswers, questions, onUpdate }: Props) => {
  const [editing, setEditing] = useState<QuestionAnswer | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    questionId: "",
    name: "",
    message: "",
    description: "",
    condition: { selectedOption: "" },
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      questionId: "",
      name: "",
      message: "",
      description: "",
      condition: { selectedOption: "" },
      order: 0,
    });
    setEditing(null);
    setIsCreating(false);
  };

  const validateForm = (): boolean => {
    if (!formData.questionId) {
      alert("質問を選択してください");
      return false;
    }
    
    if (!formData.name.trim()) {
      alert("回答パターン名を入力してください");
      return false;
    }
    
    if (!formData.message.trim()) {
      alert("メッセージを入力してください");
      return false;
    }

    if (!formData.condition.selectedOption.trim()) {
      alert("選択肢を指定してください");
      return false;
    }

    // 選択された質問が存在するか確認
    const question = questions.find((q) => q.id === formData.questionId);
    if (!question) {
      alert("選択された質問が見つかりません");
      return false;
    }

    // 選択肢が質問のオプションに含まれているか確認
    if (!question.options.includes(formData.condition.selectedOption)) {
      alert("選択された選択肢が質問に存在しません");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createQuestionAnswer({
        questionId: formData.questionId,
        name: formData.name,
        message: formData.message,
        description: formData.description,
        condition: formData.condition,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      console.error("質問回答パターンの作成に失敗しました:", error);
      alert("質問回答パターンの作成に失敗しました。もう一度お試しください。");
    }
  };

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }

    if (!validateForm()) return;

    try {
      await updateQuestionAnswer({
        id: editing.id,
        questionId: formData.questionId,
        name: formData.name,
        message: formData.message,
        description: formData.description,
        condition: formData.condition,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      console.error("質問回答パターンの更新に失敗しました:", error);
      alert("質問回答パターンの更新に失敗しました。もう一度お試しください。");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この質問回答パターンを削除しますか？")) return;

    try {
      await deleteQuestionAnswer(id);
      onUpdate();
    } catch (error) {
      console.error("質問回答パターンの削除に失敗しました:", error);
      alert("質問回答パターンの削除に失敗しました。もう一度お試しください。");
    }
  };

  const startEdit = (questionAnswer: QuestionAnswer) => {
    setEditing(questionAnswer);
    setFormData({
      questionId: questionAnswer.questionId,
      name: questionAnswer.name,
      message: questionAnswer.message,
      description: questionAnswer.description || "",
      condition: { ...questionAnswer.condition },
      order: questionAnswer.order,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditing(null);
    setFormData({
      questionId: "",
      name: "",
      message: "",
      description: "",
      condition: { selectedOption: "" },
      order: questionAnswers.length,
    });
  };

  // 質問IDから質問テキストを取得
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getQuestionText = (questionId: string): string => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      return question.text;
    }
    if (!questionId) {
      return "";
    }
    return `削除された質問 (ID: ${questionId})`;
  };

  // 質問IDから選択肢リストを取得
  const getQuestionOptions = (questionId: string): string[] => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.options : [];
  };

  // 質問IDごとにグループ化
  const groupedByQuestion = questions.map((question) => ({
    question,
    answers: questionAnswers.filter((qa) => qa.questionId === question.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">質問回答パターン管理</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          onClick={startCreate}
        >
          新規パターン作成
        </button>
      </div>

      {/* 質問ごとにグループ化された回答パターンリスト */}
      <div className="space-y-6">
        {groupedByQuestion.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            質問がありません。
          </p>
        ) : (
          groupedByQuestion.map(({ question, answers }) => (
            <div key={question.id} className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                {question.text}
              </h3>
              
              {answers.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  この質問の回答パターンはまだありません
                </p>
              ) : (
                <div className="space-y-3">
                  {answers.map((qa) => (
                    <div
                      key={qa.id}
                      className="border rounded p-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{qa.name}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                              選択肢: {qa.condition.selectedOption}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1 dark:text-gray-300">
                            {qa.message}
                          </p>
                          {qa.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {qa.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            onClick={() => startEdit(qa)}
                          >
                            編集
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                            onClick={() => handleDelete(qa.id)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 作成・編集フォーム */}
      {(isCreating || editing) && (
        <div className="border rounded p-6 bg-gray-50 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4">
            {editing ? "質問回答パターンを編集" : "新規質問回答パターン"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                質問 <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={formData.questionId}
                onChange={(e) =>
                  setFormData({ ...formData, questionId: e.target.value, condition: { selectedOption: "" } })
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

            {formData.questionId && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  選択肢 <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.condition.selectedOption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      condition: { selectedOption: e.target.value },
                    })
                  }
                >
                  <option value="">-- 選択肢を選択 --</option>
                  {getQuestionOptions(formData.questionId).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                placeholder="例: ポジティブタイプ"
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
                placeholder="例: 素晴らしい選択です！"
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
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                小さい方が優先して表示されます
              </p>
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
