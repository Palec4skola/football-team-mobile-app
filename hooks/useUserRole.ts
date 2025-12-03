import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export function useUserRole() {
  const [isCoach, setIsCoach] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      const userRef = doc(db, "users", auth.currentUser!.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const roles = snap.data().roles || [];
        setIsCoach(Array.isArray(roles) ? roles.includes("coach") : roles === "coach");
      }

      setLoadingRole(false);
    };

    loadRole();
  }, []);

  return { isCoach, loadingRole };
}
