import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Question } from "@/entities/question";

export const createQuestion = async (
  question: Omit<Question, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(firestore, "questions"), {
    text: question.text,
    options: question.options,
    order: question.order,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};
