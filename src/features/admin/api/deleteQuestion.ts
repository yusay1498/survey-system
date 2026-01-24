import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const questionRef = doc(firestore, "questions", questionId);
  await deleteDoc(questionRef);
};
