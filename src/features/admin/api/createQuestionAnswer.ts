import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type CreateQuestionAnswerInput = Omit<QuestionAnswer, "id" | "createdAt">;

export async function createQuestionAnswer(input: CreateQuestionAnswerInput): Promise<string> {
  const questionAnswersRef = collection(firestore, "questionAnswers");
  
  const docRef = await addDoc(questionAnswersRef, {
    ...input,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
