import { ResultPattern } from "@/entities/resultPattern";
import { updateDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const updateResultPattern = async (
  pattern: Omit<ResultPattern, "createdAt">
): Promise<void> => {
  const { id, ...data } = pattern;
  await updateDocument<ResultPattern>(COLLECTIONS.RESULT_PATTERNS, id, data);
};
