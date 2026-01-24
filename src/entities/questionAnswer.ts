export type QuestionAnswerCondition = {
  selectedOption: string;
};

export type QuestionAnswer = {
  id: string;
  questionId: string;
  name: string;
  message: string;
  description?: string;
  condition: QuestionAnswerCondition;
  order: number;
  createdAt: Date;
};
