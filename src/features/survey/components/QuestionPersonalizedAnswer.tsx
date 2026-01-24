"use client";

import { QuestionAnswer } from "@/entities/questionAnswer";
import { GradientCard } from "@/components/ui";

type QuestionPersonalizedAnswerProps = {
  questionAnswer: QuestionAnswer;
};

export const QuestionPersonalizedAnswer = ({ questionAnswer }: QuestionPersonalizedAnswerProps) => {
  return (
    <GradientCard variant="gradient-blue" className="p-4">
      <h3 className="text-xl font-bold mb-2">{questionAnswer.name}</h3>
      <p className="text-base leading-relaxed">{questionAnswer.message}</p>
      {questionAnswer.description && (
        <p className="mt-2 text-sm leading-relaxed opacity-90">
          {questionAnswer.description}
        </p>
      )}
    </GradientCard>
  );
};
