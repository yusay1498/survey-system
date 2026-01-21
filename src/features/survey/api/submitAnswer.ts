import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Answer } from "@/entities/answer";

export const submitAnswer = async (answer: Answer) => {
  await addDoc(collection(firestore, "answers"), {
    userId: answer.userId,
    userName: answer.userName,
    questionId: answer.questionId,
    selectedOption: answer.selectedOption,
    createdAt: serverTimestamp(),
  });
};
