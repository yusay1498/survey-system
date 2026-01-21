export type AnswerResult = {
  userName: string;
  selectedOption: string;
};

export type QuestionResult = {
  questionId: string;
  answers: AnswerResult[];
};
