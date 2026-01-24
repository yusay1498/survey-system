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
  order: number; // Reserved for future use (e.g., display ordering when multiple patterns match)
  createdAt: Date;
};
