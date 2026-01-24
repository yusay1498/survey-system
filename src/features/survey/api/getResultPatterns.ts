import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const getResultPatterns = async (): Promise<ResultPattern[]> => {
  // Only order by priority to avoid composite index requirement
  // We'll sort by order in memory after fetching
  const q = query(
    collection(firestore, "resultPatterns"),
    orderBy("priority", "desc")
  );

  const snapshot = await getDocs(q);

  const patterns = snapshot.docs.map((doc) => {
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

  // Sort by order in memory for patterns with same priority
  return patterns.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.order - b.order;
  });
};
