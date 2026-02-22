// src/features/matches/hooks/useUpdateMatch.ts
import { useState } from "react";
import { Alert } from "react-native";
import { matchRepo, MatchUpdateInput } from "@/data/firebase/MatchRepo";

export function useUpdateMatch(teamId: string | null) {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function update(matchId: string, patch: MatchUpdateInput, onSuccess?: () => void) {
    if (!teamId) {
      Alert.alert("Chyba", "Chýba ID tímu");
      return;
    }

    setLoading(true);
    setErrorText(null);

    try {
      await matchRepo.update(teamId, matchId, patch);
      onSuccess?.();
    } catch (e: any) {
      const msg = e?.message ?? "Nepodarilo sa upraviť zápas";
      setErrorText(msg);
      Alert.alert("Chyba", msg);
    } finally {
      setLoading(false);
    }
  }

  return { loading, errorText, update };
}