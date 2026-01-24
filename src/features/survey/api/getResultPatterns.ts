import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const getResultPatterns = async (): Promise<ResultPattern[]> => {
  // Only order by priority to avoid composite index requirement
  // Sorting by conditions.length (specificity) will be done in matchResultPattern
  const q = query(
    collection(firestore, "resultPatterns"),
    orderBy("priority", "desc")
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
