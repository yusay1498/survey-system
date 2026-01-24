import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function deleteQuestionAnswer(id: string): Promise<void> {
  const questionAnswerRef = doc(db, "questionAnswers", id);
  await deleteDoc(questionAnswerRef);
}
