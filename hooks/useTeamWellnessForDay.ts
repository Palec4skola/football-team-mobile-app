import { useEffect, useMemo, useState } from "react";
import { wellnessRepo, type WellnessEntryDoc } from "@/data/firebase/WellnessRepo";

export function useTeamWellnessForDay(teamId: string, dateKey: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<WellnessEntryDoc & { id: string }>>([]);

  useEffect(() => {
    if (!teamId || !dateKey) return;

    setLoading(true);
    setError(null);

    const unsub = wellnessRepo.onTeamEntriesForDay(
      teamId,
      dateKey,
      (rows) => {
        setItems(rows);
        setLoading(false);
      },
      (e) => {
        setError(e.message ?? "Nepodarilo sa načítať wellness.");
        setLoading(false);
      },
    );

    return unsub;
  }, [teamId, dateKey]);

  const scoreByUser = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of items) {
      if (typeof r.score === "number") m[r.id] = r.score;
    }
    return m;
  }, [items]);

  return { loading, error, items, scoreByUser };
}