import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
  type FieldValue,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase";

export type MatchStatus = "scheduled" | "finished" | "cancelled";

export type MatchResult = {
  team: number;
  opponent: number;
} | null;

export type MatchDoc = {
  opponent: string;
  place: string;
  date: Timestamp;
  result: MatchResult;
  status: MatchStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Match = MatchDoc & {
  id: string;
};

export type MatchCreateDoc = {
  opponent: string;
  place: string;
  date: Date;
  result: MatchResult;
  status: MatchStatus;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type MatchCreateInput = {
  opponent: string;
  place: string;
  date: Date;
  result?: MatchResult;
  status?: MatchStatus;
};

export type MatchUpdateInput = Partial<{
  opponent: string;
  place: string;
  date: Date;
  result: MatchResult;
  status: MatchStatus;
}>;

export type TeamStats = {
  wins: number;
  draws: number;
  losses: number;
  played: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

function matchesCol(teamId: string) {
  return collection(db, "teams", teamId, "matches");
}

function matchDocRef(teamId: string, matchId: string) {
  return doc(db, "teams", teamId, "matches", matchId);
}

function mapMatchDoc(d: QueryDocumentSnapshot<DocumentData>): Match {
  return {
    id: d.id,
    ...(d.data() as MatchDoc),
  };
}

function calculateStats(matches: Match[]): TeamStats {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of matches) {
    if (match.status !== "finished") continue;
    if (!match.result) continue;

    const { team, opponent } = match.result;

    goalsFor += team;
    goalsAgainst += opponent;

    if (team > opponent) wins++;
    else if (team === opponent) draws++;
    else losses++;
  }

  const played = wins + draws + losses;
  const points = wins * 3 + draws;

  return {
    wins,
    draws,
    losses,
    played,
    goalsFor,
    goalsAgainst,
    points,
  };
}

export const matchRepo = {
  async create(teamId: string, input: MatchCreateInput): Promise<string> {
    const ref = matchesCol(teamId);

    const payload: MatchCreateDoc = {
      opponent: input.opponent,
      place: input.place,
      date: input.date,
      result: input.result ?? null,
      status: input.status ?? "scheduled",
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

    return {
      id: snap.id,
      ...(snap.data() as MatchDoc),
    };
  },

  onList(
    teamId: string,
    cb: (items: Match[]) => void,
    onError?: (e: Error) => void,
  ): Unsubscribe {
    const today = new Date();
  today.setHours(0, 0, 0, 0);
    const q = query(matchesCol(teamId), where("date",">=",Timestamp.fromDate(today)),orderBy("date", "desc"));

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(mapMatchDoc);
        cb(items);
      },
      (err) => onError?.(err as Error),
    );
  },

  async update(
    teamId: string,
    matchId: string,
    patch: MatchUpdateInput,
  ): Promise<void> {
    const ref = matchDocRef(teamId, matchId);

    const updatePayload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (patch.opponent !== undefined) updatePayload.opponent = patch.opponent;
    if (patch.place !== undefined) updatePayload.place = patch.place;
    if (patch.date !== undefined) updatePayload.date = patch.date;
    if (patch.result !== undefined) updatePayload.result = patch.result;
    if (patch.status !== undefined) updatePayload.status = patch.status;

    await updateDoc(ref, updatePayload);
  },

  async delete(teamId: string, matchId: string): Promise<void> {
    const ref = matchDocRef(teamId, matchId);
    await deleteDoc(ref);
  },

  // -------------------------
  // EXTRA FUNKCIE
  // -------------------------

  async list(teamId: string): Promise<Match[]> {
    const q = query(matchesCol(teamId), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(mapMatchDoc);
  },

  async listFinished(teamId: string): Promise<Match[]> {
    const q = query(
      matchesCol(teamId),
      where("status", "==", "finished"),
      orderBy("date", "desc"),
    );

    const snap = await getDocs(q);
    return snap.docs.map(mapMatchDoc);
  },

  async setResult(
    teamId: string,
    matchId: string,
    result: { team: number; opponent: number },
  ): Promise<void> {
    const ref = matchDocRef(teamId, matchId);

    await updateDoc(ref, {
      result,
      status: "finished",
      updatedAt: serverTimestamp(),
    });
  },

  async clearResult(teamId: string, matchId: string): Promise<void> {
    const ref = matchDocRef(teamId, matchId);

    await updateDoc(ref, {
      result: null,
      status: "scheduled",
      updatedAt: serverTimestamp(),
    });
  },

  async setStatus(
    teamId: string,
    matchId: string,
    status: MatchStatus,
  ): Promise<void> {
    const ref = matchDocRef(teamId, matchId);

    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async getTeamStats(teamId: string): Promise<TeamStats> {
    const finishedMatches = await this.listFinished(teamId);
    return calculateStats(finishedMatches);
  },

  onTeamStats(
    teamId: string,
    cb: (stats: TeamStats) => void,
    onError?: (e: Error) => void,
  ): Unsubscribe {
    const q = query(
      matchesCol(teamId),
      where("status", "==", "finished"),
    );
    

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(mapMatchDoc);
        cb(calculateStats(items));
      },
      (err) => onError?.(err as Error),
    );
  },
};