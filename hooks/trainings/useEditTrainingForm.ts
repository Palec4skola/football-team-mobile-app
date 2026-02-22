// hooks/useEditTrainingForm.ts
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useTraining } from "./useTraining";
import { useTrainingActions } from "./useTrainingActions";

function toDateOrNow(value: any): Date {
  // Firestore Timestamp -> Date
  if (value?.toDate) return value.toDate();
  // JS Date (ak by sa niekde objavilo)
  if (value instanceof Date) return value;
  return new Date();
}

export function useEditTrainingForm(teamId?: string | null, trainingId?: string | null) {
  const { training, loading: loadingTraining } = useTraining(teamId ?? undefined, trainingId ?? undefined);
  const { updateTraining, loading: saving } = useTrainingActions(teamId ?? undefined);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState(new Date());
  const [initialized, setInitialized] = useState(false);

  // naplň form len raz po načítaní tréningu
  useEffect(() => {
    if (!training || initialized) return;

    setName(training.name ?? "");
    setDescription(training.description ?? "");
    setStartsAt(toDateOrNow(training.startsAt));
    setInitialized(true);
  }, [training, initialized]);

  const canSubmit = useMemo(() => {
    return !!teamId && !!trainingId && name.trim().length > 0 && !saving;
  }, [teamId, trainingId, name, saving]);

  const submit = async () => {
    if (!teamId || !trainingId) {
      Alert.alert("Chyba", "Chýba teamId alebo trainingId");
      return false;
    }
    if (!name.trim()) {
      Alert.alert("Chyba", "Zadaj názov tréningu");
      return false;
    }

    await updateTraining(trainingId, {
      name,
      description,
      startsAt,
    });

    return true;
  };

  return {
    training,
    loadingTraining,
    saving,
    canSubmit,
    name,
    setName,
    description,
    setDescription,
    startsAt,
    setStartsAt,
    submit,
  };
}