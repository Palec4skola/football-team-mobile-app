import { paths } from "../firebase/Paths";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../../firebase";

export type TeamMember = {
  id: string; // userId
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[]; // roly v TEAME
};

export type TeamMembership = {
  id: string; // userId
  roles?: string[];
};

export const teamRepo = {
  async getTeam(teamId: string) {
    const snap = await getDoc(doc(db, paths.team(teamId)));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  async createTeam(input: {
    name: string;
    country: string;
    level: "amateur" | "professional";
    code: string;
    createdBy: string;
  }) {
    const teamRef = await addDoc(collection(db, paths.teams()), {
      name: input.name,
      country: input.country,
      level: input.level,
      code: input.code,
      createdBy: input.createdBy,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, paths.member(teamRef.id, input.createdBy)), {
      role: "coach",
      joinedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, `users/${input.createdBy}`), {
      activeTeamId: teamRef.id,
    });

    return teamRef.id;
  },

  async findTeamByCode(code: string) {
    const q = query(collection(db, paths.teams()), where("code", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    if (snap.docs.length > 1) throw new Error("Kód tímu nie je unikátny");
    const doc0 = snap.docs[0];
    return { id: doc0.id, ...doc0.data() };
  },

  async joinTeamAsPlayer(teamId: string, uid: string) {
    await setDoc(
      doc(db, paths.member(teamId, uid)),
      {
        role: "player",
        joinedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await updateDoc(doc(db, `users/${uid}`), { activeTeamId: teamId });
  },

  async getTeamLevel(teamId: string) {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDocSnap = await getDoc(teamDocRef);
    return teamDocSnap.data()?.level;
  },

  async removeMember(teamId: string | null, userId: string) {
    if (!teamId) return;
    await deleteDoc(doc(db, paths.member(teamId, userId)));
  },

  async addMember(
    teamId: string,
    userId: string,
    roles: string[],
    firstName: string,
    lastName: string,
    photoURL: string,
  ) {
    const memberRef = doc(db, "teams", teamId, "members", userId);

    await setDoc(
      memberRef,
      {
        roles: roles,
        firstName,
        lastName,
        photoURL,
        joinedAt: serverTimestamp(),
      },
      { merge: true }, // ak už existuje, len zmerge
    );
  },

  async setMemberRoles(teamId: string, userId: string, roles: string[]) {
    const ref = doc(db, "teams", teamId, "members", userId);
    await updateDoc(ref, { roles });
  },
  
  watchMembers(
    teamId: string,
    cb: (members: TeamMember[]) => void,
  ): Unsubscribe {
    // Predpoklad: v members máš aj meno. Ak nie, nižšie poviem alternatívu.
    const colRef = collection(db, "teams", teamId, "members");
    return onSnapshot(colRef, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  },

  watchMyMembership(
    teamId: string,
    userId: string,
    cb: (m: TeamMembership | null) => void,
  ): Unsubscribe {
    const ref = doc(db, "teams", teamId, "members", userId);
    return onSnapshot(ref, (snap) => {
      cb(snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null);
    });
  },
};
