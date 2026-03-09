// src/data/firebase/AnnouncementRepo.ts
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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export type TeamAnnouncementModel = {
  id: string;
  teamId: string;
  title: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy: string;
  createdByName?: string;
};

type CreateAnnouncementInput = {
  title: string;
  content: string;
  createdBy: string;
  createdByName?: string;
};

type UpdateAnnouncementInput = {
  title?: string;
  content?: string;
};

function announcementsCol(teamId: string) {
  return collection(db, "teams", teamId, "announcements");
}

function announcementDoc(teamId: string, announcementId: string) {
  return doc(db, "teams", teamId, "announcements", announcementId);
}

function mapAnnouncement(
  teamId: string,
  id: string,
  data: Record<string, any>,
): TeamAnnouncementModel {
  return {
    id,
    teamId,
    title: data.title ?? "",
    content: data.content ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy ?? "",
    createdByName: data.createdByName ?? "",
  };
}

export const announcementRepo = {
  async create(
    teamId: string,
    input: CreateAnnouncementInput,
  ): Promise<string> {
    const colRef = announcementsCol(teamId);

    const docRef = await addDoc(colRef, {
      title: input.title.trim(),
      content: input.content.trim(),
      createdBy: input.createdBy,
      createdByName: input.createdByName ?? "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async getAll(teamId: string): Promise<TeamAnnouncementModel[]> {
    const q = query(announcementsCol(teamId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => mapAnnouncement(teamId, d.id, d.data()));
  },

  subscribe(
    teamId: string,
    callback: (items: TeamAnnouncementModel[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(announcementsCol(teamId), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) =>
          mapAnnouncement(teamId, d.id, d.data()),
        );
        callback(items);
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  async getById(
    teamId: string,
    announcementId: string,
  ): Promise<TeamAnnouncementModel | null> {
    const docRef = announcementDoc(teamId, announcementId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    return mapAnnouncement(teamId, snap.id, snap.data());
  },

  subscribeById(
    teamId: string,
    announcementId: string,
    callback: (item: TeamAnnouncementModel | null) => void,
    onError?: (error: Error) => void,
  ) {
    const docRef = announcementDoc(teamId, announcementId);

    return onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          callback(null);
          return;
        }

        callback(mapAnnouncement(teamId, snap.id, snap.data() as Record<string, any>));
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  async update(
    teamId: string,
    announcementId: string,
    input: UpdateAnnouncementInput,
  ): Promise<void> {
    const docRef = announcementDoc(teamId, announcementId);

    const payload: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (typeof input.title === "string") {
      payload.title = input.title.trim();
    }

    if (typeof input.content === "string") {
      payload.content = input.content.trim();
    }

    await updateDoc(docRef, payload);
  },

  async remove(teamId: string, announcementId: string): Promise<void> {
    const docRef = announcementDoc(teamId, announcementId);
    await deleteDoc(docRef);
  },
};