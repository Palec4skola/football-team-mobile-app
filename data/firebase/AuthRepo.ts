import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email.trim(),
    input.password
  );

  const user = credential.user;

  await setDoc(doc(db, "users", user.uid), {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: user.email,
    createdAt: serverTimestamp(),
  });

  return user;
}