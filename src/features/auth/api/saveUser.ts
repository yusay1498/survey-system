import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/entities/user";
import { COLLECTIONS } from "@/lib/constants";

export const saveUser = async (user: User): Promise<void> => {
  const ref = doc(db, COLLECTIONS.USERS, user.uid);

  await setDoc(ref, {
    displayName: user.displayName,
    createdAt: serverTimestamp(),
  });
};
