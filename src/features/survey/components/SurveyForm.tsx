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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getQuestions().then((q) => {
      setQuestions(q);
      setLoading(false);
    });
  }, []);

  const handleOptionSelect = async (option: string) => {
    setSelectedOption(option);
    setSubmitting(true);

    const currentQuestion = questions[currentQuestionIndex];
    await submitAnswer({
      userId,
      userName,
      questionId: currentQuestion.id,
      selectedOption: option,
      createdAt: new Date(),
    });

    setSubmitting(false);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResults(false);
    } else {
      setCompleted(true);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (completed) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-green-100 border-2 border-green-500 rounded text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            すべての質問に回答しました！
          </h2>
          <p className="text-green-700">ご協力ありがとうございました。</p>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">全体の結果</h3>
          <ResultList questions={questions} />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="mb-4 text-gray-600">
        質問 {currentQuestionIndex + 1} / {questions.length}
      </div>

      {!showResults ? (
        <div className="p-6 border-2 rounded-lg bg-white shadow-lg">
          <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>

          <div className="space-y-2">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                className={`w-full text-left p-3 border-2 rounded transition-colors ${
                  selectedOption === opt
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                } ${submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !submitting && handleOptionSelect(opt)}
                disabled={submitting}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitting && (
            <p className="mt-4 text-center text-gray-600">送信中...</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-100 border-2 border-blue-500 rounded">
            <p className="font-bold text-blue-800">
              あなたの回答: {selectedOption}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">この質問の集計結果</h3>
            <ResultList questions={[currentQuestion]} />
          </div>

          <button
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1
              ? "次の質問へ"
              : "結果を見る"}
          </button>
        </div>
      )}
    </div>
  );
};
