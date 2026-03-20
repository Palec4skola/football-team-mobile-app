import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Match, matchRepo, MatchStatus } from "@/data/firebase/MatchRepo";

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function useEditMatchForm(teamId: string, matchId: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const [saving, setSaving] = useState(false);

  const [opponent, setOpponent] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date());

  const [status, setStatus] = useState<MatchStatus>("scheduled");
  const [teamScore, setTeamScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoadingMatch(true);
      try {
        const m = await matchRepo.getById(teamId, matchId);
        if (!alive) return;

        setMatch(m);

        if (m) {
          setOpponent(m.opponent ?? "");
          setPlace(m.place ?? "");
          setDate(m.date?.toDate ? m.date.toDate() : new Date());
          setStatus(m.status ?? "scheduled");
          setTeamScore(
            m.result?.team !== undefined ? String(m.result.team) : "",
          );
          setOpponentScore(
            m.result?.opponent !== undefined ? String(m.result.opponent) : "",
          );
          setDate(m.date?.toDate ? m.date.toDate() : new Date());
        }
      } catch (e: any) {
        if (!alive) return;
        Alert.alert("Chyba", e?.message ?? "Nepodarilo sa načítať zápas");
        setMatch(null);
      } finally {
        if (alive) setLoadingMatch(false);
      }
    }

    if (!teamId || !matchId) {
      setMatch(null);
      setLoadingMatch(false);
      return;
    }

    load();
    return () => {
      alive = false;
    };
  }, [teamId, matchId]);

  async function submit(): Promise<boolean> {
    const o = norm(opponent);
    const p = norm(place);

    if (!o) {
      Alert.alert("Chyba", "Zadaj názov súpera");
      return false;
    }
    if (!p) {
      Alert.alert("Chyba", "Zadaj miesto zápasu");
      return false;
    }

    setSaving(true);
    try {
      const result =
        status === "finished"
          ? {
              team: Number(teamScore),
              opponent: Number(opponentScore),
            }
          : null;
      await matchRepo.update(teamId, matchId, {
        opponent: opponent.trim(),
        place: place.trim(),
        date,
        status,
        result,
      });
      return true;
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa uložiť zmeny");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    match,
    loadingMatch,
    saving,

    opponent,
    setOpponent,
    place,
    setPlace,
    date,
    setDate,

    submit,
    status,
    setStatus,
    teamScore,
    setTeamScore,
    opponentScore,
    setOpponentScore,
  };
}
