import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { matchRepo } from "@/data/firebase/MatchRepo";

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
      await matchRepo.create(teamId, { opponent: o, place: p, date });

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