import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

export type UserModel = {
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[] | string;
  activeTeamId?: string | null;
  photoURL?: string | null;
  teamId?: string | null;
  height?: number | string;
  weight?: number | string;
  BMI?: number | string;
  VO2max?: number | string;
  maxSpeed?: number | string;
  [key: string]: any;
};
export type TeamMemberModel = {
  roles?: string[];
  joinedAt?: any;
  [key: string]: any;
};

export type UserStatKey = "height" | "weight" | "bmi" | "vo2max" | "topSpeed";

function normalizeRoles(roles: unknown): string[] {
  if (Array.isArray(roles)) return roles;
  if (typeof roles === "string") return [roles];
  return [];
}

export const userRepo = {
  async getUserById(userId: string): Promise<UserModel | null> {
    const snap = await getDoc(doc(db, "users", userId));
    if (!snap.exists()) return null;
    return snap.data() as UserModel;
  },

  async getActiveTeamId(userId: string): Promise<string | null> {
    const user = await this.getUserById(userId);
    return user?.activeTeamId ?? null;
  },
  // });
  //TODO: treba updatovat aj v membership dokumente
  async updateRoles(teamId: string, userId: string, roles: string[]) {
    const ref = doc(db, "teams", teamId, "members", userId);
    await updateDoc(ref, { roles });
  },

  async setActiveTeamId(userId: string, teamId: string | null) {
    await updateDoc(doc(db, "users", userId), { activeTeamId: teamId });
  },

  async updateStat(userId: string, statKey: UserStatKey, value: string) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`stats.${statKey}`]: value,
    });
  },
  async addMembership(
    userId: string,
    teamId: string,
    teamName: string,
  ) {
    const userMembershipRef = doc(db, "users", userId, "memberships", teamId);
    await setDoc(
      userMembershipRef,
      {
        teamId,
        teamName,
        joinedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },
  
  async removeMembership(userId: string, teamId: string | null) {
    if (!teamId) return;
    const membershipRef = doc(db, "users", userId, "memberships", teamId);
    await deleteDoc(membershipRef);
  },

  subscribeLastAlertsReadAt(
    userId: string,
    opts: {
      onData: (ts: Timestamp | null) => void;
      onError?: (e: unknown) => void;
    },
  ): Unsubscribe {
    const ref = doc(db, "users", userId);

    return onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as any;
        const ts = data?.lastAlertsReadAt;
        opts.onData(ts instanceof Timestamp ? ts : null);
      },
      (err) => opts.onError?.(err),
    );
  },

  async markAlertsRead(userId: string) {
    await setDoc(
      doc(db, "users", userId),
      {
        lastAlertsReadAt: Timestamp.now(),
      },
      { merge: true },
    );
  },

  async updateProfile(
    uid: string,
    data: { firstName: string; lastName: string },
  ): Promise<void> {
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  },
  

  normalizeRoles,
};
export async function getUserMembershipTeamIds(uid: string): Promise<string[]> {
  const membershipsRef = collection(db, "users", uid, "memberships");
  const snapshot = await getDocs(membershipsRef);
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return typeof data.teamId === "string" ? data.teamId : null;
    })
    .filter((teamId): teamId is string => !!teamId);
}
