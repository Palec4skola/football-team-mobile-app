import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase";

export type MyTeam = {
  teamId: string;        // teamId (docId v memberships)
  teamName: string;      // z memberships
  roles: string[];       // z memberships (napr. ["coach"])
  joinedAt?: any;        // Timestamp (voliteľné)
};

export function useMyTeams(userId: string | null) {
  const [teams, setTeams] = useState<MyTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!userId) {
    setTeams([]);
    setLoading(false);
    setError(null);
    return;
  }

  setLoading(true);

  const ref = collection(db, "users", userId, "memberships");

  const unsub = onSnapshot(
    ref,
    (snap) => {
      const items: MyTeam[] = snap.docs.map((d) => {
        const data = d.data() as any;

        const roles: string[] =
          Array.isArray(data.roles) ? data.roles : data.role ? [data.role] : [];

        return {
          teamId: data.teamId ?? d.id,
          teamName: data.teamName ?? "Tím",
          roles,
          joinedAt: data.joinedAt,
        };
      });

      setTeams(items);
      setError(null);
      setLoading(false);
    },
    () => {
      setTeams([]);
      setError("Nepodarilo sa načítať tvoje tímy");
      setLoading(false);
    }
  );

  return () => unsub();
}, [userId]);

  return { teams, loading, error };
}
