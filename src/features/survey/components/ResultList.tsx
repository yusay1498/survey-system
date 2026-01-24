"use client";

import { useEffect, useState } from "react";
import { watchResults } from "../api/watchResults";
import { getQuestionAnswers } from "../api/getQuestionAnswers";
import { findMatchingQuestionAnswer } from "../lib/matchQuestionAnswer";
import { QuestionPersonalizedAnswer } from "./QuestionPersonalizedAnswer";
import { Answer } from "@/entities/answer";
import { Question } from "@/entities/question";
import { QuestionAnswer } from "@/entities/questionAnswer";

type ResultListProps = {
  questions: Question[];
};

export const ResultList = ({ questions }: ResultListProps) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchResults(setAnswers);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let mounted = true;
    
    getQuestionAnswers()
      .then((data) => {
        if (mounted) {
          setQuestionAnswers(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to load question answers:", error);
        if (mounted) {
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const relatedAnswers = answers.filter(
          (answer) => answer.questionId === question.id
        );

        return (
          <div key={question.id} className="border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-bold mb-2">{question.text}</h3>

            {question.options.map((option) => {
              const selectedAnswers = relatedAnswers.filter(
                (answer) => answer.selectedOption === option
              );

              // この選択肢に対応するパーソナライズな回答を取得
              const matchedQuestionAnswer = loading
                ? null
                : findMatchingQuestionAnswer(question.id, option, questionAnswers);

              return (
                <div key={option} className="mb-4">
                  <span className="font-medium">
                    {option}（{selectedAnswers.length}）
                  </span>

                  {/* パーソナライズな回答結果を表示 */}
                  {matchedQuestionAnswer && (
                    <div className="mt-2 ml-4">
                      <QuestionPersonalizedAnswer questionAnswer={matchedQuestionAnswer} />
                    </div>
                  )}

                  <ul className="ml-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {selectedAnswers.map((answer) => (
                      <li key={answer.id}>・{answer.userName}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
