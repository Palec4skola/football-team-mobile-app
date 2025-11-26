import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp , updateDoc, doc } from 'firebase/firestore';

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
      const teamsRef = collection(db, 'teams');
      const docRef = await addDoc(teamsRef, {
        name: teamName,
        country: country,
        createdBy: auth.currentUser?.uid,
        createdAt: new Date(),
      });

      // Aktualizácia používateľa s teamId
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, {
        teamId: docRef.id,
      });

      Alert.alert('Úspech', `Tím '${teamName}' bol vytvorený`);
      router.replace('../registration/choose-team-role'); 
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
