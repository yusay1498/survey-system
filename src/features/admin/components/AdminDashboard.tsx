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
import { ResultList } from "@/features/survey/components/ResultList";
import { AdminHeader } from "./AdminHeader";
import { useAsyncData } from "@/utils";
import { Spinner } from "@/components/ui";

type AdminDashboardProps = {
  userEmail: string | null;
  userId: string;
  onLogout: () => void;
};

export const AdminDashboard = ({ userEmail, userId, onLogout }: AdminDashboardProps) => {
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
        <Spinner size="lg" label="管理画面を読み込んでいます..." />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <AdminHeader email={userEmail} userId={userId} onLogout={onLogout} />

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

        <div className="border-t pt-6 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">回答結果</h2>
          <ResultList questions={questions || []} />
        </div>
      </div>
    </main>
  );
};
