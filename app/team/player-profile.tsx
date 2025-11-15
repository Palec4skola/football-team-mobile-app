import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useSearchParams } from 'expo-router/build/hooks';

export default function PlayerProfile() {
  const  params  = useSearchParams();
  const playerId = params.get('playerId');
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCurrentUser() {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setCurrentUserRoles(Array.isArray(data.roles) ? data.roles : [data.roles]);
        }
      }
    }
    async function fetchPlayer() {
      if (!playerId) {
        Alert.alert('Chyba', 'Nezadali ste ID hráča');
        return;
      }
      try {
        const docRef = doc(db, 'users', playerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlayer(data);
          // Prednastav rolu podľa uložených dát (predpoklad: roles je pole)
          if (Array.isArray(player?.roles)) {
            setSelectedRoles(player.roles);
          } else if (player?.roles) {
            setSelectedRoles([player.roles]);
          } else {
            setSelectedRoles([]);
          }
        } else {
          Alert.alert('Chyba', 'Hráč nebol nájdený');
        }
      } catch (error: any) {
        Alert.alert('Chyba', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
    fetchCurrentUser();
  }, [playerId]);
  const isCoach = currentUserRoles.includes('coach');

  const handleUpdateRole = async (newRoles: string[]) => {
  if (!playerId) return;
  try {
    await updateDoc(doc(db, 'users', playerId), {
      roles: newRoles.length > 0 ? newRoles : ['player'], // Ak pole prázdne, nastav aspoň 'player'
    });
    setSelectedRoles(newRoles);
    Alert.alert('Úspech', 'Roly hráča boli aktualizované');
  } catch (error: any) {
    Alert.alert('Chyba', error.message);
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.center}>
        <Text>Žiadne údaje o hráčovi.</Text>
      </View>
    );
  }
  const handleUpdateRoles = async () => {
    if (!playerId) return;
    try {
      await updateDoc(doc(db, 'users', playerId), {
        roles: selectedRoles.length > 0 ? selectedRoles : ['player'], // aspoň hráč
      });
      Alert.alert('Úspech', 'Roly boli aktualizované');
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Meno: {player?.firstName || '---'}</Text>
      <Text>Priezvisko: {player?.lastName || '---'}</Text>
      <Text>Email: {player?.email}</Text>
      {isCoach && (
        <View>
          <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
            Role:{' '}
            {(() => {
              const roles = player.roles || [];
              if (roles.length === 0) return 'Žiadna rola';
              if (roles.includes('coach') && roles.includes('player')) return 'Tréner a Hráč';
              if (roles.includes('coach')) return 'Tréner';
              if (roles.includes('player')) return 'Hráč';
              return roles.join(', ');
            })()}
          </Text>          
          <View style={styles.roleButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRoles.includes('player') && styles.roleButtonSelected,
              ]}
              onPress={() => toggleRole('player')}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRoles.includes('player') && styles.roleTextSelected,
                ]}
              >
                Hráč
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRoles.includes('coach') && styles.roleButtonSelected,
              ]}
              onPress={() => toggleRole('coach')}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRoles.includes('coach') && styles.roleTextSelected,
                ]}
              >
                Tréner
              </Text>
            </TouchableOpacity>
          </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateRoles}>
        <Text style={styles.saveButtonText}>Uložiť roly</Text>
      </TouchableOpacity>
    </View>
      )}
      {!isCoach && (
        <Text style={{marginTop: 20}}>{player.roles?.includes('coach') ? 'Tréner' : 'Hráč'}</Text>
      )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  roleButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#007AFF',
  },
  roleText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  roleTextSelected: {
    color: 'white',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
