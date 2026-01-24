import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { QuestionAnswer } from "@/entities/questionAnswer";

export async function getQuestionAnswers(): Promise<QuestionAnswer[]> {
  const questionAnswersRef = collection(firestore, "questionAnswers");
  const q = query(questionAnswersRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      questionId: data.questionId,
      name: data.name,
      message: data.message,
      description: data.description,
      condition: data.condition,
      order: data.order,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  });
}
