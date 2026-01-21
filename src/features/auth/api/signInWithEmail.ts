import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  await signInWithEmailAndPassword(firebaseAuth, email, password);
};
