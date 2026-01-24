import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Answer } from "@/entities/answer";

export const watchResults = (
  onChange: (answers: Answer[]) => void
) => {
  const answersQuery = query(
    collection(firestore, "answers"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(answersQuery, (snapshot) => {
    const answers: Answer[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Answer, "id">),
    }));
    onChange(answers);
  });
};
