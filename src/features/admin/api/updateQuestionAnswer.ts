import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type UpdateQuestionAnswerInput = Omit<QuestionAnswer, "createdAt">;

export async function updateQuestionAnswer(input: UpdateQuestionAnswerInput): Promise<void> {
  const questionAnswerRef = doc(firestore, "questionAnswers", input.id);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...updateData } = input;
  
  await updateDoc(questionAnswerRef, updateData);
}
