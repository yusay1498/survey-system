"use client";

import { useEffect, useState } from "react";
import { Question } from "@/entities/question";
import { getQuestions } from "@/features/survey/api/getQuestions";
import { QuestionManager } from "./QuestionManager";
import { ResultList } from "@/features/survey/components/ResultList";
import { AdminHeader } from "./AdminHeader";

type Props = {
  userEmail: string | null;
  userId: string;
  onLogout: () => void;
};

export const AdminDashboard = ({ userEmail, userId, onLogout }: Props) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    if (!questionsLoaded) {
      getQuestions()
        .then((q) => {
          setQuestions(q);
          setQuestionsLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load questions:", error);
          setQuestionsLoaded(true);
        });
    }
  }, [questionsLoaded]);

  const loadQuestions = async () => {
    const q = await getQuestions();
    setQuestions(q);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <AdminHeader email={userEmail} uid={userId} onLogout={onLogout} />

      <div className="space-y-8">
        <QuestionManager questions={questions} onUpdate={loadQuestions} />

        <div className="border-t pt-6 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">回答結果</h2>
          <ResultList questions={questions} />
        </div>
      </div>
    </main>
  );
};
