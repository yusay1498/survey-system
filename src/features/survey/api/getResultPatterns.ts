import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const getResultPatterns = async (): Promise<ResultPattern[]> => {
  const q = query(
    collection(firestore, "resultPatterns"),
    orderBy("priority", "desc"),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      message: data.message,
      description: data.description,
      conditions: data.conditions || [],
      priority: data.priority || 0,
      order: data.order || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as ResultPattern;
  });
};
