import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebase'; // uprav podľa cesty
import { doc, updateDoc } from 'firebase/firestore';

export default function ChooseRole() {
  const router = useRouter();
  const [isPlayer, setIsPlayer] = useState(false);
  const [isCoach, setIsCoach] = useState(false);

  const handleSaveRoles = async () => {
    if (!isPlayer && !isCoach) {
      Alert.alert('Chyba', 'Vyber aspoň jednu rolu');
      return;
    }

    const roles = [];
    if (isPlayer) roles.push('player');
    if (isCoach) roles.push('coach');

    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        roles: roles,
      });

      Alert.alert('Úspech', 'Role boli nastavené');
      router.replace('/(tabs)'); // napr. hlavná aplikácia
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vyber svoje role</Text>

      <TouchableOpacity
        style={[styles.checkboxContainer, isPlayer && styles.checked]}
        onPress={() => setIsPlayer(!isPlayer)}
      >
        <Text style={[styles.checkboxLabel, isPlayer && styles.checkedLabel]}>Hráč</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkboxContainer, isCoach && styles.checked]}
        onPress={() => setIsCoach(!isCoach)}
      >
        <Text style={[styles.checkboxLabel, isCoach && styles.checkedLabel]}>Tréner</Text>
      </TouchableOpacity>

      <Button title="Uložiť" onPress={handleSaveRoles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 18,
    color: '#007AFF',
  },
  checkedLabel: {
    color: 'white',
    fontWeight: '600',
  },
});
