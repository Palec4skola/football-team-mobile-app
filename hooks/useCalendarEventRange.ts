import { useCallback, useMemo, useRef, useState } from "react";
import { calendarRepo } from "@/data/firebase/CalendarRepo"; // ten čo už máš: listTrainingsInRange + listMatchesInRange

export type CalendarEvent = {
  id: string;
  kind: "training" | "match";
  startsAt: Date;
  title: string;
  subtitle?: string;
};

function toDateKey(d: Date) {
  // YYYY-MM-DD (local)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useCalendarEventsRange(teamId: string | null) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const loadedRangesRef = useRef<Array<{ from: number; to: number }>>([]); // millis ranges, simple cache

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      const key = toDateKey(e.startsAt);
      (map[key] ??= []).push(e);
    }
    // zoradiť v rámci dňa
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    }
    return map;
  }, [events]);

  const loadRange = useCallback(
    async (from: Date, to: Date) => {
      if (!teamId) return;

      const fromMs = from.getTime();
      const toMs = to.getTime();

      const covered = loadedRangesRef.current.some((r) => r.from <= fromMs && r.to >= toMs);
      if (covered) return;

      setLoading(true);
      try {
        const [trainings, matches] = await Promise.all([
          calendarRepo.listTrainingsInRange(teamId, from, to),
          calendarRepo.listMatchesInRange(teamId, from, to),
        ]);

        const merged: CalendarEvent[] = [
          ...trainings.map((t) => ({
            id: t.id,
            kind: "training" as const,
            startsAt: t.startsAt.toDate(),
            title: t.name ?? "Tréning",
          })),
          ...matches.map((m) => ({
            id: m.id,
            kind: "match" as const,
            startsAt: m.date.toDate(),
            title: "Zápas",
            subtitle: m.opponent ? `vs ${m.opponent}` : undefined,
          })),
        ];

        setEvents((prev) => {
          // merge bez duplicít
          const seen = new Set(prev.map((x) => `${x.kind}:${x.id}`));
          const add = merged.filter((x) => !seen.has(`${x.kind}:${x.id}`));
          const out = [...prev, ...add];
          out.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
          return out;
        });

        loadedRangesRef.current.push({ from: fromMs, to: toMs });
      } finally {
        setLoading(false);
      }
    },
    [teamId],
  );
  return { loading, eventsByDay, loadRange };
}