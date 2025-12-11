import { useEffect, useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import { useRouter } from "expo-router";
import { doc, getDoc, query, where,collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Alert } from "react-native";

type Training = {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  date?: any; // Firestore Timestamp alebo string
};

type Player = {
  id: string;
  firstName?: string;
  lastName?: string;
  roles?: string[] | string;
};

type Attendance = {
  id: string;
  teamId: string;
  trainingId: string;
  userId: string;
  status: 'yes' | 'no';
};

export function useEventDetail(eventId: string | null) {
    const params = useSearchParams();
      const router = useRouter();
      const trainingId = params.get('trainingId');
      const teamId = params.get('teamId');
    
      const [training, setTraining] = useState<Training | null>(null);
      const [players, setPlayers] = useState<Player[]>([]);
      const [attendances, setAttendances] = useState<Attendance[]>([]);
      const [loading, setLoading] = useState(true);
      const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
      const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    
      const isCoach = currentUserRoles.includes('coach');

const loadData = async () => {
      setLoading(true);
      try {
        // 1) tréning
        const trainingRef = doc(db, eventId, trainingId);
        const trainingSnap = await getDoc(trainingRef);
        if (!trainingSnap.exists()) {
          Alert.alert('Chyba', 'Tréning nebol nájdený');
          router.back();
          return;
        }
        const trainingData = trainingSnap.data();
        setTraining({
          id: trainingSnap.id,
          ...(trainingData as any),
        });

        // 2) hráči tímu
        const playersQ = query(
          collection(db, 'users'),
          where('teamId', '==', teamId)
        );
        const playersSnap = await getDocs(playersQ);
        const playersList: Player[] = playersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setPlayers(playersList);

        // 3) attendance pre daný tréning
        const attQ = query(
          collection(db, 'attendances'),
          where('trainingId', '==', trainingId),
          where('teamId', '==', teamId)
        );
        const attSnap = await getDocs(attQ);
        const attList: Attendance[] = attSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setAttendances(attList);
      } catch (e: any) {
        Alert.alert('Chyba', 'Nepodarilo sa načítať údaje o tréningu');
        console.log(e);
      } finally {
        setLoading(false);
      }
    };







}