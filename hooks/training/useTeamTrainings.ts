import { useEffect, useState } from "react";
import { trainingRepo, TrainingModel } from "@/data/firebase/TrainingRepo";

export function useTeamTrainings(
  teamId?: string | null,
  filter: "upcoming" | "past" | "all" = "upcoming"
) {
  const [trainings, setTrainings] = useState<TrainingModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setTrainings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let unsub: () => void;

    if (filter === "upcoming") {
      unsub = trainingRepo.watchUpcomingByTeam(teamId, (rows) => {
        setTrainings(rows);
        setLoading(false);
      });
    } else if (filter === "past") {
      unsub = trainingRepo.watchPastByTeam(teamId, (rows) => {
        setTrainings(rows);
        setLoading(false);
      });
    } else {
      unsub = trainingRepo.watchByTeam(teamId, (rows) => {
        setTrainings(rows);
        setLoading(false);
      });
    }

    return () => unsub();
  }, [teamId, filter]);

  return { trainings, loading };
}