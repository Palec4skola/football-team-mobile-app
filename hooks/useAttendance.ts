import { useEffect, useMemo, useState } from "react";
import { attendanceRepo, AttendanceDoc } from "@/data/firebase/AttendanceRepo";

export function useAttendance(teamId?: string, eventId?: string, event?: string) {
  const [rows, setRows] = useState<AttendanceDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId || !eventId || !event) return;
    setLoading(true);
    const unsub = attendanceRepo.watchAttendance(teamId, eventId, event, (list) => {
      setRows(list);
      setLoading(false);
    });
    return () => unsub();
  }, [teamId, eventId, event]);

  const byUserId = useMemo(() => {
    const map: Record<string, AttendanceDoc> = {};
    rows.forEach((r) => (map[r.userId] = r));
    return map;
  }, [rows]);

  return { rows, byUserId, loading };
}