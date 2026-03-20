import { useEffect, useState } from "react";
import {
  announcementRepo,
  TeamAnnouncementModel,
} from "@/data/firebase/AnnouncementRepo";

export function useAnnouncementDetail(
  teamId: string | null,
  announcementId: string | null,
) {
  const [announcement, setAnnouncement] = useState<TeamAnnouncementModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId || !announcementId) {
      setAnnouncement(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = announcementRepo.subscribeById(
      teamId,
      announcementId,
      (item) => {
        setAnnouncement(item);
        setLoading(false);
      },
      (error) => {
        console.error("useAnnouncementDetail subscribe error:", error);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [teamId, announcementId]);

  return {
    announcement,
    loading,
  };
}