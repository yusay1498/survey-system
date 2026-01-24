"use client";

import { useEffect, useState } from "react";
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
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [questionAnswersLoaded, setQuestionAnswersLoaded] = useState(false);

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

  useEffect(() => {
    if (!questionAnswersLoaded) {
      getQuestionAnswers()
        .then((fetchedQuestionAnswers) => {
          setQuestionAnswers(fetchedQuestionAnswers);
          setQuestionAnswersLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load question answers:", error);
          setQuestionAnswersLoaded(true);
        });
    }
  }, [questionAnswersLoaded]);

  const loadQuestions = async () => {
    const fetchedQuestions = await getQuestions();
    setQuestions(fetchedQuestions);
  };

  const loadPatterns = async () => {
    const fetchedPatterns = await getResultPatterns();
    setPatterns(fetchedPatterns);
  };

  const loadQuestionAnswers = async () => {
    const fetchedQuestionAnswers = await getQuestionAnswers();
    setQuestionAnswers(fetchedQuestionAnswers);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <AdminHeader email={userEmail} uid={userId} onLogout={onLogout} />

      <div className="space-y-8">
        <QuestionManager questions={questions} onUpdate={loadQuestions} />

        <div className="border-t pt-6 dark:border-gray-700">
          <QuestionAnswerManager 
            questionAnswers={questionAnswers} 
            questions={questions}
            onUpdate={loadQuestionAnswers} 
          />
        </div>

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
