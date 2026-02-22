import { trainingRepo } from "@/data/firebase/TrainingRepo";
import { useState } from "react";
import { Alert } from "react-native";

export function useTrainingActions(teamId?: string | null) {
  const [loading, setLoading] = useState(false);

  const updateTraining = async (
    trainingId: string,
    patch: { name?: string; description?: string; startsAt?: Date },
  ) => {
    if (!teamId) return;
    setLoading(true);
    try {
      await trainingRepo.update(teamId, trainingId, patch);
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo se upravit tréning");
    } finally {
      setLoading(false);
    }
  };

  const deleteTraining = async (trainingId: string) => {
    if (!teamId) return;

    Alert.alert("Zmazať tréning?", "Táto akcia je nevratná", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Zmazať",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await trainingRepo.delete(teamId, trainingId);
          } catch (e: any) {
            Alert.alert("Chyba", e?.message ?? "Nepodarilo sa zmazať tréning");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  return {loading, updateTraining, deleteTraining}
}
