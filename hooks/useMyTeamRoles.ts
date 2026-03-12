import { useEffect, useMemo, useState } from "react";
import { teamRepo } from "@/data/firebase/TeamRepo";

export function useMyTeamRoles(teamId?: string, userId?: string) {
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    if (!teamId || !userId) return;
    setLoadingRoles(true);
    const unsub = teamRepo.watchMyMembership(teamId, userId, (m) => {
      setRoles(m?.roles ?? []);
      setLoadingRoles(false);
    });
    return () => unsub();
  }, [teamId, userId]);
  const isCoach = useMemo(() => roles.includes("coach"), [roles]);
  return { roles, isCoach, loadingRoles };
}