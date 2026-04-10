import { useEffect, useState } from "react";
import { trainingRepo, TrainingModel } from "@/data/firebase/TrainingRepo";

export function useNextTraining(teamId?: string | null) {
  const [training, setTraining] = useState<TrainingModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!teamId) {
        setTraining(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await trainingRepo.getNextTraining(teamId);
        if (active) setTraining(data);
      } catch (error) {
        console.error("Failed to load next training:", error);
        if (active) setTraining(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [teamId]);

  return { training, loading };
}