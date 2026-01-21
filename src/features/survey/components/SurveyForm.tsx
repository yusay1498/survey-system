"use client";

import { useEffect, useState } from "react";
import { Question } from "@/entities/question";
import { ResultList } from "./ResultList";
import { getQuestions } from "../api/getQuestions";
import { submitAnswer } from "../api/submitAnswer";

type Props = {
  userId: string;
  userName: string;
};

export const SurveyForm = ({ userId, userName }: Props) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions().then((q) => {
      setQuestions(q);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    for (const q of questions) {
      const selected = answers[q.id];
      if (!selected) continue;

      await submitAnswer({
        userId,
        userName,
        questionId: q.id,
        selectedOption: selected,
        createdAt: new Date(),
      });
    }

    alert("回答を送信しました");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="p-4 border rounded">
          <p className="font-bold mb-2">{q.text}</p>

          {q.options.map((opt) => (
            <label key={opt} className="block mb-1">
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [q.id]: opt,
                  }))
                }
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        送信
      </button>
      <ResultList questions={questions} />
    </div>
  );
};
