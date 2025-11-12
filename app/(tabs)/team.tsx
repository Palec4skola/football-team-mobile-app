import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../firebase'; // uprav podľa cesty
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function TeamManagement() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [newPlayerEmail, setNewPlayerEmail] = useState('');

  useEffect(() => {
    async function checkUserRole() {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const roles = data.roles || [];
          if (Array.isArray(roles) ? roles.includes('coach') : roles === 'coach') {
            setIsCoach(true);
          }
          const currentTeamId = data.teamId || null;
          setTeamId(currentTeamId);

          if (currentTeamId) {
            await fetchPlayers(currentTeamId);
          }
        } else {
          Alert.alert('Chyba', 'Používateľ neexistuje');
          router.replace('../login');
        }
      } catch (error: any) {
        Alert.alert('Chyba', error.message);
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    }
    checkUserRole();
  }, []);

  const fetchPlayers = async (teamId: string) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('teamId', '==', teamId));
      const snapshot = await getDocs(q);
      const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersData);
    } catch (error) {
      Alert.alert('Chyba', 'Nepodarilo sa načítať členov tímu');
    }
  };

  const handleAddPlayer = () => {
    // Tu môžeš presmerovať na obrazovku alebo modul pre pridanie hráča, napríklad s generovaným kódom
    router.push('../team/generate-code');
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!teamId) {
    return (
      <View style={styles.center}>
        <Text>Neboli nájdené žiadne údaje o tíme.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Správa tímu</Text>

      {isCoach && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
          <Text style={styles.addButtonText}>Pridať hráča</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text style={styles.playerText}>
              {item.firstName} {item.lastName} — {item.roles?.includes('coach') ? 'Tréner' : 'Hráč'}
              {item.id === auth.currentUser?.uid ? ' (Ty)' : ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Žiadni členovia tímu</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  playerText: {
    fontSize: 16,
  },
});
