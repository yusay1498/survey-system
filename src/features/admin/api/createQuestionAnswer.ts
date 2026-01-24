import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type CreateQuestionAnswerInput = Omit<QuestionAnswer, "id" | "createdAt">;

export async function createQuestionAnswer(input: CreateQuestionAnswerInput): Promise<void> {
  const questionAnswersRef = collection(firestore, "questionAnswers");
  
  await addDoc(questionAnswersRef, {
    ...input,
    createdAt: serverTimestamp(),
  });
}
