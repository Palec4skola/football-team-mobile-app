import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { matchRepo } from "@/data/firebase/MatchRepo";
import { alertsRepo } from "@/data/firebase/AlertsRepo";
import { auth } from "@/firebase";
import type { MatchStatus, MatchResult } from "@/data/firebase/MatchRepo";

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function useCreateMatch(teamId: string | null) {
  const [opponent, setOpponent] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date());

  const [status, setStatus] = useState<MatchStatus>("scheduled");
  const [teamScore, setTeamScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [matchLink, setMatchLink] = useState("");

  const hasValidResult = useMemo(() => {
    if (status !== "finished") return true;

    if (teamScore.trim() === "" || opponentScore.trim() === "") return false;

    const team = Number(teamScore);
    const opponent = Number(opponentScore);

    return !Number.isNaN(team) && !Number.isNaN(opponent) && team >= 0 && opponent >= 0;
  }, [status, teamScore, opponentScore]);

  const canSubmit = useMemo(() => {
    return (
      !!teamId &&
      norm(opponent).length > 0 &&
      norm(place).length > 0 &&
      hasValidResult &&
      !loading
    );
  }, [teamId, opponent, place, hasValidResult, loading]);

  function buildResult(): MatchResult {
    if (status !== "finished") return null;

    return {
      team: Number(teamScore),
      opponent: Number(opponentScore),
    };
  }

  async function submit(opts?: { onSuccess?: () => void; silentSuccess?: boolean }) {
    if (!teamId) {
      setErrorText("Chýba ID tímu");
      Alert.alert("Chyba", "Chýba ID tímu");
      return;
    }

    const o = norm(opponent);
    const p = norm(place);

    if (!o) {
      Alert.alert("Chyba", "Zadaj názov súpera");
      return;
    }

    if (!p) {
      Alert.alert("Chyba", "Zadaj miesto zápasu");
      return;
    }

    if (status === "finished" && !hasValidResult) {
      Alert.alert("Chyba", "Zadaj platný výsledok zápasu");
      return;
    }

    setLoading(true);
    setErrorText(null);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Používateľ nie je prihlásený");

      const matchId = await matchRepo.create(teamId, {
        opponent: o,
        place: p,
        date,
        status,
        matchLink,
        result: buildResult(),
      });

      await alertsRepo.create({
        teamId,
        type: "match_created",
        title: "Pridaný zápas",
        body: `vs ${o}`,
        targetKind: "match",
        targetId: matchId,
        createdBy: uid,
      });

      setOpponent("");
      setPlace("");
      setDate(new Date());
      setStatus("scheduled");
      setMatchLink("");
      setTeamScore("");
      setOpponentScore("");

      if (!opts?.silentSuccess) {
        Alert.alert("Úspech", "Zápas bol pridaný");
      }

      opts?.onSuccess?.();
    } catch (e: any) {
      const msg = e?.message ?? "Nepodarilo sa pridať zápas";
      setErrorText(msg);
      Alert.alert("Chyba", msg);
    } finally {
      setLoading(false);
    }
  }

  return {
    opponent,
    setOpponent,
    place,
    setPlace,
    date,
    setDate,
    status,
    setStatus,
    matchLink,
    setMatchLink,
    teamScore,
    setTeamScore,
    opponentScore,
    setOpponentScore,
    loading,
    errorText,
    canSubmit,
    submit,
  };
}