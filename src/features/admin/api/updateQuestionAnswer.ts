import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

type UpdateQuestionAnswerInput = Omit<QuestionAnswer, "createdAt">;

export async function updateQuestionAnswer(input: UpdateQuestionAnswerInput): Promise<void> {
  const questionAnswerRef = doc(firestore, "questionAnswers", input.id);
  
  const updateData = {
    questionId: input.questionId,
    name: input.name,
    message: input.message,
    description: input.description,
    condition: input.condition,
    order: input.order,
  };
  
  await updateDoc(questionAnswerRef, updateData);
}
