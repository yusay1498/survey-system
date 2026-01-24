import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Answer } from "@/entities/answer";
import { COLLECTIONS } from "@/lib/constants";

export const watchResults = (
  onChange: (answers: Answer[]) => void
): Unsubscribe => {
  const answersQuery = query(
    collection(db, COLLECTIONS.ANSWERS),
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
