import { useEffect, useState } from "react";
import { matchRepo, TeamStats } from "@/data/firebase/MatchRepo";

type UseTeamStatsReturn = {
  stats: TeamStats;
  loading: boolean;
  error: string | null;
};

const emptyStats: TeamStats = {
  wins: 0,
  draws: 0,
  losses: 0,
  played: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
};

export function useTeamStats(teamId: string | null | undefined): UseTeamStatsReturn {
  const [stats, setStats] = useState<TeamStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setStats(emptyStats);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = matchRepo.onTeamStats(
      teamId,
      (nextStats) => {
        setStats(nextStats);
        setLoading(false);
      },
      () => {
        setError("Nepodarilo sa načítať štatistiky tímu.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [teamId]);

  return {
    stats,
    loading,
    error,
  };
}