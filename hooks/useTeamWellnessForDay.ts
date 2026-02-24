import { useEffect, useMemo, useState } from "react";
import { WellnessEntryDoc, wellnessRepo } from "@/data/firebase/WellnessRepo";

export type TeamWellnessItem = WellnessEntryDoc & { id: string; score: number };

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function computeScore(e: WellnessEntryDoc): number {
  // vyššie = horšie, 0..100
  const inv = (x: number) => 6 - clamp(x, 1, 5);

  const sleepQ = inv(e.sleepQuality);
  const mood = inv(e.mood);
  const energy = inv(e.energy);

  const fatigue = clamp(e.fatigue, 1, 5);
  const soreness = clamp(e.muscleSoreness, 1, 5);
  const stress = clamp(e.stress, 1, 5);

  const avg = (sleepQ + mood + energy + fatigue + soreness + stress) / 6;
  return Math.round(((avg - 1) / 4) * 100);
}

export function useTeamWellnessForDay(teamId: string | null, dateKey: string) {
  const [items, setItems] = useState<TeamWellnessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setItems([]);
      setLoading(false);
      setError("Chýba teamId");
      return;
    }

    setLoading(true);
    setError(null);

    const unsub = wellnessRepo.onTeamEntriesForDay(
      teamId,
      dateKey,
      (raw: any[]) => {
        setItems(raw.map((x: any) => ({ ...x, score: computeScore(x) })));
        setLoading(false);
      },
      (e: any) => {
        setError(e?.message ?? "Chyba načítania wellness");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [teamId, dateKey]);

  const overall = useMemo(() => {
    if (items.length === 0) return null;
    const avg = items.reduce((s, x) => s + x.score, 0) / items.length;
    return Math.round(avg);
  }, [items]);

  return { items, overall, loading, error };
}