import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export const deleteResultPattern = async (
  patternId: string
): Promise<void> => {
  const patternRef = doc(firestore, "resultPatterns", patternId);
  await deleteDoc(patternRef);
};
