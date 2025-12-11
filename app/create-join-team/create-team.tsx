import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../../firebase';
import { collection, addDoc , updateDoc, doc } from 'firebase/firestore';
import {Button, Text} from 'react-native-paper';

export default function CreateTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [country, setCountry] = useState('');
  const [level, setLevel] = useState<'amateur' | 'professional' | null>(null);


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
        level: level,
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
      <Text>Vyberte úroveň tímu</Text>
      <Button
  style={[
    styles.checkboxContainer,
    level !== 'amateur' && styles.unchecked, // ak NIE je vybraný amatér, bude biely
  ]}
  onPress={() => setLevel('amateur')}
>
  <Text
    style={[
      styles.checkboxLabel,
      level !== 'amateur' && styles.uncheckedLabel, // farba textu podľa stavu
    ]}
  >
    Amatérsky
  </Text>
</Button>

<Button
  style={[
    styles.checkboxContainer,
    level !== 'professional' && styles.unchecked,
  ]}
  onPress={() => setLevel('professional')}
>
  <Text
    style={[
      styles.checkboxLabel,
      level !== 'professional' && styles.uncheckedLabel,
    ]}
  >
    Profesionálny
  </Text>
</Button>

      <Button onPress={handleCreateTeam}>
        <Text>Vytvoriť tím</Text>
      </Button>
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
  checkboxContainer: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#007AFF', // základne modré
  },
  unchecked: {
    backgroundColor: 'white',
  },
  checkboxLabel: {
    fontSize: 18,
    color: 'white',
  },
  uncheckedLabel: {
    color: '#007AFF',
  },
});
