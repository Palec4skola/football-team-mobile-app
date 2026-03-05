import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { userRepo } from "@/data/firebase/UserRepo";
import { auth } from "@/firebase";

export function useLastAlertsReadAt() {
  const [lastReadAt, setLastReadAt] = useState<Timestamp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsub = userRepo.subscribeLastAlertsReadAt(uid, {
      onData: (ts) => {
        setLastReadAt(ts);
        setLoading(false);
      },
      onError: () => setLoading(false),
    });

    return () => unsub();
  }, []);

  return { lastReadAt, loading };
}