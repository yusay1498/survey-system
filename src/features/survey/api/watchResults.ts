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
  const q = query(
    collection(firestore, "answers"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const data: Answer[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Answer, "id">),
    }));
    onChange(data);
  });
};
