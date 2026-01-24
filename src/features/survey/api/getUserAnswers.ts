import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Answer } from "@/entities/answer";

export const getUserAnswers = async (userId: string): Promise<Answer[]> => {
  const q = query(
    collection(firestore, "answers"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      userName: data.userName,
      questionId: data.questionId,
      selectedOption: data.selectedOption,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Answer;
  });
};
