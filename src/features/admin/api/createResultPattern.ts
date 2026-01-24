import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const createResultPattern = async (
  pattern: Omit<ResultPattern, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(firestore, "resultPatterns"), {
    name: pattern.name,
    message: pattern.message,
    description: pattern.description,
    conditions: pattern.conditions,
    priority: pattern.priority,
    order: pattern.order,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};
