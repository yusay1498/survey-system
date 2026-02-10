"use client";

import { Question } from "@/entities/question";
import { getQuestions } from "@/features/survey/api/getQuestions";
import { ResultList } from "@/features/survey/components/ResultList";
import { AdminHeader } from "./AdminHeader";
import { useAsyncData } from "@/utils";
import { Spinner } from "@/components/ui";
import { BASE_PATH } from "@/lib/constants";
import type { AdminDashboardProps } from "@/features/admin";

export const ResultScreen = ({ userEmail, userId, onLogout }: AdminDashboardProps) => {
  const {
    data: questions,
    loading: questionsLoading,
  } = useAsyncData<Question[]>(() => getQuestions());

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="アンケート結果を読み込んでいます..." />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <AdminHeader email={userEmail} userId={userId} onLogout={onLogout} />

      {/* ナビゲーション */}
      <div className="mb-6 flex gap-4">
        <a
          href={`${BASE_PATH}/admin`}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          ← 管理画面トップ
        </a>
        <a
          href={`${BASE_PATH}/admin/questions`}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          質問編集 →
        </a>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">回答結果</h2>
          <ResultList questions={questions || []} />
        </div>
      </div>
    </main>
  );
};
