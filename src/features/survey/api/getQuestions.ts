import { Question } from "@/entities/question";
import { getCollection } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const getQuestions = async (): Promise<Question[]> => {
  return getCollection<Question>(COLLECTIONS.QUESTIONS, "order", "asc");
};
