import { signInAnonymously as firebaseSignInAnonymously, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const signInAnonymously = async (): Promise<User> => {
  const result = await firebaseSignInAnonymously(auth);
  return result.user;
};
