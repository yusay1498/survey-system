"use client";

import { useEffect, useState } from "react";
import { watchResults } from "../api/watchResults";
import { Answer } from "@/entities/answer";
import { Question } from "@/entities/question";

type Props = {
  questions: Question[];
};

export const ResultList = ({ questions }: Props) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const unsubscribe = watchResults(setAnswers);
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {questions.map((q) => {
        const related = answers.filter(
          (a) => a.questionId === q.id
        );

        return (
          <div key={q.id} className="border rounded p-4">
            <h3 className="font-bold mb-2">{q.text}</h3>

            {q.options.map((opt) => {
              const picked = related.filter(
                (a) => a.selectedOption === opt
              );

              return (
                <div key={opt} className="mb-1">
                  <span className="font-medium">
                    {opt}（{picked.length}）
                  </span>

                  <ul className="ml-4 text-sm text-gray-600">
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
