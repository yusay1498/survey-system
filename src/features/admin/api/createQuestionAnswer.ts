import { QuestionAnswer } from "@/entities/questionAnswer";
import { createDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

type CreateQuestionAnswerInput = Omit<QuestionAnswer, "id" | "createdAt">;

export const createQuestionAnswer = async (
  input: CreateQuestionAnswerInput
): Promise<string> => {
  return createDocument<QuestionAnswer>(COLLECTIONS.QUESTION_ANSWERS, input);
};
