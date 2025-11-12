import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from './firebase'; // uprav podľa cesty tvojho projektu
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [country, setCountry] = useState('');

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !country.trim()) {
      Alert.alert('Chyba', 'Vyplň všetky polia');
      return;
    }
    try {
      // Uloženie nového tímu do Firestore
      const docRef = await addDoc(collection(db, 'teams'), {
        name: teamName,
        country: country,
        createdBy: auth.currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Úspech', `Tím '${teamName}' bol vytvorený`);
      router.replace('/choose-team-role'); // alebo iná stránka podľa logiky
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vytvoriť nový tím</Text>

      <Text>Názov tímu</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj názov tímu"
        value={teamName}
        onChangeText={setTeamName}
      />

      <Text>Krajina</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj krajinu"
        value={country}
        onChangeText={setCountry}
      />

      <Button title="Vytvoriť tím" onPress={handleCreateTeam} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});
