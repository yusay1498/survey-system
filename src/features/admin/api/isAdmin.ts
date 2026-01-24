import { doc, getDoc } from "firebase/firestore";
import { firestore} from "@/lib/firebase";

export const isAdmin = async (userId: string): Promise<boolean> => {
  const adminDocRef = doc(firestore, "admins", userId);
  const adminSnapshot = await getDoc(adminDocRef);

  return adminSnapshot.exists();
};
