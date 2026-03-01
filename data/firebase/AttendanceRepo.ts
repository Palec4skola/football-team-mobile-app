import { collection, doc, onSnapshot, serverTimestamp, setDoc, Unsubscribe, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export type AttendanceStatus = "yes" | "no" | "maybe";

export type AttendanceDoc = {
  userId: string;
  status: AttendanceStatus;
  updatedAt?: any;
};

export const attendanceRepo = {
    watchAttendance(teamId: string, eventId: string, event: string, cb: (rows: AttendanceDoc[]) => void): Unsubscribe {
    const colRef = collection(db, "teams", teamId, event, eventId, "attendance");
    return onSnapshot(colRef, (snap) => {
      cb(
        snap.docs.map((d) => ({
          userId: d.id,
          ...(d.data() as any),
        }))
      );
    });
  },

  async setAttendance(teamId: string, eventId: string, event: string, userId: string, status: AttendanceStatus) {
    const ref = doc(db, "teams", teamId, event, eventId, "attendance", userId);
    await setDoc(
      ref,
      { status, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  async listTrainingAttendance(teamId: string, trainingId: string) {
    const ref = collection(db, "teams", teamId, "trainings", trainingId, "attendance");
    const snap = await getDocs(ref);

    // key = userId (docId)
    const byUser: Record<string, AttendanceDoc> = {};
    snap.forEach((d) => {
      byUser[d.id] = d.data() as AttendanceDoc;
    });

    return byUser;
  },
}