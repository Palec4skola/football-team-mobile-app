import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
  where
} from "firebase/firestore";import { db } from "@/firebase";

export type TeamAlertType = "training_created" | "match_created";
export type TeamAlertTargetKind = "training" | "match";

export type CreateAlertInput = {
  teamId: string;
  type: TeamAlertType;
  title: string;
  body: string;
  targetKind: TeamAlertTargetKind;
  targetId: string;
  createdBy: string;
};

export type TeamAlert = {
  id: string;
  teamId: string;
  type: "training_created" | "match_created";
  title: string;
  body: string;
  targetKind: "training" | "match";
  targetId: string;
  createdBy: string;
  createdAt?: any;
};

export const alertsRepo = {
  async create(input: CreateAlertInput) {
    const ref = collection(db, "teams", input.teamId, "alerts");
    await addDoc(ref, {
      teamId: input.teamId,
      type: input.type,
      title: input.title,
      body: input.body,
      targetKind: input.targetKind,
      targetId: input.targetId,
      createdBy: input.createdBy,
      createdAt: serverTimestamp(),
    });
  },
  subscribeToTeamAlerts(
    teamId: string,
    opts: {
      limit?: number;
      onData: (alerts: TeamAlert[]) => void;
      onError?: (e: unknown) => void;
    }
  ): Unsubscribe {
    const q = query(
      collection(db, "teams", teamId, "alerts"),
      orderBy("createdAt", "desc"),
      limit(opts.limit ?? 50)
    );

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<TeamAlert, "id">),
        })) as TeamAlert[];

        opts.onData(items);
      },
      (err) => {
        opts.onError?.(err);
      }
    );
  },

  subscribeToTeamAlertsSince(
    teamId: string,
    since: Timestamp | null,
    opts: {
      limit?: number;
      onData: (alerts: TeamAlert[]) => void;
      onError?: (e: unknown) => void;
    }
  ): Unsubscribe {
    // ak ešte nemáme lastRead, ukáž “všetko” (alebo “nič” – podľa preferencie)
    const base = collection(db, "teams", teamId, "alerts");

    const q = since
      ? query(base, where("createdAt", ">", since), orderBy("createdAt", "desc"), limit(opts.limit ?? 50))
      : query(base, orderBy("createdAt", "desc"), limit(opts.limit ?? 50));

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        opts.onData(items as TeamAlert[]);
      },
      (err) => opts.onError?.(err)
    );
  },
};