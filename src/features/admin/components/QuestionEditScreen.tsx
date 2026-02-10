"use client";

import { Question } from "@/entities/question";
import { ResultPattern } from "@/entities/resultPattern";
import { QuestionAnswer } from "@/entities/questionAnswer";
import { getQuestions } from "@/features/survey/api/getQuestions";
import { getResultPatterns } from "@/features/survey/api/getResultPatterns";
import { getQuestionAnswers } from "@/features/survey/api/getQuestionAnswers";
import { QuestionManager } from "./QuestionManager";
import { ResultPatternManager } from "./ResultPatternManager";
import { QuestionAnswerManager } from "./QuestionAnswerManager";
import { AdminHeader } from "./AdminHeader";
import { useAsyncData } from "@/utils";
import { Spinner } from "@/components/ui";
import { BASE_PATH } from "@/lib/constants";
import type { AdminDashboardProps } from "@/features/admin";

export const QuestionEditScreen = ({ userEmail, userId, onLogout }: AdminDashboardProps) => {
  const {
    data: questions,
    loading: questionsLoading,
    refresh: refreshQuestions,
  } = useAsyncData<Question[]>(() => getQuestions());

  const {
    data: patterns,
    loading: patternsLoading,
    refresh: refreshPatterns,
  } = useAsyncData<ResultPattern[]>(() => getResultPatterns());

  const {
    data: questionAnswers,
    loading: questionAnswersLoading,
    refresh: refreshQuestionAnswers,
  } = useAsyncData<QuestionAnswer[]>(() => getQuestionAnswers());

  const isLoading = questionsLoading || patternsLoading || questionAnswersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="質問編集画面を読み込んでいます..." />
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
          href={`${BASE_PATH}/admin/results`}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          アンケート結果確認 →
        </a>
      </div>

      <div className="space-y-8">
        <QuestionManager questions={questions || []} onUpdate={refreshQuestions} />

        <div className="border-t pt-6 dark:border-gray-700">
          <QuestionAnswerManager
            questionAnswers={questionAnswers || []}
            questions={questions || []}
            onUpdate={refreshQuestionAnswers}
          />
        </div>

        <div className="border-t pt-6 dark:border-gray-700">
          <ResultPatternManager
            patterns={patterns || []}
            questions={questions || []}
            onUpdate={refreshPatterns}
          />
        </div>
      </div>
    </main>
  );
};
