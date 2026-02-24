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
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export type TrainingModel = {
  id: string;
  name: string;
  description?: string;
  startsAt?: any; // Timestamp
};

export type CreateTrainingInput = {
  name: string;
  description?: string;
  startsAt: Date; // v UI Date, do Firestore pôjde Timestamp
  createdBy: string;
};

export type UpdateTrainingInput = {
  name?: string;
  description?: string;
  startsAt?: Date;
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
    if (input.startsAt != null)
      patch.startsAt = Timestamp.fromDate(input.startsAt);
    await updateDoc(ref, patch);
  },

  async delete(teamId: string, trainingId: string) {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);
    await deleteDoc(ref);
  },

  watchByTeam(
    teamId: string,
    cb: (rows: TrainingModel[]) => void,
  ): Unsubscribe {
    const colRef = collection(db, "teams", teamId, "trainings");
    const q = query(colRef, orderBy("startsAt", "asc"));

    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  },

  watchOne(
    teamId: string,
    trainingId: string,
    cb: (t: any | null) => void,
  ): Unsubscribe {
    const ref = doc(db, "teams", teamId, "trainings", trainingId);
    return onSnapshot(ref, (snap) =>
      cb(snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null),
    );
  },
};
