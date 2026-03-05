import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { matchRepo } from "@/data/firebase/MatchRepo";
import { alertsRepo } from "@/data/firebase/AlertsRepo";
import { auth } from "@/firebase";

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function useCreateMatch(teamId: string | null) {
  const [opponent, setOpponent] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return !!teamId && norm(opponent).length > 0 && norm(place).length > 0 && !loading;
  }, [teamId, opponent, place, loading]);

  async function submit(opts?: { onSuccess?: () => void; silentSuccess?: boolean }) {
    if (!teamId) {
      setErrorText("Chýba ID tímu");
      Alert.alert("Chyba", "Chýba ID tímu");
      return;
    }

    const o = norm(opponent);
    const p = norm(place);

    if (!o) return Alert.alert("Chyba", "Zadaj názov súpera");
    if (!p) return Alert.alert("Chyba", "Zadaj miesto zápasu");

    setLoading(true);
    setErrorText(null);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Používateľ nie je prihlásený");
      const matchId = await matchRepo.create(teamId, { opponent: o, place: p, date });

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

      if (!opts?.silentSuccess) Alert.alert("Úspech", "Zápas bol pridaný");
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
    loading,
    errorText,
    canSubmit,
    submit,
  };
}