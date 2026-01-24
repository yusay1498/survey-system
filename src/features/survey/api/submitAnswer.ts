import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Answer } from "@/entities/answer";
import { COLLECTIONS } from "@/lib/constants";

export const submitAnswer = async (answer: Answer): Promise<void> => {
  await addDoc(collection(db, COLLECTIONS.ANSWERS), {
    userId: answer.userId,
    userName: answer.userName,
    questionId: answer.questionId,
    selectedOption: answer.selectedOption,
    createdAt: serverTimestamp(),
  });
};
