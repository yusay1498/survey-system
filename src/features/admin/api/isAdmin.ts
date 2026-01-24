import { documentExists } from "@/lib/firestore/helpers";
import { COLLECTIONS } from "@/lib/constants";

export const isAdmin = async (userId: string): Promise<boolean> => {
  return documentExists(COLLECTIONS.ADMINS, userId);
};
