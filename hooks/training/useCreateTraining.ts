// hooks/useCreateTraining.ts
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { auth } from "@/firebase";
import { trainingRepo } from "@/data/firebase/TrainingRepo";
import { alertsRepo } from "@/data/firebase/AlertsRepo";

export function useCreateTraining(teamId?: string | null) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return !!teamId && name.trim().length > 0 && !submitting;
  }, [teamId, name, submitting]);

  const submit = useCallback(async () => {
    if (!teamId) {
      Alert.alert("Chyba", "Chýba teamId");
      return null;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Chyba", "Nie si prihlásený");
      return null;
    }

    if (!name.trim()) {
      Alert.alert("Chyba", "Zadaj názov tréningu");
      return null;
    }

    setSubmitting(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Používateľ nie je prihlásený");
      const trainingId = await trainingRepo.create(teamId, {
        name,
        description,
        startsAt,
        createdBy: userId,
      });
      await alertsRepo.create({
  teamId,
  type: "training_created",
  title: "Nový tréning",
  body: name,
  targetKind: "training",
  targetId: trainingId,
  createdBy: uid,
});
      // reset form
      setName("");
      setDescription("");
      setStartsAt(new Date());

      return trainingId;
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa vytvoriť tréning");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [teamId, name, description, startsAt]);

  return {
    name,
    setName,
    description,
    setDescription,
    startsAt,
    setStartsAt,
    submitting,
    canSubmit,
    submit,
  };
}