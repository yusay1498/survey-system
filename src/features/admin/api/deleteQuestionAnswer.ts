import { deleteDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const deleteQuestionAnswer = async (id: string): Promise<void> => {
  await deleteDocument(COLLECTIONS.QUESTION_ANSWERS, id);
};
