import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Question } from "@/entities/question";

export const updateQuestion = async (question: Question): Promise<void> => {
  const ref = doc(firestore, "questions", question.id);

  await updateDoc(ref, {
    text: question.text,
    options: question.options,
    order: question.order,
  });
};
