import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type CreateQuestionAnswerInput = Omit<QuestionAnswer, "id" | "createdAt">;

export async function createQuestionAnswer(input: CreateQuestionAnswerInput): Promise<void> {
  const questionAnswersRef = collection(db, "questionAnswers");
  
  await addDoc(questionAnswersRef, {
    ...input,
    createdAt: serverTimestamp(),
  });
}
