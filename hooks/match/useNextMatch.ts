import { useEffect, useState } from "react";
import { matchRepo, Match } from "@/data/firebase/MatchRepo";

export function useNextMatch(teamId?: string | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!teamId) {
        setMatch(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await matchRepo.getNextMatch(teamId);
        if (active) setMatch(data);
      } catch (error) {
        console.error("Failed to load next match:", error);
        if (active) setMatch(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [teamId]);

  return { match, loading };
}