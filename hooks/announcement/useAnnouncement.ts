// src/features/announcements/hooks/useAnnouncements.ts
import { useEffect, useState } from "react";
import {
  announcementRepo,
  TeamAnnouncementModel,
} from "@/data/firebase/AnnouncementRepo";

export function useAnnouncements(teamId: string | null) {
  const [announcements, setAnnouncements] = useState<TeamAnnouncementModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = announcementRepo.subscribe(
      teamId,
      (items) => {
        setAnnouncements(items);
        setLoading(false);
      },
      (error) => {
        console.error("useAnnouncements subscribe error:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [teamId]);

  return {
    announcements,
    loading,
  };
}