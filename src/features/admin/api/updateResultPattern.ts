import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ResultPattern } from "@/entities/resultPattern";

export const updateResultPattern = async (
  pattern: Omit<ResultPattern, "createdAt">
): Promise<void> => {
  const patternRef = doc(firestore, "resultPatterns", pattern.id);

  await updateDoc(patternRef, {
    name: pattern.name,
    message: pattern.message,
    description: pattern.description,
    conditions: pattern.conditions,
    priority: pattern.priority,
    order: pattern.order,
  });
};
