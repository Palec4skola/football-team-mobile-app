import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {Button, Text} from 'react-native-paper';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { auth, db } from '../../firebase'; // uprav podľa cesty
import { useTeamPlayers } from '../../hooks/useTeamPlayers';


export default function TeamManagement() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  // Remove local players state, use hook instead


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
  }, [router]);

  // Remove fetchPlayers, use hook below

  const handleAddPlayer = () => {
    router.push({
  pathname: '/create-join-team/generate-code',
  params: { teamId }
});
  };

  // Use the hook to get players
  const { players, loading: playersLoading, error: playersError } = useTeamPlayers(teamId);

  if (isLoading || (teamId && playersLoading)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (playersError) {
    return (
      <View style={styles.center}>
        <Text>Chyba načítania členov tímu: {playersError}</Text>
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
        <Button style={styles.addButton} onPress={handleAddPlayer}>
          <Text style={styles.addButtonText}>Pridať hráča</Text>
        </Button>
      )}

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
        <Button 
          style={styles.playerItem}
          onPress={() => router.push({
            pathname: '../team/player-profile',
            params: { playerId: item.id }
          })}
        >
          <Text style={styles.playerText}>
            {item.firstName} {item.lastName} — {(() => {
              const roles = item.roles || [];
              if (roles.length === 0) return 'Žiadna rola';
              if (roles.includes('coach') && roles.includes('player')) return 'Tréner a Hráč';
              if (roles.includes('coach')) return 'Tréner';
              if (roles.includes('player')) return 'Hráč';
              return roles.join(', ');
            })()}
            {item.id === auth.currentUser?.uid ? ' (Ty)' : ''}
          </Text>
        </Button>
      )}
        ListEmptyComponent={<Text>Žiadny členovia tímu</Text>}
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
