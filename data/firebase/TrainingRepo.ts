import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase";

export type TrainingModel = {
  id: string;
  name: string;
  description?: string;
  startsAt?: any; // Timestamp
};

export type AttendanceStatus = "yes" | "no" | "maybe";

export type AttendanceDoc = {
  userId: string;
  status: AttendanceStatus;
  updatedAt?: any;
};

function mapDoc<T = DocumentData>(snap: any): T {
  return { id: snap.id, ...(snap.data() as any) };
}

export const trainingRepo = {
  watchTraining(teamId: string, trainingId: string, cb: (t: TrainingModel | null) => void): Unsubscribe {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);
    return onSnapshot(ref, (snap) => {
      cb(snap.exists() ? mapDoc<TrainingModel>(snap) : null);
    });
  },

  watchAttendance(teamId: string, trainingId: string, cb: (rows: AttendanceDoc[]) => void): Unsubscribe {
    const colRef = collection(db, "teams", teamId, "trainings", trainingId, "attendance");
    return onSnapshot(colRef, (snap) => {
      cb(
        snap.docs.map((d) => ({
          userId: d.id,
          ...(d.data() as any),
        }))
      );
    });
  },

  async setAttendance(teamId: string, trainingId: string, userId: string, status: AttendanceStatus) {
    const ref = doc(db, "teams", teamId, "trainings", trainingId, "attendance", userId);
    await setDoc(
      ref,
      { status, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },
};