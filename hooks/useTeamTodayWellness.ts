import { useEffect, useState } from "react";
import { subscribeTeamToday } from "@/services/wellness/wellnessService";

export function useTeamTodayWellness(teamId: string | null, dateKey: string) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    const unsub = subscribeTeamToday(teamId, dateKey, (r) => {
      setRows(r);
      setLoading(false);
    });
    return () => unsub();
  }, [teamId, dateKey]);

  return { rows, loading };
}