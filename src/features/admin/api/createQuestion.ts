import { Question } from "@/entities/question";
import { createDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const createQuestion = async (
  question: Omit<Question, "id">
): Promise<string> => {
  return createDocument<Question>(COLLECTIONS.QUESTIONS, question);
};
