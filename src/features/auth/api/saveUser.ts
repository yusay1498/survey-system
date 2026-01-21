import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { User } from "@/entities/user";

export const saveUser = async (user: User) => {
  const ref = doc(firestore, "users", user.uid);

  await setDoc(ref, {
    displayName: user.displayName,
    createdAt: serverTimestamp(),
  });
};
