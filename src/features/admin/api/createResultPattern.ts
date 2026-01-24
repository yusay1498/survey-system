import { ResultPattern } from "@/entities/resultPattern";
import { createDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const createResultPattern = async (
  pattern: Omit<ResultPattern, "id" | "createdAt">
): Promise<string> => {
  return createDocument<ResultPattern>(COLLECTIONS.RESULT_PATTERNS, pattern);
};
