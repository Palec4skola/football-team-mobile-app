// src/features/matches/repo/matchRepo.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
  getDoc,
  Timestamp,
    FieldValue,
} from "firebase/firestore";
import { db } from "@/firebase";

export type MatchResult =
  | { home: number; away: number } // ak chceš neskôr ukladať skóre
  | null;

export type MatchDoc = {
  opponent: string;
  place: string;
  date: Timestamp;
  result: MatchResult;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/**
 * Typ používaný pri zápise do Firestore
 */
export type MatchCreateDoc = {
  opponent: string;
  place: string;
  date: Date;
  result: MatchResult;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type Match = MatchDoc & {
  id: string;
};

export type MatchCreateInput = {
  opponent: string;
  place: string;
  date: Date;
};

export type MatchUpdateInput = Partial<{
  opponent: string;
  place: string;
  date: Date;
  result: MatchResult;
}>;

function matchesCol(teamId: string) {
  return collection(db, "teams", teamId, "matches");
}

function matchDocRef(teamId: string, matchId: string) {
  return doc(db, "teams", teamId, "matches", matchId);
}

export const matchRepo = {
  async create(teamId: string, input: MatchCreateInput): Promise<string> {
    const ref = matchesCol(teamId);

    const payload: MatchCreateDoc = {
      opponent: input.opponent,
      place: input.place,
      date: input.date,
      result: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(ref, payload);

    return docRef.id;
  },

  async getById(teamId: string, matchId: string): Promise<Match | null> {
    const ref = matchDocRef(teamId, matchId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as MatchDoc) };
  },

  onList(
    teamId: string,
    cb: (items: Match[]) => void,
    onError?: (e: Error) => void,
  ): Unsubscribe {
    const q = query(matchesCol(teamId), orderBy("date", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        const items: Match[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as MatchDoc),
        }));
        cb(items);
      },
      (err) => onError?.(err as any),
    );
  },

  async update(
    teamId: string,
    matchId: string,
    patch: MatchUpdateInput,
  ): Promise<void> {
    const ref = matchDocRef(teamId, matchId);
    const updatePayload: any = {
      updatedAt: serverTimestamp(),
    };

    if (patch.opponent != null) updatePayload.opponent = patch.opponent;
    if (patch.place != null) updatePayload.place = patch.place;
    if (patch.date != null) updatePayload.date = patch.date;
    if (patch.result != null) updatePayload.result = patch.result;

    await updateDoc(ref, updatePayload);
  },

  async delete(teamId: string, matchId: string): Promise<void> {
    const ref = matchDocRef(teamId, matchId);
    await deleteDoc(ref);
  },
};
