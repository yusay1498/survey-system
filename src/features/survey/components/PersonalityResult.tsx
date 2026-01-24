"use client";

import { Answer } from "@/entities/answer";
import { ResultPattern } from "@/entities/resultPattern";
import { QuestionAnswer } from "@/entities/questionAnswer";
import { Question } from "@/entities/question";
import { findMatchingQuestionAnswer } from "../lib/matchQuestionAnswer";

type Props = {
  userAnswers: Answer[];
  pattern: ResultPattern | null;
  questionAnswers: QuestionAnswer[];
  questions: Question[];
};

export const PersonalityResult = ({ userAnswers, pattern, questionAnswers, questions }: Props) => {
  // 各質問に対するパーソナライズな回答を取得
  const getAnswerDetails = () => {
    return userAnswers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      const matchedQuestionAnswer = findMatchingQuestionAnswer(
        answer.questionId,
        answer.selectedOption,
        questionAnswers
      );
      
      return {
        answer,
        question,
        questionAnswer: matchedQuestionAnswer,
      };
    });
  };

  const answerDetails = getAnswerDetails();

  if (!pattern) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-gray-100 border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
            アンケートが完了しました！
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            回答ありがとうございました。
          </p>
        </div>

        {/* 各質問のパーソナライズな回答を表示 */}
        {answerDetails.some((detail) => detail.questionAnswer) && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              各質問のパーソナライズな回答
            </h3>
            {answerDetails.map((detail, index) => {
              if (!detail.questionAnswer) return null;
              
              return (
                <div key={index} className="space-y-2">
                  {detail.question && (
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {detail.question.text}
                    </p>
                  )}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white shadow-md">
                    <h4 className="text-lg font-bold mb-1">{detail.questionAnswer.name}</h4>
                    <p className="text-sm leading-relaxed">{detail.questionAnswer.message}</p>
                    {detail.questionAnswer.description && (
                      <p className="mt-2 text-xs leading-relaxed opacity-90">
                        {detail.questionAnswer.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-purple-700 to-pink-700 rounded-lg text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-3">{pattern.name}</h2>
        <p className="text-lg leading-relaxed">{pattern.message}</p>
        {pattern.description && (
          <p className="mt-4 text-base leading-relaxed">
            {pattern.description}
          </p>
        )}
      </div>
      
      {/* Show user's answers for context */}
      {userAnswers.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 rounded dark:bg-gray-800">
          <p className="font-semibold mb-2">あなたの回答:</p>
          <ul className="space-y-1">
            {userAnswers.map((answer, index) => (
              <li key={answer.id ?? index}>
                ・{answer.selectedOption}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 各質問のパーソナライズな回答を表示 */}
      {answerDetails.some((detail) => detail.questionAnswer) && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            各質問のパーソナライズな回答
          </h3>
          {answerDetails.map((detail, index) => {
            if (!detail.questionAnswer) return null;
            
            return (
              <div key={index} className="space-y-2">
                {detail.question && (
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {detail.question.text}
                  </p>
                )}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white shadow-md">
                  <h4 className="text-lg font-bold mb-1">{detail.questionAnswer.name}</h4>
                  <p className="text-sm leading-relaxed">{detail.questionAnswer.message}</p>
                  {detail.questionAnswer.description && (
                    <p className="mt-2 text-xs leading-relaxed opacity-90">
                      {detail.questionAnswer.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
