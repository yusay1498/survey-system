import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};
