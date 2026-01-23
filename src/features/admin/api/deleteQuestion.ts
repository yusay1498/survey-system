import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const ref = doc(firestore, "questions", questionId);
  await deleteDoc(ref);
};
