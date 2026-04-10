import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
  Timestamp,
  query,
  orderBy,
  updateDoc,
  where,
  getDocs,
  deleteDoc,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";

export type TrainingVideo = {
  url: string;
  path: string;
  name: string;
};

export type TrainingModel = {
  id: string;
  name: string;
  description?: string;
  startsAt?: any; // Timestamp
  video?: TrainingVideo | null;
};

export type Training = {
  id: string;
  startsAt: Timestamp;
};

export type CreateTrainingInput = {
  name: string;
  description?: string;
  startsAt: Date; // v UI Date, do Firestore pôjde Timestamp
  createdBy: string;
  video?: TrainingVideo | null;
};

export type UpdateTrainingInput = {
  name?: string;
  description?: string;
  startsAt?: Date;
  video?: TrainingVideo | null;
};

function mapDoc<T = DocumentData>(snap: any): T {
  return { id: snap.id, ...(snap.data() as any) };
}

export const trainingRepo = {
  watchTraining(
    teamId: string,
    trainingId: string,
    cb: (t: TrainingModel | null) => void,
  ): Unsubscribe {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);
    return onSnapshot(ref, (snap) => {
      cb(snap.exists() ? mapDoc<TrainingModel>(snap) : null);
    });
  },

  async create(teamId: string, input: CreateTrainingInput) {
    const colRef = collection(db, "teams", teamId, "trainings");

    const trainingRef = doc(colRef);

    await setDoc(trainingRef, {
      name: input.name.trim(),
      description: input.description?.trim() || "",
      startsAt: Timestamp.fromDate(input.startsAt),
      createdAt: serverTimestamp(),
      createdBy: input.createdBy,
      video: input.video || null,
    });

    return trainingRef.id;
  },

  async update(teamId: string, trainingId: string, input: UpdateTrainingInput) {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);

    const patch: any = {
      updatedAt: serverTimestamp(),
    };
    if (input.name != null) patch.name = input.name.trim();
    if (input.description != null) patch.description = input.description.trim();
    if (input.video !== undefined) patch.video = input.video;
    if (input.startsAt != null)
      patch.startsAt = Timestamp.fromDate(input.startsAt);
    await updateDoc(ref, patch);
  },

  async delete(teamId: string, trainingId: string) {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);
    await deleteDoc(ref);
  },

  watchByTeam(teamId: string, cb: (rows: TrainingModel[]) => void) {
    const colRef = collection(db, "teams", teamId, "trainings");

    const q = query(colRef, orderBy("startsAt", "asc"));

    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  },

  watchUpcomingByTeam(teamId: string, cb: (rows: TrainingModel[]) => void) {
    const colRef = collection(db, "teams", teamId, "trainings");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      colRef,
      where("startsAt", ">=", Timestamp.fromDate(today)),
      orderBy("startsAt", "asc"),
    );

    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  },

  watchPastByTeam(teamId: string, cb: (rows: TrainingModel[]) => void) {
    const colRef = collection(db, "teams", teamId, "trainings");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      colRef,
      where("startsAt", "<", Timestamp.fromDate(today)),
      orderBy("startsAt", "desc"), // najnovšie minulé hore
    );

    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  },

  async listTrainingsFrom(teamId: string, fromDate: Date): Promise<Training[]> {
    const trainingsRef = collection(db, "teams", teamId, "trainings");
    const qTrainings = query(
      trainingsRef,
      where("startsAt", ">=", Timestamp.fromDate(fromDate)),
    );

    const snap = await getDocs(qTrainings);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as Training[];
  },

  async getNextTraining(teamId: string): Promise<TrainingModel | null> {
    const now = new Date();

    const q = query(
      collection(db, "teams", teamId, "trainings"),
      where("startsAt", ">=", now),
      orderBy("startsAt", "asc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as TrainingModel;
  },
};
