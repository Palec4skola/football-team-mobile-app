import { useEffect, useMemo, useState } from "react";
import { AttendanceDoc, trainingRepo } from "@/data/firebase/TrainingRepo";

export function useTrainingAttendance(teamId?: string, trainingId?: string) {
  const [rows, setRows] = useState<AttendanceDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId || !trainingId) return;
    setLoading(true);
    const unsub = trainingRepo.watchAttendance(teamId, trainingId, (list) => {
      setRows(list);
      setLoading(false);
    });
    return () => unsub();
  }, [teamId, trainingId]);

  const byUserId = useMemo(() => {
    const map: Record<string, AttendanceDoc> = {};
    rows.forEach((r) => (map[r.userId] = r));
    return map;
  }, [rows]);

  return { rows, byUserId, loading };
}