import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export async function deleteQuestionAnswer(id: string): Promise<void> {
  const questionAnswerRef = doc(firestore, "questionAnswers", id);
  await deleteDoc(questionAnswerRef);
}
