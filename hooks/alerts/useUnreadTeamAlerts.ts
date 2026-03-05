import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { alertsRepo, TeamAlert } from "@/data/firebase/AlertsRepo";

export function useUnreadTeamAlerts(teamId: string | null, lastReadAt: Timestamp | null) {
  const [alerts, setAlerts] = useState<TeamAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = alertsRepo.subscribeToTeamAlertsSince(teamId, lastReadAt, {
      limit: 50,
      onData: (items) => {
        setAlerts(items);
        setLoading(false);
      },
      onError: () => setLoading(false),
    });

    return () => unsub();
  }, [teamId, lastReadAt]);

  return { alerts, loading };
}