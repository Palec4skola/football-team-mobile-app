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
import { computeWellnessScore10 } from "@/services/wellness/wellnessService";

export type WellnessEntryDoc = {
  sleepHours: number;
  sleepQuality: number;
  fatigue: number;
  muscleSoreness: number;
  stress: number;
  mood: number;
  energy: number;
  injuryNote?: string;

  score?: number; // ✅ uložené v DB (0..10)

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

  async upsert(teamId: string, dateKey: string, userId: string, input: WellnessSaveInput) {
  const ref = entryRef(teamId, dateKey, userId);
  const existing = await getDoc(ref);

  const score = computeWellnessScore10(input); // ✅ vypočítaj tu

  const payload: WellnessEntryWrite & { score: number } = {
    ...input,
    score, // ✅ uložiť
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
