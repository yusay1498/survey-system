import { deleteDocument } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const deleteResultPattern = async (
  patternId: string
): Promise<void> => {
  await deleteDocument(COLLECTIONS.RESULT_PATTERNS, patternId);
};
