"use client";

import { useState } from "react";
import { Question } from "@/entities/question";
import { createQuestion } from "../api/createQuestion";
import { updateQuestion } from "../api/updateQuestion";
import { deleteQuestion } from "../api/deleteQuestion";

type Props = {
  questions: Question[];
  onUpdate: () => void;
};

export const QuestionManager = ({ questions, onUpdate }: Props) => {
  const [editing, setEditing] = useState<Question | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", ""],
    order: 0,
  });

  const resetForm = () => {
    setFormData({ text: "", options: ["", "", ""], order: 0 });
    setEditing(null);
    setIsCreating(false);
  };

  const handleCreate = async () => {
    const validOptions = formData.options.filter((o) => o.trim());
    
    if (!formData.text.trim()) {
      alert("質問文を入力してください");
      return;
    }
    
    if (validOptions.length < 2) {
      alert("選択肢を2つ以上入力してください");
      return;
    }

    try {
      await createQuestion({
        text: formData.text,
        options: validOptions,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      console.error("質問の作成に失敗しました:", error);
      alert("質問の作成に失敗しました。もう一度お試しください。");
    }
  };

  const handleUpdate = async () => {
    const validOptions = formData.options.filter((o) => o.trim());
    
    if (!editing) {
      return;
    }
    
    if (!formData.text.trim()) {
      alert("質問文を入力してください");
      return;
    }
    
    if (validOptions.length < 2) {
      alert("選択肢を2つ以上入力してください");
      return;
    }

    try {
      await updateQuestion({
        id: editing.id,
        text: formData.text,
        options: validOptions,
        order: formData.order,
      });

      resetForm();
      onUpdate();
    } catch (error) {
      console.error("質問の更新に失敗しました:", error);
      alert("質問の更新に失敗しました。もう一度お試しください。");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この質問を削除しますか？")) return;

    try {
      await deleteQuestion(id);
      onUpdate();
    } catch (error) {
      console.error("質問の削除に失敗しました:", error);
      alert("質問の削除に失敗しました。もう一度お試しください。");
    }
  };

  const startEdit = (question: Question) => {
    setEditing(question);
    setFormData({
      text: question.text,
      options: [...question.options, ""],
      order: question.order,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditing(null);
    setFormData({
      text: "",
      options: ["", "", ""],
      order: questions.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">質問管理</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={startCreate}
        >
          新規質問作成
        </button>
      </div>

      {/* 質問リスト */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border rounded p-4 bg-white shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold mb-2">{q.text}</p>
                <ul className="ml-4 text-sm text-gray-600">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>・{opt}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  onClick={() => startEdit(q)}
                >
                  編集
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  onClick={() => handleDelete(q.id)}
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 作成・編集フォーム */}
      {(isCreating || editing) && (
        <div className="border rounded p-6 bg-gray-50 shadow-lg">
          <h3 className="text-lg font-bold mb-4">
            {editing ? "質問を編集" : "新規質問"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">質問文</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="質問を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                選択肢（最低2つ）
              </label>
              {formData.options.map((opt, idx) => (
                <div key={idx} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[idx] = e.target.value;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder={`選択肢 ${idx + 1}`}
                  />
                  {idx >= 2 && (
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const newOptions = formData.options.filter(
                          (_, i) => i !== idx
                        );
                        setFormData({ ...formData, options: newOptions });
                      }}
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
              <button
                className="text-blue-600 text-sm hover:text-blue-800"
                onClick={() =>
                  setFormData({
                    ...formData,
                    options: [...formData.options, ""],
                  })
                }
              >
                + 選択肢を追加
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                表示順序
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={resetForm}
              >
                キャンセル
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
