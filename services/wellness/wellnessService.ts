import {
  doc, getDoc, setDoc, serverTimestamp,
  collection, onSnapshot, query
} from "firebase/firestore";
import { db } from "@/firebase";

export const wellnessPath = (teamId: string, dateKey: string) =>
  `teams/${teamId}/wellness/${dateKey}/entries`;

export function calcWellnessScore(d: {
  sleepQuality: number; muscleSoreness: number; fatigue: number; stress: number; mood: number; energy: number;
}) {
  return (
    d.sleepQuality +
    (6 - d.muscleSoreness) +
    (6 - d.fatigue) +
    (6 - d.stress) +
    d.mood +
    d.energy
  );
}

export async function getTodayEntry(teamId: string, dateKey: string, userId: string) {
  const ref = doc(db, wellnessPath(teamId, dateKey), userId);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : null;
}

export async function upsertTodayEntry(
  teamId: string,
  dateKey: string,
  userId: string,
  data: any
) {
  const ref = doc(db, wellnessPath(teamId, dateKey), userId);
  const existing = await getDoc(ref);

  const score = calcWellnessScore({
    sleepQuality: data.sleepQuality,
    muscleSoreness: data.muscleSoreness,
    fatigue: data.fatigue,
    stress: data.stress,
    mood: data.mood,
    energy: data.energy,
  });

  await setDoc(
    ref,
    {
      ...data,
      score,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return score;
}

export function subscribeTeamToday(teamId: string, dateKey: string, cb: (rows: any[]) => void) {
  const col = collection(db, wellnessPath(teamId, dateKey));
  const q = query(col);
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}