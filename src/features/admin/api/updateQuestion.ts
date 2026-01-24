import { Question } from "@/entities/question";
import { updateDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const updateQuestion = async (question: Question): Promise<void> => {
  const { id, ...data } = question;
  await updateDocument<Question>(COLLECTIONS.QUESTIONS, id, data);
};
