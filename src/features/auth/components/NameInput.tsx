"use client";

import { useState } from "react";

type Props = {
  onSubmit: (name: string) => void;
};

export const NameInput = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">名前を入力してください</h2>

      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="表示名"
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={!name}
        onClick={() => onSubmit(name)}
      >
        決定
      </button>
    </div>
  );
};
