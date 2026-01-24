"use client";

import type { AdminHeaderProps } from "@/features/admin";

export const AdminHeader = ({ email, userId, onLogout }: AdminHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">管理者画面</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{email || userId}</p>
      </div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        onClick={onLogout}
      >
        ログアウト
      </button>
    </div>
  );
};
