import { useEffect, useState } from "react";
import { matchRepo, Match } from "@/data/firebase/MatchRepo";

export function useTeamMatches(
  teamId?: string | null,
  filter: "upcoming" | "past" | "all" = "upcoming"
) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let unsub: () => void;

    if (filter === "upcoming") {
      unsub = matchRepo.watchUpcomingByTeam(teamId, (rows) => {
        setMatches(rows);
        setLoading(false);
      });
    } else if (filter === "past") {
      unsub = matchRepo.watchPastByTeam(teamId, (rows) => {
        setMatches(rows);
        setLoading(false);
      });
    } else {
      unsub = matchRepo.watchByTeam(teamId, (rows) => {
        setMatches(rows);
        setLoading(false);
      });
    }

    return () => unsub();
  }, [teamId, filter]);

  return { matches, loading };
}