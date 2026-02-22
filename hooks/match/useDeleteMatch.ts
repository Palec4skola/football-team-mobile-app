// src/features/matches/hooks/useDeleteMatch.ts
import { useState } from "react";
import { Alert } from "react-native";
import { matchRepo } from "@/data/firebase/MatchRepo";

export function useDeleteMatch(teamId: string | null) {
  const [loading, setLoading] = useState(false);

  async function remove(matchId: string, onSuccess?: () => void) {
    if (!teamId) return Alert.alert("Chyba", "Chýba ID tímu");

    Alert.alert("Vymazať zápas", "Naozaj chceš vymazať tento zápas?", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Vymazať",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await matchRepo.remove(teamId, matchId);
            onSuccess?.();
          } catch (e: any) {
            Alert.alert("Chyba", e?.message ?? "Nepodarilo sa vymazať zápas");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }

  return { loading, remove };
}