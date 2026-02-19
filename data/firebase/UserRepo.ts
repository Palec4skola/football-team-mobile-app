import { doc, getDoc, updateDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export type UserModel = {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[] | string;
  activeTeamId?: string | null;
  teamId?: string | null;
  height?: number | string;
  weight?: number | string;
  BMI?: number | string;
  VO2max?: number | string;
  maxSpeed?: number | string;
  [key: string]: any;
};

function normalizeRoles(roles: unknown): string[] {
  if (Array.isArray(roles)) return roles;
  if (typeof roles === "string") return [roles];
  return [];
}

export const userRepo = {

  async getById(userId: string): Promise<UserModel | null> {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) return null;
    return snap.data() as UserModel;
  },

  async getActiveTeamId(userId: string): Promise<string | null> {
    const user = await this.getById(userId);
    return user?.activeTeamId ?? null;
  },
  async updateRoles(userId: string, roles: string[]) {
    // await updateDoc(doc(db, "users", userId), {
    //   roles: normalizeRoles(roles),
    // });
    //TODO: treba updatovat aj v membership dokumente
  },

 async setActiveTeamId(userId: string, teamId: string | null) {
  await updateDoc(doc(db, "users", userId), { activeTeamId: teamId });
},

  async updateStat(userId: string, statKey: string, value: string) {
    // await this.update(userId, {
    //   [statKey]: value,
    // });
  },
  async addMembership(userId: string, teamId: string, teamName: string, roles: string[]) {
    const userMembershipRef = doc(db, "users", userId, "memberships", teamId);
    console.log("Adding membership for user", userId, "team", teamId, "roles", roles);
      await setDoc(
        userMembershipRef,
        {
          roles: roles,
          teamId,
          teamName,
          joinedAt: serverTimestamp(),
        },
        { merge: true },
      );
  },
  async removeMembership(userId: string, teamId: string|null) {
    if (!teamId) return;
    const membershipRef = doc(db, "users", userId, "memberships", teamId);
  await deleteDoc(membershipRef);
  },
  normalizeRoles,
};
