"use client";

import { signInAnonymously } from "../api/signInAnonymously";

export const AnonymousLoginButton = () => {
  const handleClick = async () => {
    await signInAnonymously();
  };

  return (
    <div className="p-6 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">一般ユーザー</h2>
      <p className="text-sm mb-4 text-gray-600">
        アンケートに回答する場合はこちら
      </p>
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleClick}
      >
        アンケートに回答する
      </button>
    </div>
  );
};
