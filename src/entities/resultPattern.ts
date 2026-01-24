export type ResultCondition = {
  questionId: string;
  selectedOption: string;
};

export type ResultPattern = {
  id: string;
  name: string;
  message: string;
  description?: string;
  conditions: ResultCondition[];
  priority: number;
  order: number;
  createdAt: Date;
};
