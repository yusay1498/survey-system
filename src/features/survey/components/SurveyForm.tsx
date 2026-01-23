"use client";

import { useEffect, useState, useRef } from "react";
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
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    getQuestions().then((q) => {
      setQuestions(q);
      setLoading(false);
    });
  }, []);

  const handleOptionSelect = async (option: string) => {
    // Prevent multiple simultaneous submissions
    if (submitting) {
      return;
    }

    // Confirmation dialog before submission
    const confirmSubmit = window.confirm(
      `「${option}」を選択して回答を送信しますか？\n\n送信後は変更できません。`
    );
    
    if (!confirmSubmit) {
      return;
    }

    setSelectedOption(option);
    setSubmitting(true);

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      await submitAnswer({
        userId,
        userName,
        questionId: currentQuestion.id,
        selectedOption: option,
        createdAt: new Date(),
      });

      setSubmitting(false);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setSubmitting(false);
      setSelectedOption(null); // Reset selection to allow retry
      alert("回答の送信に失敗しました。もう一度お試しください。");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResults(false);
      setFocusedOptionIndex(0); // Reset focus for next question
      optionRefs.current = []; // Clear refs for next question
    } else {
      setCompleted(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionsLength: number) => {
    if (submitting) return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        setFocusedOptionIndex((prev) => (prev + 1) % optionsLength);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        setFocusedOptionIndex((prev) => (prev - 1 + optionsLength) % optionsLength);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        optionRefs.current[focusedOptionIndex]?.click();
        break;
    }
  };

  // Focus the option button when focusedOptionIndex changes
  useEffect(() => {
    if (!showResults && 
        focusedOptionIndex >= 0 && 
        focusedOptionIndex < optionRefs.current.length &&
        optionRefs.current[focusedOptionIndex]) {
      optionRefs.current[focusedOptionIndex]?.focus();
    }
  }, [focusedOptionIndex, showResults]);

  if (loading) return <p>Loading...</p>;

  // Handle empty questions scenario
  if (questions.length === 0) {
    return <p>現在、利用可能な質問がありません。</p>;
  }

  if (completed) {
    return (
      <div className="space-y-6">
        <ResultList questions={questions} />
      </div>
    );
  }

  // Bounds check for current question index
  if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
    return <p>エラー: 質問が見つかりませんでした。</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        質問 {currentQuestionIndex + 1} / {questions.length}
      </div>

      {!showResults ? (
        <div 
          className="p-6 border-2 rounded-lg bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700"
          role="radiogroup"
          aria-label={currentQuestion.text}
        >
          <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>

          <div 
            className="space-y-2"
            onKeyDown={(e) => handleKeyDown(e, currentQuestion.options.length)}
          >
            {currentQuestion.options.map((opt, index) => (
              <button
                key={opt}
                ref={(el) => { optionRefs.current[index] = el; }}
                role="radio"
                aria-checked={selectedOption === opt}
                tabIndex={index === focusedOptionIndex ? 0 : -1}
                className={`w-full text-left p-3 border-2 rounded transition-colors ${
                  selectedOption === opt
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-gray-700"
                } ${submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !submitting && handleOptionSelect(opt)}
                onFocus={() => setFocusedOptionIndex(index)}
                disabled={submitting}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitting && (
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">送信中...</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-100 border-2 border-blue-500 rounded dark:bg-blue-900 dark:border-blue-400">
            <p className="font-bold text-blue-800 dark:text-blue-200">
              あなたの回答: {selectedOption}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">この質問の集計結果</h3>
            <ResultList questions={[currentQuestion]} />
          </div>

          <button
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600"
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
