import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export type TrainingDoc = {
  startsAt: Timestamp;
  name?: string;
  description?: string;
};

export type MatchDoc = {
  date: Timestamp;
  opponent?: string;
  location?: string;
  result?: string;
};

export const calendarRepo = {
  async listTrainingsInRange(teamId: string, from: Date, to: Date) {
    const ref = collection(db, "teams", teamId, "trainings");
    const qy = query(
      ref,
      where("startsAt", ">=", Timestamp.fromDate(from)),
      where("startsAt", "<", Timestamp.fromDate(to)),
    );
    const snap = await getDocs(qy);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Array<
      TrainingDoc & { id: string }
    >;
  },

  async listMatchesInRange(teamId: string, from: Date, to: Date) {
    const ref = collection(db, "teams", teamId, "matches");
    const qy = query(
      ref,
      where("date", ">=", Timestamp.fromDate(from)),
      where("date", "<", Timestamp.fromDate(to)),
    );
    const snap = await getDocs(qy);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Array<
      MatchDoc & { id: string }
    >;
  },
};
