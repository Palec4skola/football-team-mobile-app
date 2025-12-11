import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

export function useTeamPlayers(teamId: string | null) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setPlayers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchPlayers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('teamId', '==', teamId));
        const snapshot = await getDocs(q);
        const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersData);
        setError(null);
      } catch (err: any) {
        setPlayers([]);
        setError('Nepodarilo sa načítať členov tímu');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [teamId]);

  return { players, loading, error };
}
