import { useEffect, useState } from "react";
import {
  announcementRepo,
  TeamAnnouncementModel,
} from "@/data/firebase/AnnouncementRepo";

export function useLatestAnnouncements(teamId?: string | null, limitCount = 3) {
  const [announcements, setAnnouncements] = useState<TeamAnnouncementModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = announcementRepo.subscribe(
      teamId,
      (items) => {
        setAnnouncements(items.slice(0, limitCount));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to subscribe announcements:", error);
        setAnnouncements([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [teamId, limitCount]);

  return { announcements, loading };
}