// app/team/training-detail.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSearchParams } from 'expo-router/build/hooks';
import { useRouter } from 'expo-router';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

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

export default function TrainingDetailScreen() {
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

  // mapa attendance podľa userId
  const attendanceByUserId = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendances.forEach((a) => {
      map[a.userId] = a;
    });
    return map;
  }, [attendances]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
      // načítaj roly pre aktuálneho používateľa
      const loadRoles = async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (Array.isArray(data.roles)) {
              setCurrentUserRoles(data.roles);
            } else if (data.roles) {
              setCurrentUserRoles([data.roles]);
            } else {
              setCurrentUserRoles([]);
            }
          }
        } catch (e: any) {
          console.log('Error loading roles:', e.message);
        }
      };
      loadRoles();
    }
  }, []);

  useEffect(() => {
    if (!trainingId || !teamId) {
      Alert.alert('Chyba', 'Chýba trainingId alebo teamId');
      router.back();
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 1) tréning
        const trainingRef = doc(db, 'trainings', trainingId);
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

    loadData();
  }, [trainingId, teamId, router]);

  const updateAttendance = async (userId: string, status: 'yes' | 'no') => {
    if (!teamId || !trainingId) return;
    try {
      const existing = attendanceByUserId[userId];
      if (existing) {
        await updateDoc(doc(db, 'attendances', existing.id), {
          status,
          updatedAt: new Date(),
        });
        setAttendances((prev) =>
          prev.map((a) =>
            a.id === existing.id ? { ...a, status } : a
          )
        );
      } else {
        const ref = await addDoc(collection(db, 'attendances'), {
          teamId,
          trainingId,
          userId,
          status,
          updatedAt: new Date(),
        });
        setAttendances((prev) => [
          ...prev,
          { id: ref.id, teamId, trainingId, userId, status },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Chyba', 'Nepodarilo sa uložiť dochádzku');
      console.log(e);
    }
  };

  const renderStatusText = (userId: string) => {
    const att = attendanceByUserId[userId];
    if (!att) return 'Neurčené';
    if (att.status === 'yes') return 'Príde';
    if (att.status === 'no') return 'Nepríde';
    return 'Neurčené';
  };

  if (loading || !training) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formattedDate =
    training.date && training.date.toDate
      ? training.date.toDate().toLocaleDateString()
      : training.date ?? '---';

  return (
    <View style={styles.container}>
      {/* Info o tréningu */}
      <View style={styles.trainingCard}>
        <Text style={styles.trainingTitle}>{training.name}</Text>
        <Text style={styles.trainingInfo}>Dátum: {formattedDate}</Text>
        {training.description ? (
          <Text style={styles.trainingInfo}>Popis: {training.description}</Text>
        ) : null}
      </View>

      {/* Dochádzka */}
      <Text style={styles.sectionTitle}>Dochádzka hráčov</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || 'Neznámy hráč';
          const statusText = renderStatusText(item.id);
          const isCurrentUser = currentUserId === item.id;

          const canEditThisRow =
            isCoach || isCurrentUser; // tréner všetkých, hráč len seba

          return (
            <View style={styles.playerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{fullName}</Text>
                <Text style={styles.playerStatus}>Stav: {statusText}</Text>
              </View>

              {canEditThisRow && (
                <View style={styles.buttonsRow}>
                  <Button
                    style={[
                      styles.statusButton,
                      statusText === 'Príde' && styles.statusYes,
                    ]}
                    onPress={() => updateAttendance(item.id, 'yes')}
                  >
                    <Text style={styles.statusButtonText}>Prídem</Text>
                  </Button>
                  <Button
                    style={[
                      styles.statusButton,
                      statusText === 'Nepríde' && styles.statusNo,
                    ]}
                    onPress={() => updateAttendance(item.id, 'no')}
                  >
                    <Text style={styles.statusButtonText}>Neprídem</Text>
                  </Button>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text>Žiadni hráči pre tento tím.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  trainingCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  trainingTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  trainingInfo: { fontSize: 14, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  playerName: { fontSize: 16, fontWeight: '500' },
  playerStatus: { fontSize: 14, color: '#555' },
  buttonsRow: { flexDirection: 'row', gap: 8 },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 8,
  },
  statusYes: { backgroundColor: '#d4fcd4', borderColor: '#3bb54a' },
  statusNo: { backgroundColor: '#fcd4d4', borderColor: '#d9534f' },
  statusButtonText: { fontSize: 12 },
});
