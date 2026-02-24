import { useEffect, useState } from "react";
import {
  wellnessRepo,
  WellnessEntry,
  WellnessSaveInput,
} from "@/data/firebase/WellnessRepo";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Skóre (voliteľné): vyššie = horšie
 * - sleepQuality, mood, energy sú u teba "zlá->výborná", takže ich invertujeme
 * - fatigue, muscleSoreness, stress sú "nízka->vysoká", takže necháme
 * Výsledok je 0..100 (približne), aby sa dal pekne ukazovať.
 */
function computeScore(e: WellnessEntry): number {
  const inv = (x: number) => 6 - clamp(x, 1, 5); // 1..5 -> 5..1

  const sleepQ = inv(e.sleepQuality);
  const mood = inv(e.mood);
  const energy = inv(e.energy);

  const fatigue = clamp(e.fatigue, 1, 5);
  const soreness = clamp(e.muscleSoreness, 1, 5);
  const stress = clamp(e.stress, 1, 5);

  const avg = (sleepQ + mood + energy + fatigue + soreness + stress) / 6; // 1..5
  return Math.round(((avg - 1) / 4) * 100); // 0..100
}

export function useTodayWellness(
  teamId: string | null,
  userId: string,
  dateKey: string,
) {
  const [entry, setEntry] = useState<WellnessEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !userId || !dateKey) {
      setEntry(null);
      setLoading(false);
      setError("Chýbajú údaje (teamId/userId/dateKey).");
      return;
    }

    setLoading(true);
    setError(null);

    const unsub = wellnessRepo.onEntry(
      teamId,
      dateKey,
      userId,
      (e: any) => {
        if (!e) {
          setEntry(null);
          setLoading(false);
          return;
        }
        const withScore: WellnessEntry = {
          ...e,
          score: computeScore(e as any),
        };
        setEntry(withScore);
        setLoading(false);
      },
      (err: any) => {
        setError(err?.message ?? "Chyba načítania wellness.");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [teamId, userId, dateKey]);

  async function save(
    input: WellnessSaveInput,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      console.log(teamId, userId);
      setLoading(true);
      setError(null);
      if (!teamId) {
        console.warn("Chýba teamId");
        return { ok: false, error: "Chýba teamId" };
      }
      await wellnessRepo.upsert(teamId, dateKey, userId, input);

      return { ok: true };
    } catch (e: any) {
      const msg = e?.code
        ? `${e.code}: ${e?.message ?? "Firestore error"}`
        : (e?.message ?? "Nepodarilo sa uložiť wellness.");

      console.log("[wellness.save] error", e); // dôležité: pozrieš v console
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { entry, loading, error, save };
}
