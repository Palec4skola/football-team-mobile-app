// src/hooks/match/useTeamMatches.ts
import { useEffect, useState } from "react";
import { Match, matchRepo, } from "@/data/firebase/MatchRepo";

export function useTeamMatches(teamId: string | null) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = matchRepo.onList(teamId, (items) => {
      setMatches(items);
      setLoading(false);
    });

    return () => unsub();
  }, [teamId]);

  return { matches, loading };
}