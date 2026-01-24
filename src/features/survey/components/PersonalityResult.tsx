"use client";

import { Answer } from "@/entities/answer";
import { ResultPattern } from "@/entities/resultPattern";

type Props = {
  userAnswers: Answer[];
  pattern: ResultPattern | null;
};

export const PersonalityResult = ({ userAnswers, pattern }: Props) => {
  if (!pattern) {
    return (
      <div className="p-6 bg-gray-100 border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          アンケートが完了しました！
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          回答ありがとうございました。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-3">{pattern.name}</h2>
        <p className="text-lg leading-relaxed">{pattern.message}</p>
        {pattern.description && (
          <p className="mt-4 text-base opacity-90 leading-relaxed">
            {pattern.description}
          </p>
        )}
      </div>
      
      {/* Show user's answers for context */}
      <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 rounded dark:bg-gray-800">
        <p className="font-semibold mb-2">あなたの回答:</p>
        <ul className="space-y-1">
          {userAnswers.map((answer) => (
            <li key={`${answer.questionId}-${answer.selectedOption}`}>
              ・{answer.selectedOption}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
