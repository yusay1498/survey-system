import { signOut as firebaseSignOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export const signOut = async () => {
  await firebaseSignOut(firebaseAuth);
};
