import { doc, getDoc } from "firebase/firestore";
import { firestore} from "@/lib/firebase";

export const isAdmin = async (userId: string): Promise<boolean> => {
  const ref = doc(firestore, "admins", userId);
  const snap = await getDoc(ref);

  return snap.exists();
};
