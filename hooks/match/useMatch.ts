import { useEffect, useState } from "react";
import { matchRepo, Match } from "@/data/firebase/MatchRepo";

export function useMatch(teamId: string, matchId: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const m = await matchRepo.getById(teamId, matchId);
        if (!alive) return;
        setMatch(m);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (!teamId || !matchId) {
      setMatch(null);
      setLoading(false);
      return;
    }

    load();
    return () => {
      alive = false;
    };
  }, [teamId, matchId]);

  return { match, loading };
}