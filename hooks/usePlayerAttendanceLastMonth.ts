import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { trainingRepo, type Training } from "@/data/firebase/TrainingRepo";
import { attendanceRepo, type AttendanceStatus } from "@/data/firebase/AttendanceRepo";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export type PlayerAttendanceRow = {
  trainingId: string;
  startsAt: Timestamp;
  title: string;
  status: AttendanceStatus | "unknown";
};

export function usePlayerAttendanceLastMonth(teamId: string, playerId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<PlayerAttendanceRow[]>([]);
  const [present, setPresent] = useState(0);
  const [total, setTotal] = useState(0);

  const fromDate = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 30);
    return startOfDay(from);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!teamId || !playerId) {
          setRows([]);
          setPresent(0);
          setTotal(0);
          return;
        }

        const trainings: Training[] = await trainingRepo.listTrainingsFrom(teamId, fromDate);
        if (cancelled) return;

        // zoradiť od najnovších
        trainings.sort((a, b) => b.startsAt.toMillis() - a.startsAt.toMillis());

        const out: PlayerAttendanceRow[] = [];
        let presentCount = 0;

        for (const t of trainings) {
          const att = await attendanceRepo.getPlayerAttendanceForTraining(teamId, t.id, playerId);

          const status = (att?.status ?? "unknown") as PlayerAttendanceRow["status"];
          if (status === "yes") presentCount++;

          out.push({
            trainingId: t.id,
            startsAt: t.startsAt,
            title: "Tréning",
            status,
          });
        }

        if (cancelled) return;

        setRows(out);
        setPresent(presentCount);
        setTotal(out.length);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Nepodarilo sa načítať dochádzku hráča.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamId, playerId, fromDate]);

  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return { loading, error, rows, present, total, pct, fromDate };
}