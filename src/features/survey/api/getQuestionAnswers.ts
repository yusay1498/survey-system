import { QuestionAnswer } from "@/entities/questionAnswer";
import { getCollection } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const getQuestionAnswers = async (): Promise<QuestionAnswer[]> => {
  return getCollection<QuestionAnswer>(
    COLLECTIONS.QUESTION_ANSWERS,
    "order",
    "asc"
  );
};
