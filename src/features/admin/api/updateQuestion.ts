import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Question } from "@/entities/question";

export const updateQuestion = async (question: Question): Promise<void> => {
  const questionRef = doc(firestore, "questions", question.id);

  await updateDoc(questionRef, {
    text: question.text,
    options: question.options,
    order: question.order,
  });
};
