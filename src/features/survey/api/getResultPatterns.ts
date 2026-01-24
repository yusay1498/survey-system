import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const getResultPatterns = async (): Promise<ResultPattern[]> => {
  // Only order by priority to avoid composite index requirement
  // Sorting by conditions.length (specificity) will be done in matchResultPattern
  const patternsQuery = query(
    collection(firestore, "resultPatterns"),
    orderBy("priority", "desc")
  );

  const snapshot = await getDocs(patternsQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    
    // Validate required fields
    const name = typeof data.name === "string" ? data.name : "";
    const message = typeof data.message === "string" ? data.message : "";
    const description = typeof data.description === "string" ? data.description : undefined;
    
    // Validate and filter conditions array
    const rawConditions = Array.isArray(data.conditions) ? data.conditions : [];
    const conditions = rawConditions.filter((condition) => {
      return (
        condition &&
        typeof condition === "object" &&
        typeof condition.questionId === "string" &&
        typeof condition.selectedOption === "string"
      );
    });
    
    const priority = typeof data.priority === "number" ? data.priority : 0;
    const order = typeof data.order === "number" ? data.order : 0;
    const createdAt = typeof data.createdAt?.toDate === "function"
      ? data.createdAt.toDate()
      : new Date();
    
    return {
      id: doc.id,
      name,
      message,
      description,
      conditions,
      priority,
      order,
      createdAt,
    } as ResultPattern;
  });
};
