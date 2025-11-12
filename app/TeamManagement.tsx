import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from './firebase'; // uprav podľa svojej štruktúry
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';


export default function TeamManagement() {
  const router = useRouter();
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamId() {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            console.log(data);
        } else {
        console.log('Dokument neexistuje');
        }
      } catch (error) {
        Alert.alert('Chyba', 'Nepodarilo sa načítať tím');
      }
    }
    fetchTeamId();
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const playersCollection = collection(db, 'players');
    const q = query(playersCollection, where('teamId', '==', teamId));

    // Live načítanie hráčov
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedPlayers: { id: string; name: string }[] = [];
      querySnapshot.forEach(doc => {
        loadedPlayers.push({ id: doc.id, name: doc.data().name });
      });
      setPlayers(loadedPlayers);
    });

    return () => unsubscribe(); // unsubscribe pri odchode z obrazovky
  }, [teamId]);

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await deleteDoc(doc(db, 'players', playerId));
      Alert.alert('Úspech', 'Hráč bol odstránený');
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  const renderPlayer = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.playerRow}>
      <Text style={styles.playerName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemovePlayer(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Odstrániť</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Správa tímu</Text>

      {players.length === 0 ? (
        <Text>Žiadni hráči v tíme</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          renderItem={renderPlayer}
          style={{ marginBottom: 20 }}
        />
      )}

      <Button title="Pridať hráča" onPress={() => router.push('/generate-code')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  playerName: { fontSize: 18 },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  removeButtonText: { color: 'white', fontWeight: '600' },
});
