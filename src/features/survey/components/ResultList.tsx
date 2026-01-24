"use client";

import { useEffect, useState } from "react";
import { watchResults } from "../api/watchResults";
import { getQuestionAnswers } from "../api/getQuestionAnswers";
import { findMatchingQuestionAnswer } from "../lib/matchQuestionAnswer";
import { Answer } from "@/entities/answer";
import { Question } from "@/entities/question";
import { QuestionAnswer } from "@/entities/questionAnswer";

type Props = {
  questions: Question[];
};

export const ResultList = ({ questions }: Props) => {
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
      {questions.map((q) => {
        const related = answers.filter(
          (a) => a.questionId === q.id
        );

        return (
          <div key={q.id} className="border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-bold mb-2">{q.text}</h3>

            {q.options.map((opt) => {
              const picked = related.filter(
                (a) => a.selectedOption === opt
              );

              // この選択肢に対応するパーソナライズな回答を取得
              const matchedQuestionAnswer = loading
                ? null
                : findMatchingQuestionAnswer(q.id, opt, questionAnswers);

              return (
                <div key={opt} className="mb-4">
                  <span className="font-medium">
                    {opt}（{picked.length}）
                  </span>

                  {/* パーソナライズな回答結果を表示 */}
                  {matchedQuestionAnswer && (
                    <div className="mt-2 ml-4 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white shadow-md">
                      <h4 className="text-lg font-bold mb-1">{matchedQuestionAnswer.name}</h4>
                      <p className="text-sm leading-relaxed">{matchedQuestionAnswer.message}</p>
                      {matchedQuestionAnswer.description && (
                        <p className="mt-2 text-xs leading-relaxed opacity-90">
                          {matchedQuestionAnswer.description}
                        </p>
                      )}
                    </div>
                  )}

                  <ul className="ml-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {picked.map((p) => (
                      <li key={p.id}>・{p.userName}</li>
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
