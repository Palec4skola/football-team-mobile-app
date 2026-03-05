import { useEffect, useState } from "react";
import { alertsRepo, TeamAlert } from "@/data/firebase/AlertsRepo";

export function useTeamAlerts(teamId: string | null) {
  const [alerts, setAlerts] = useState<TeamAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = alertsRepo.subscribeToTeamAlerts(teamId, {
      limit: 50,
      onData: (items) => {
        setAlerts(items);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });

    return () => unsub();
  }, [teamId]);

  return { alerts, loading };
}