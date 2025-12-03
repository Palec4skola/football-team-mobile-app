import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function useTeamCollection(collectionName: string, teamId: string | null) {
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      const q = query(collection(db, collectionName), where("teamId", "==", teamId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setLoadingItems(false);
    };

    load();
  }, [teamId]);

  return { items, loadingItems };
}
