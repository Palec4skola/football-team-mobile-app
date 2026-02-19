import { useCallback, useEffect, useState } from "react";
import { getTodayEntry, upsertTodayEntry } from "@/services/wellness/wellnessService";

export function useTodayWellness(teamId: string | null, userId: string | null, dateKey: string) {
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!teamId || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const e = await getTodayEntry(teamId, dateKey, userId);
      setEntry(e);
    } catch (e: any) {
      setError(e?.message ?? "Chyba načítania wellness");
    } finally {
      setLoading(false);
    }
  }, [teamId, userId, dateKey]);

  useEffect(() => { reload(); }, [reload]);

  const save = useCallback(async (data: any) => {
    if (!teamId || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const score = await upsertTodayEntry(teamId, dateKey, userId, data);
      await reload();
      return score;
    } catch (e: any) {
      setError(e?.message ?? "Chyba uloženia wellness");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [teamId, userId, dateKey, reload]);

  return { entry, loading, error, reload, save };
}