"use client";

import { useState } from "react";
import type { NameInputProps } from "@/features/auth";

export const NameInput = ({ onSubmit }: NameInputProps) => {
  const [name, setName] = useState("");

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow dark:bg-gray-800 dark:border dark:border-gray-700">
      <h2 className="text-lg font-bold mb-4">名前を入力してください</h2>

      <input
        className="w-full border rounded px-3 py-2 mb-4 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="表示名"
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        disabled={!name}
        onClick={() => onSubmit(name)}
      >
        決定
      </button>
    </div>
  );
};
