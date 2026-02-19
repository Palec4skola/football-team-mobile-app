import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { generateTeamCode } from "@/utils/teamCode";

type CreateTeamInput = {
  name: string;
  country: string;
  level: "amateur" | "professional";
  createdBy: string;
};

export async function createTeam(input: CreateTeamInput): Promise<string> {
  const code = generateTeamCode(); // 4 znaky

  const userRef = doc(db, "users", input.createdBy);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};

  const firstName = userData.firstName ?? "";
  const lastName = userData.lastName ?? "";
  const photoURL = userData.photoURL ?? "";

  const teamsRef = collection(db, "teams");
  const teamRef = await addDoc(teamsRef, {
    name: input.name,
    country: input.country,
    level: input.level,
    code,
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
  });

  // creator = coach
  await setDoc(doc(db, "teams", teamRef.id, "members", input.createdBy), {
    roles: ["coach"],
    firstName,
    lastName,
    photoURL,
    joinedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", input.createdBy, "memberships", teamRef.id), {
    teamId: teamRef.id,
    roles: ["coach"],
    teamName: input.name, // cache pre zoznam tímov
    joinedAt: serverTimestamp(),
  });

  // UI convenience
  await updateDoc(doc(db, "users", input.createdBy), {
    activeTeamId: teamRef.id,
  });

  return teamRef.id;
}
