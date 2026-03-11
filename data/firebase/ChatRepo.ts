// src/data/firebase/TeamChatRepo.ts
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase";

export type TeamChatMessage = {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp | null;
};

type SendMessageInput = {
  teamId: string;
  senderName: string | undefined;
  text: string;
};

class TeamChatRepo {
  private messagesCol(teamId: string) {
    return collection(db, "teams", teamId, "chatMessages");
  }

  subscribeToMessages(
    teamId: string,
    callback: (messages: TeamChatMessage[]) => void,
    onError?: (error: Error) => void
  ) {
    const q = query(
      this.messagesCol(teamId),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: TeamChatMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<TeamChatMessage, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });

        callback(messages);
      },
      (error) => {
        console.error("subscribeToMessages error:", error);
        onError?.(error as Error);
      }
    );
  }

  async sendMessage(input: SendMessageInput) {
    const user = auth.currentUser;
    if (!user) throw new Error("Používateľ nie je prihlásený.");

    const text = input.text.trim();
    if (!text) throw new Error("Správa je prázdna.");

    await addDoc(this.messagesCol(input.teamId), {
      teamId: input.teamId,
      senderId: user.uid,
      senderName: input.senderName,
      text,
      createdAt: serverTimestamp(),
    });
  }
}

export const teamChatRepo = new TeamChatRepo();