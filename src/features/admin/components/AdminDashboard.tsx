"use client";

import { useEffect, useState } from "react";
import { Question } from "@/entities/question";
import { ResultPattern } from "@/entities/resultPattern";
import { getQuestions } from "@/features/survey/api/getQuestions";
import { getResultPatterns } from "@/features/survey/api/getResultPatterns";
import { QuestionManager } from "./QuestionManager";
import { ResultPatternManager } from "./ResultPatternManager";
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
  const [patterns, setPatterns] = useState<ResultPattern[]>([]);
  const [patternsLoaded, setPatternsLoaded] = useState(false);

  useEffect(() => {
    if (!questionsLoaded) {
      getQuestions()
        .then((fetchedQuestions) => {
          setQuestions(fetchedQuestions);
          setQuestionsLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load questions:", error);
          setQuestionsLoaded(true);
        });
    }
  }, [questionsLoaded]);

  useEffect(() => {
    if (!patternsLoaded) {
      getResultPatterns()
        .then((fetchedPatterns) => {
          setPatterns(fetchedPatterns);
          setPatternsLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load result patterns:", error);
          setPatternsLoaded(true);
        });
    }
  }, [patternsLoaded]);

  const loadQuestions = async () => {
    const fetchedQuestions = await getQuestions();
    setQuestions(fetchedQuestions);
  };

  const loadPatterns = async () => {
    const fetchedPatterns = await getResultPatterns();
    setPatterns(fetchedPatterns);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <AdminHeader email={userEmail} uid={userId} onLogout={onLogout} />

      <div className="space-y-8">
        <QuestionManager questions={questions} onUpdate={loadQuestions} />

        <div className="border-t pt-6 dark:border-gray-700">
          <ResultPatternManager 
            patterns={patterns} 
            questions={questions}
            onUpdate={loadPatterns} 
          />
        </div>

        <div className="border-t pt-6 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">回答結果</h2>
          <ResultList questions={questions} />
        </div>
      </div>
    </main>
  );
};
