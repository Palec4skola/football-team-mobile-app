// src/hooks/match/useMatchActions.ts
import { Alert } from "react-native";
import { matchRepo } from "@/data/firebase/MatchRepo";

export function useMatchActions(teamId: string | null) {
  async function deleteMatch(matchId: string) {
    if (!teamId) return;

    Alert.alert("Zmazať zápas", "Naozaj chceš zmazať tento zápas?", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Zmazať",
        style: "destructive",
        onPress: async () => {
          try {
            await matchRepo.delete(teamId, matchId);
          } catch (e: any) {
            Alert.alert("Chyba", e?.message ?? "Nepodarilo sa zmazať zápas");
          }
        },
      },
    ]);
  }

  return { deleteMatch };
}