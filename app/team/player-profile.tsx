import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useSearchParams } from 'expo-router/build/hooks';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerProfile() {
  const params = useSearchParams();
  const playerId = params.get('playerId'); 
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string | null>(null);
  const [editingStatValue, setEditingStatValue] = useState('');

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
          if (Array.isArray(data.roles)) {
            setSelectedRoles(data.roles);
          } else if (data.roles) {
            setSelectedRoles([data.roles]);
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

  const handleUpdateRoles = async () => {
    if (!playerId) return;
    try {
      await updateDoc(doc(db, 'users', playerId), {
        roles: selectedRoles.length > 0 ? selectedRoles : ['player'],
      });
      Alert.alert('Úspech', 'Roly boli aktualizované');
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Otváranie modalu a nastavenie hodnoty
  const openEditModal = (statKey: string) => {
    if (!isCoach) return; // len tréner môže editovať
    setEditingStatKey(statKey);
    setEditingStatValue(player?.[statKey]?.toString() || '');
    setModalVisible(true);
  };

  // Uloženie novej hodnoty a zatvorenie modalu
  const saveStatValue = async () => {
    if (!editingStatKey || !playerId) {
      setModalVisible(false);
      return;
    }
    try {
      const trimmedValue = editingStatValue.trim();
      if (trimmedValue === '') return;
      await updateDoc(doc(db, 'users', playerId), {
        [editingStatKey]: trimmedValue,
      });
      setPlayer((prev: any) => ({
        ...prev,
        [editingStatKey]: trimmedValue,
      }));
      Alert.alert('Úspech', `Štatistika ${editingStatKey} bola aktualizovaná`);
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    } finally {
      setModalVisible(false);
    }
  };
    const handleRemoveFromTeam = async () => {
    if (!playerId) return;

    Alert.alert(
      'Odstrániť hráča',
      'Naozaj chceš odstrániť hráča z tímu?',
      [
        { text: 'Zrušiť', style: 'cancel' },
        {
          text: 'Odstrániť',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', playerId), {
                teamId: null,
              });
              Alert.alert('Úspech', 'Hráč bol odstránený z tímu');
            } catch (error: any) {
              Alert.alert('Chyba', error.message);
            }
          },
        },
      ]
    );
  };

  
  // Funkcia na editovanie fyzických štatistík (len ukážka, môžeš použiť modal alebo inline edit)
  const handleEditStat = async (statKey: string) => {
  // Uistíme sa, že editáciu povolí len tréner
  if (!isCoach) return;

  Alert.prompt(
    `Zadaj hodnotu pre ${statKey}`,
    '',
    [
      { text: 'Zrušiť', style: 'cancel' },
      {
        text: 'Uložiť',
        onPress: async (newValue?: string) => {
          if (!newValue) return;
          if (!playerId) return;

          try {
            await updateDoc(doc(db, 'users', playerId), {
              [statKey]: newValue,
            });
            setPlayer((prev: any) => ({ ...prev, [statKey]: newValue }));
            Alert.alert('Úspech', `Štatistika ${statKey} bola aktualizovaná`);
          } catch (error: any) {
            Alert.alert('Chyba', error.message);
          }
        },
      },
    ],
    'plain-text',
    player[statKey]?.toString() || ''
  );
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

  // Výpis fyzických a kondičných štatistík s možnosťou editácie, viditeľný len pre trénera
  const renderPhysicalStats = () => (
  <View style={{ marginTop: 20 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Fyzické a kondičné štatistiky</Text>
    {[
      { key: 'height', label: 'Výška (cm)' },
      { key: 'weight', label: 'Hmotnosť (kg)' },
      { key: 'BMI', label: 'BMI' },
      { key: 'VO2max', label: 'VO2 max' },
      { key: 'maxSpeed', label: 'Najvyššia rýchlosť' },
    ].map(({ key, label }) => (
      <View key={key} style={styles.statRow}>
        <Text style={styles.statLabel}>
          {label}: {player[key] != null ? player[key] : '---'}
        </Text>
        {/* Ikonka pera je viditeľná a klikateľná len pre trénera */}
        {isCoach && (
          <TouchableOpacity onPress={() => openEditModal(key)}>
            <Ionicons name="pencil" size={22} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
);

  return (
    <View style={styles.container}>
      <Text>Meno: {player?.firstName || '---'}</Text>
      <Text>Priezvisko: {player?.lastName || '---'}</Text>
      <Text>Email: {player?.email}</Text>

      {isCoach && (
        <>
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

          {renderPhysicalStats()}
        </>
      )}

      {!isCoach && (
        <>
          <Text style={{ marginTop: 20 }}>
            Role: {player.roles?.includes('coach') ? 'Tréner' : 'Hráč'}
          </Text>
          {renderPhysicalStats()}
        </>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 10 }}>
              Zadaj novú hodnotu pre {editingStatKey}
            </Text>
            <TextInput
              style={styles.input}
              value={editingStatValue}
              onChangeText={setEditingStatValue}
              keyboardType="numeric"
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Zrušiť" onPress={() => setModalVisible(false)} />
              <Button title="Uložiť" onPress={saveStatValue} />
            </View>
          </View>
        </View>
      </Modal>
      {isCoach && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#d9534f', marginTop: 30 }]}
          onPress={handleRemoveFromTeam}
        >
          <Text style={styles.saveButtonText}>Odstrániť hráča z tímu</Text>
        </TouchableOpacity>
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
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
