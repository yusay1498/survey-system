"use client";

import { AdminHeader } from "./AdminHeader";
import { BASE_PATH } from "@/lib/constants";
import type { AdminDashboardProps } from "@/features/admin";

export const AdminMenu = ({ userEmail, userId, onLogout }: AdminDashboardProps) => {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <AdminHeader email={userEmail} userId={userId} onLogout={onLogout} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* 質問編集画面へのリンク */}
        <a
          href={`${BASE_PATH}/admin/questions`}
          className="block p-8 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">質問編集</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            アンケートの質問、回答選択肢、結果パターンを管理します
          </p>
        </a>

        {/* アンケート結果確認画面へのリンク */}
        <a
          href={`${BASE_PATH}/admin/results`}
          className="block p-8 border rounded-lg bg-white shadow hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">アンケート結果確認</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            ユーザーから送信されたアンケート結果を確認します
          </p>
        </a>
      </div>
    </main>
  );
};
