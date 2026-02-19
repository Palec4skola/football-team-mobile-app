import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

export type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[]; // ak máš aj globálne roly, inak kľudne zmaž
  // ...ďalšie fields podľa toho, čo máš v users
};

export function useUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const ref = doc(db, 'users', userId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          if (!cancelled) {
            setProfile(null);
            setError('Používateľ neexistuje');
          }
          return;
        }

        if (!cancelled) {
          setProfile({ id: snap.id, ...(snap.data() as Omit<UserProfile, 'id'>) });
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
          setError('Nepodarilo sa načítať profil používateľa');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, loading, error };
}
