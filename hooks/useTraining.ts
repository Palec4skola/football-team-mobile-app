import { useEffect, useState } from "react";
import { trainingRepo, TrainingModel } from "@/data/firebase/TrainingRepo";

export function useTraining(teamId?: string, trainingId?: string) {
  const [training, setTraining] = useState<TrainingModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId || !trainingId) return;
    setLoading(true);
    const unsub = trainingRepo.watchTraining(teamId, trainingId, (t) => {
      setTraining(t);
      setLoading(false);
    });
    return () => unsub();
  }, [teamId, trainingId]);

  return { training, loading };
}