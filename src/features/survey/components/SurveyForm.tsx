"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, BASE_PATH } from "@/lib/constants";

type Props = {
  userId: string;
  userName: string;
};

// LocalStorageに保存する進捗データの型
type SurveyProgress = {
  currentQuestionIndex: number;
  showResults: boolean;
  completed: boolean;
  userAnswers: Answer[];
  selectedOption: string | null;
  matchedPatternId: string | null;
  currentQuestionAnswerId: string | null;
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
  const restoredUserIdRef = useRef<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [resultPatterns, setResultPatterns] = useState<ResultPattern[]>([]);
  const [matchedPattern, setMatchedPattern] = useState<ResultPattern | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<QuestionAnswer | null>(null);

  // LocalStorageのキー
  const storageKey = `survey_progress_${userId}`;
  const userNameStorageKey = `user_name_${userId}`;

  // 進捗を保存
  const saveProgress = useCallback((progress: Partial<SurveyProgress>) => {
    try {
      const currentProgress = localStorage.getItem(storageKey);
      const existingProgress = currentProgress ? JSON.parse(currentProgress) : {};
      const updatedProgress = { ...existingProgress, ...progress };
      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [storageKey]);

  // 進捗をクリア
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(userNameStorageKey);
    } catch (error) {
      console.error("Failed to clear progress:", error);
    }
  }, [storageKey, userNameStorageKey]);

  // データ読み込み
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

  // 進捗復元（データ読み込み後、クライアントサイドのみで実行）
  useEffect(() => {
    // SSRでは実行しない（localStorageはクライアントのみ）
    if (typeof window === 'undefined' || questions.length === 0 || loading) return;

    // 既に復元済みの場合はスキップ（userIdが変わった時のみ復元）
    if (restoredUserIdRef.current === userId) return;
    if (restoredUserIdRef.current === userId) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        restoredUserIdRef.current = userId;
        return;
      }

      const savedProgress = JSON.parse(saved) as SurveyProgress;

      // バリデーション: currentQuestionIndex が範囲内か
      const restoredIndex =
        typeof savedProgress.currentQuestionIndex === "number"
          ? savedProgress.currentQuestionIndex
          : 0;
      const isIndexInRange =
        restoredIndex >= 0 && restoredIndex < questions.length;

      if (!isIndexInRange) {
        console.warn("Invalid currentQuestionIndex in saved progress");
        restoredUserIdRef.current = userId;
        return;
      }

      // バリデーション: userAnswers が配列で、各要素が必須フィールドを持つか
      const rawUserAnswers = Array.isArray(savedProgress.userAnswers)
        ? savedProgress.userAnswers
        : [];
      const hasValidUserAnswers = rawUserAnswers.every((answer: Answer) => {
        return (
          answer &&
          typeof answer === "object" &&
          "userId" in answer &&
          "userName" in answer &&
          "questionId" in answer &&
          "selectedOption" in answer
        );
      });

      if (!hasValidUserAnswers) {
        console.warn("Invalid userAnswers in saved progress");
        restoredUserIdRef.current = userId;
        return;
      }

      // 進捗を復元（localStorage同期のため、この場所でのsetStateは適切）
      /* eslint-disable react-hooks/set-state-in-effect */
      setCurrentQuestionIndex(restoredIndex);
      setShowResults(!!savedProgress.showResults);
      setCompleted(!!savedProgress.completed);
      setUserAnswers(rawUserAnswers);
      setSelectedOption(
        typeof savedProgress.selectedOption === "string"
          ? savedProgress.selectedOption
          : null
      );

      // マッチしたパターンを復元（存在する場合のみ）
      if (savedProgress.completed && savedProgress.matchedPatternId != null) {
        const pattern = resultPatterns.find(
          (p) => p.id === savedProgress.matchedPatternId
        );
        if (pattern) {
          setMatchedPattern(pattern);
        }
      }

      // currentQuestionAnswer を復元
      if (savedProgress.showResults && savedProgress.currentQuestionAnswerId != null) {
        const questionAnswer = questionAnswers.find(
          (qa) => qa.id === savedProgress.currentQuestionAnswerId
        );
        if (questionAnswer) {
          setCurrentQuestionAnswer(questionAnswer);
        }
      }
      /* eslint-enable react-hooks/set-state-in-effect */

      restoredUserIdRef.current = userId;
    } catch (error) {
      console.error("Failed to restore progress:", error);
    }
  }, [questions, resultPatterns, questionAnswers, storageKey, userId, loading]);

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
      const updatedAnswers = [...userAnswers, { ...newAnswer, id: `${userId}-${currentQuestion.id}` }];
      setUserAnswers(updatedAnswers);

      // 質問ごとのパーソナライズな回答を検索
      const matchedQuestionAnswer = findMatchingQuestionAnswer(
        currentQuestion.id,
        option,
        questionAnswers
      );
      setCurrentQuestionAnswer(matchedQuestionAnswer);

      setSubmitting(false);
      setShowResults(true);

      // 進捗を保存
      saveProgress({
        currentQuestionIndex,
        showResults: true,
        selectedOption: option,
        userAnswers: updatedAnswers,
        completed: false,
        currentQuestionAnswerId: matchedQuestionAnswer?.id || null,
      });
    } catch (error) {
      setSubmitting(false);
      setSelectedOption(null); // Reset selection to allow retry
      handleError("Failed to submit answer", error, ERROR_MESSAGES.SUBMIT_ANSWER_FAILED);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShowResults(false);
      setCurrentQuestionAnswer(null); // リセット
      setFocusedOptionIndex(0); // Reset focus for next question
      optionRefs.current = []; // Clear refs for next question

      // 進捗を保存
      saveProgress({
        currentQuestionIndex: nextIndex,
        showResults: false,
        selectedOption: null,
        userAnswers,
        completed: false,
        currentQuestionAnswerId: null,
      });
    } else {
      // All questions completed - calculate result from locally stored answers
      let pattern: ResultPattern | null = null;
      try {
        pattern = findMatchingPattern(userAnswers, resultPatterns);
        setMatchedPattern(pattern);
      } catch (error) {
        console.error("Failed to calculate result pattern:", error);
        // Still show completion screen even if pattern matching fails
      }
      
      setCompleted(true);

      // 完了状態を保存
      saveProgress({
        currentQuestionIndex,
        showResults: false,
        selectedOption: null,
        userAnswers,
        completed: true,
        matchedPatternId: pattern?.id || null,
        currentQuestionAnswerId: null,
      });
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

        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => {
              // 進捗をクリア
              clearProgress();
              // ページをリロードして初期画面に戻る
              window.location.href = BASE_PATH + '/';
            }}
          >
            ホームに戻る
          </button>
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
