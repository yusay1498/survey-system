"use client";

import { QuestionAnswer } from "@/entities/questionAnswer";

type Props = {
  questionAnswer: QuestionAnswer;
};

export const QuestionPersonalizedAnswer = ({ questionAnswer }: Props) => {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white shadow-md">
      <h3 className="text-xl font-bold mb-2">{questionAnswer.name}</h3>
      <p className="text-base leading-relaxed">{questionAnswer.message}</p>
      {questionAnswer.description && (
        <p className="mt-2 text-sm leading-relaxed opacity-90">
          {questionAnswer.description}
        </p>
      )}
    </div>
  );
};
