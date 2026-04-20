import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizeEmail(input.email),
    input.password
  );

  const user = credential.user;

  await setDoc(doc(db, "users", user.uid), {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: user.email,
    createdAt: serverTimestamp(),
  });

  auth.languageCode = "sk";
  await sendEmailVerification(user);

  return user;
}

export async function resendVerificationEmail() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("USER_NOT_AUTHENTICATED");
  }

  if (user.emailVerified) {
    throw new Error("EMAIL_ALREADY_VERIFIED");
  }

  try {
    auth.languageCode = "sk";
    await sendEmailVerification(user);
  } catch (error: any) {
    console.log("resendVerificationEmail error:", error);
    console.log("code:", error?.code);
    console.log("message:", error?.message);
    throw error;
  }
}

export async function refreshEmailVerificationState() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("USER_NOT_AUTHENTICATED");
  }

  await reload(user);
  return auth.currentUser?.emailVerified ?? false;
}

export async function requestPasswordReset(email: string) {
  try {
    auth.languageCode = "sk";
    await sendPasswordResetEmail(auth, normalizeEmail(email));
  } catch (error: any) {
    console.log("requestPasswordReset error:", error);
    console.log("code:", error?.code);
    console.log("message:", error?.message);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    normalizeEmail(email),
    password
  );

  const user = credential.user;
  await reload(user);

  return user;
}

export async function loginVerifiedUser(email: string, password: string) {
  const user = await loginUser(email, password);

  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return user;
}