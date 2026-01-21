import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Question } from "@/entities/question";

export const getQuestions = async (): Promise<Question[]> => {
  const q = query(
    collection(firestore, "questions"),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Question, "id">),
  }));
};
