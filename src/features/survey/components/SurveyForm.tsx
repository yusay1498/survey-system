"use client";

import { useEffect, useState, useRef } from "react";
import { Question } from "@/entities/question";
import { Answer } from "@/entities/answer";
import { ResultPattern } from "@/entities/resultPattern";
import { QuestionAnswer } from "@/entities/questionAnswer";
import { ResultList } from "./ResultList";
import { PersonalityResult } from "./PersonalityResult";
import { QuestionPersonalizedAnswer } from "./QuestionPersonalizedAnswer";
import { Spinner } from "@/components/ui";
import {
  getQuestions,
  submitAnswer,
  getResultPatterns,
  getQuestionAnswers,
  findMatchingPattern,
  findMatchingQuestionAnswer,
} from "@/features/survey";
import { handleError, confirmAction } from "@/utils";
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";

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
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [resultPatterns, setResultPatterns] = useState<ResultPattern[]>([]);
  const [matchedPattern, setMatchedPattern] = useState<ResultPattern | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<QuestionAnswer | null>(null);

  useEffect(() => {
    Promise.all([
      getQuestions(),
      getResultPatterns(),
      getQuestionAnswers()
    ])
      .then(([fetchedQuestions, fetchedPatterns, fetchedQuestionAnswers]) => {
        setQuestions(fetchedQuestions);
        setResultPatterns(fetchedPatterns);
        setQuestionAnswers(fetchedQuestionAnswers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load survey data:", error);
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  const handleOptionSelect = async (option: string) => {
    // Prevent multiple simultaneous submissions
    if (submitting) return;

    // Confirmation dialog before submission
    if (!confirmAction(CONFIRMATION_MESSAGES.SUBMIT_ANSWER(option))) {
      return;
    }

    setSelectedOption(option);
    setSubmitting(true);

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      const newAnswer: Answer = {
        userId,
        userName,
        questionId: currentQuestion.id,
        selectedOption: option,
        createdAt: new Date(),
      };

      await submitAnswer(newAnswer);

      // Store answer in state to avoid race condition when matching patterns
      setUserAnswers(prev => [...prev, { ...newAnswer, id: `${userId}-${currentQuestion.id}` }]);

      // 質問ごとのパーソナライズな回答を検索
      const matchedQuestionAnswer = findMatchingQuestionAnswer(
        currentQuestion.id,
        option,
        questionAnswers
      );
      setCurrentQuestionAnswer(matchedQuestionAnswer);

      setSubmitting(false);
      setShowResults(true);
    } catch (error) {
      setSubmitting(false);
      setSelectedOption(null); // Reset selection to allow retry
      handleError("Failed to submit answer", error, ERROR_MESSAGES.SUBMIT_ANSWER_FAILED);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResults(false);
      setCurrentQuestionAnswer(null); // リセット
      setFocusedOptionIndex(0); // Reset focus for next question
      optionRefs.current = []; // Clear refs for next question
    } else {
      // All questions completed - calculate result from locally stored answers
      try {
        const pattern = findMatchingPattern(userAnswers, resultPatterns);
        setMatchedPattern(pattern);
        setCompleted(true);
      } catch (error) {
        console.error("Failed to calculate result pattern:", error);
        // Still show completion screen even if pattern matching fails
        // User will see the default completion message
        setCompleted(true);
      }
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

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Spinner size="lg" label="アンケートを読み込んでいます..." />
    </div>
  );

  // Handle loading error
  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">
          アンケートデータの読み込みに失敗しました。
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </button>
      </div>
    );
  }

  // Handle empty questions scenario
  if (questions.length === 0) {
    return <p>現在、利用可能な質問がありません。</p>;
  }

  if (completed) {
    return (
      <div className="space-y-6">
        <PersonalityResult 
          userAnswers={userAnswers} 
          pattern={matchedPattern}
          questionAnswers={questionAnswers}
          questions={questions}
        />
        
        <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            全体の集計結果
          </h3>
          <ResultList questions={questions} />
        </div>
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
            <div className="mt-4 flex items-center justify-center">
              <Spinner size="sm" label="送信中..." />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-100 border-2 border-blue-500 rounded dark:bg-blue-900 dark:border-blue-400">
            <p className="font-bold text-blue-800 dark:text-blue-200">
              あなたの回答: {selectedOption}
            </p>
          </div>

          {/* 質問ごとのパーソナライズな回答を表示 */}
          {currentQuestionAnswer && (
            <QuestionPersonalizedAnswer questionAnswer={currentQuestionAnswer} />
          )}

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
