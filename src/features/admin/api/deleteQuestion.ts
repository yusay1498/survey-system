import { deleteDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const deleteQuestion = async (questionId: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.QUESTIONS, questionId);
};
