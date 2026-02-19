import { useState, useEffect } from "react";
import { teamRepo } from "@/data/firebase/TeamRepo";
import { doc, onSnapshot } from "firebase/firestore";
import { auth,db } from "@/firebase";
type TeamLevel = "amateur" | "professional" | null;
export function useActiveTeam() {
  
  const [loading, setLoading] = useState(true);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [teamLevel, setTeamLevel] = useState<TeamLevel>(null);
  useEffect(() => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    setTeamId(null);
    setTeamLevel(null);
    setLoading(false);
    return;
  }

  setLoading(true);

  const userRef = doc(db, "users", uid);

  const unsub = onSnapshot(
    userRef,
    async (snap) => {
      const data = snap.data();
      const activeTeamId = (data?.activeTeamId as string | null) ?? null;

      setTeamId(activeTeamId);

      if (!activeTeamId) {
        setTeamLevel(null);
        setLoading(false);
        return;
      }

      try {
        const level = await teamRepo.getTeamLevel(activeTeamId);
        setTeamLevel(level ?? null);
      } catch {
        setTeamLevel(null);
      } finally {
        setLoading(false);
      }
    },
    () => {
      setTeamId(null);
      setTeamLevel(null);
      setLoading(false);
    }
  );

  return () => unsub();
}, []);
  return { loading, teamId, teamLevel };
}