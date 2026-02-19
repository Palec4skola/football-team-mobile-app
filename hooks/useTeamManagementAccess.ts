import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type Result = {
  isLoading: boolean;
  isCoach: boolean;
  teamId: string | null;
  errorText: string | null;
};

export function useTeamManagementAccess(): Result {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setErrorText("Nie si prihlásený.");
      router.replace("../login");
      setIsLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsub = onSnapshot(
      userRef,
      async (snap) => {
        if (!snap.exists()) {
          setErrorText("Používateľ neexistuje");
          setTeamId(null);
          setIsCoach(false);
          setIsLoading(false);
          return;
        }

        const data = snap.data();
        const newTeamId = data.activeTeamId || null;
        setTeamId(newTeamId);

        if (!newTeamId) {
          setIsCoach(false);
          setErrorText(null);
          setIsLoading(false);
          return;
        }

        // načítame member dokument pre aktuálny tím
        const memberRef = doc(db, "teams", newTeamId, "members", user.uid);
        const memberSnap = await getDoc(memberRef);

        if (!memberSnap.exists()) {
          setIsCoach(false);
        } else {
          const memberData = memberSnap.data();
          const roles = Array.isArray(memberData.roles)
            ? memberData.roles
            : memberData.role
              ? [memberData.role]
              : [];

          setIsCoach(roles.includes("coach"));
        }

        setErrorText(null);
        setIsLoading(false);
        return;
      },
      (err) => {
        setErrorText(err.message ?? "Chyba načítania používateľa");
        setTeamId(null);
        setIsCoach(false);
        setIsLoading(false);
      },
    );

    return () => unsub();
  }, [router]);

  return { isLoading, isCoach, teamId, errorText };
}
