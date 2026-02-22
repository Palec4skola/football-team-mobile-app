import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

type TeamMember = {
  id: string; // userId (docId)
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[];
  joinedAt?: any;
};

export function useTeamMembers(teamId: string | null) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    async function fetchMembers() {
      if (!teamId) {
        setMembers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // teams/{teamId}/members
        const membersRef = collection(db, 'teams', teamId, 'members');

        const q = query(membersRef, orderBy('lastName', 'asc'));

        const snapshot = await getDocs(q);
        const members = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<TeamMember, 'id'>),
        }));

        if (!cancelled) {
          setMembers(members);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setMembers([]);
          setError('Nepodarilo sa načítať členov tímu');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMembers();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  return { members, loading, error };
}
