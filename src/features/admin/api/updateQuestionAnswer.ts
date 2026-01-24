import { QuestionAnswer } from "@/entities/questionAnswer";
import { updateDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

type UpdateQuestionAnswerInput = Omit<QuestionAnswer, "createdAt">;

export const updateQuestionAnswer = async (
  input: UpdateQuestionAnswerInput
): Promise<void> => {
  const { id, ...data } = input;
  await updateDocument<QuestionAnswer>(COLLECTIONS.QUESTION_ANSWERS, id, data);
};
