import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type UpdateQuestionAnswerInput = Omit<QuestionAnswer, "createdAt">;

export async function updateQuestionAnswer(input: UpdateQuestionAnswerInput): Promise<void> {
  const questionAnswerRef = doc(db, "questionAnswers", input.id);
  
  const { id, ...updateData } = input;
  
  await updateDoc(questionAnswerRef, updateData);
}
