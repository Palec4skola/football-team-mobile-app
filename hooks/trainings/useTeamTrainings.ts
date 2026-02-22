import { useEffect, useState } from "react";
import { trainingRepo, TrainingModel } from "@/data/firebase/TrainingRepo";

export function useTeamTrainings(teamId?: string | null) {
  const [trainings, setTrainings] = useState<TrainingModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setTrainings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = trainingRepo.watchByTeam(teamId, (rows) => {
      setTrainings(rows);
      setLoading(false);
    });

    return () => unsub();
  }, [teamId]);

  return { trainings, loading };
}