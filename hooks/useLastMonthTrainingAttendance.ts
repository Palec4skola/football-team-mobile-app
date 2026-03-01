import { useEffect, useMemo, useState } from "react";
import { attendanceRepo } from "@/data/firebase/AttendanceRepo";
import { trainingRepo } from "@/data/firebase/TrainingRepo";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function useLastMonthTrainingAttendance(teamId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalTrainings, setTotalTrainings] = useState(0);
  const [presentCountByUser, setPresentCountByUser] = useState<Record<string, number>>({});

  const fromDate = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 30);
    return startOfDay(from);
  }, []);

  useEffect(() => {
    if (!teamId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const trainings = await trainingRepo.listTrainingsFrom(teamId, fromDate);
        if (cancelled) return;

        setTotalTrainings(trainings.length);

        const counts: Record<string, number> = {};

        // N dotazov (1 tréning -> attendance)
        for (const t of trainings) {
          const byUser = await attendanceRepo.listTrainingAttendance(teamId, t.id);

          for (const [userId, data] of Object.entries(byUser)) {
            if (data.status === "yes") {
              counts[userId] = (counts[userId] ?? 0) + 1;
            }
          }
        }

        if (cancelled) return;
        setPresentCountByUser(counts);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Nepodarilo sa načítať dochádzku.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamId, fromDate]);

  return {
    loading,
    error,
    totalTrainings,
    presentCountByUser,
    fromDate,
  };
}