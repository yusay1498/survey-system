import { signInAnonymously as firebaseSignInAnonymously } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export const signInAnonymously = async () => {
  const result = await firebaseSignInAnonymously(firebaseAuth);
  return result.user;
};
