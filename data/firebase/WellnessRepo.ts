import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
    collection,
  type Unsubscribe,
  type FieldValue,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

export type WellnessEntryDoc = {
  sleepHours: number; // 0..12
  sleepQuality: number; // 1..5 (u teba: zlá -> výborná)
  fatigue: number; // 1..5
  muscleSoreness: number; // 1..5
  stress: number; // 1..5
  mood: number; // 1..5
  energy: number; // 1..5
  injuryNote?: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type WellnessEntry = WellnessEntryDoc & {
  id: string; // userId
  score?: number; // computed client-side (optional)
};

export type WellnessSaveInput = {
  sleepHours: number;
  sleepQuality: number;
  fatigue: number;
  muscleSoreness: number;
  stress: number;
  mood: number;
  energy: number;
  injuryNote?: string;
};

/**
 * Typ pre zápis do Firestore (serverTimestamp = FieldValue)
 */
export type WellnessEntryWrite = WellnessSaveInput & {
  createdAt?: FieldValue;
  updatedAt: FieldValue;
};
function entryRef(teamId: string, dateKey: string, userId: string) {
  return doc(db, "teams", teamId, "wellness", dateKey, "entries", userId);
}
export function entriesCol(teamId: string, dateKey: string) {
  return collection(db, "teams", teamId, "wellness", dateKey, "entries");
}


export const wellnessRepo = {
  onEntry(
    teamId: string,
    dateKey: string,
    userId: string,
    cb: (entry: (WellnessEntryDoc & { id: string }) | null) => void,
    onError?: (e: Error) => void,
  ): Unsubscribe {
    const ref = entryRef(teamId, dateKey, userId);
    return onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return cb(null);
        cb({ id: snap.id, ...(snap.data() as WellnessEntryDoc) });
      },
      (err) => onError?.(err as any),
    );
  },

  async upsert(
    teamId: string,
    dateKey: string,
    userId: string,
    input: WellnessSaveInput,
  ): Promise<void> {
    const ref = entryRef(teamId, dateKey, userId);
    console.log("[wellness.upsert]", {
      teamId,
      dateKey,
      userId,
      path: `teams/${teamId}/wellness/${dateKey}/entries/${userId}`,
      input,
    }); // chceme rozlíšiť create vs update kvôli createdAt
    const existing = await getDoc(ref);

    const payload: WellnessEntryWrite = {
      ...input,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    await setDoc(ref, payload, { merge: true });
  },

  
  onTeamEntriesForDay(
    teamId: string,
    dateKey: string,
    cb: (items: Array<WellnessEntryDoc & { id: string }>) => void,
    onError?: (e: Error) => void,
  ): Unsubscribe {
    const col = entriesCol(teamId, dateKey);
    return onSnapshot(
      col,
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as WellnessEntryDoc) }))),
      (err) => onError?.(err as any),
    );
  },
};
