// src/features/matches/hooks/useMatches.ts
import { useEffect, useState } from "react";
import { Match, matchRepo,  } from "@/data/firebase/MatchRepo";

export function useMatches(teamId: string | null) {
  const [items, setItems] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setItems([]);
      setLoading(false);
      setError("Chýba ID tímu");
      return;
    }

    setLoading(true);
    setError(null);

    const unsub = matchRepo.onList(
      teamId,
      (list) => {
        setItems(list);
        setLoading(false);
      },
      (e) => {
        setError(e?.message ?? "Chyba načítania zápasov");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [teamId]);

  return { items, loading, error };
}