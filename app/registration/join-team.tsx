import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // uprav podľa cesty
import { useRouter } from 'expo-router';

export default function JoinTeam() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode.length !== 4) {
      Alert.alert('Chyba', 'Kód musí mať presne 4 znaky');
      return;
    }

    setIsLoading(true);
    try {
      // Predpokladáme, že kód tímu je uložený v poli "code" v dokumente tímu
      const teamsRef = collection(db, 'teams');
      const q = query(teamsRef, where('code', '==', trimmedCode));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Chyba', 'Tím s týmto kódom neexistuje');
      } else {
        // Prvý nájdený tím
        const teamDoc = snapshot.docs[0];
        const teamId = teamDoc.id;

        // Aktualizuj používateľa, aby mal nastavený tento teamId aj rolu 'player'
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        await updateDoc(userRef, {
          teamId: teamId,
          roles: ['player'],
        });

        Alert.alert('Úspech', 'Úspešne si sa pridal do tímu');
        router.replace('/(tabs)/team'); 
      }
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pridaj sa do tímu</Text>

      <TextInput
        style={styles.input}
        placeholder="Zadaj 4-miestny kód tímu"
        maxLength={4}
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleJoin}>
          <Text style={styles.buttonText}>Pripojiť sa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    letterSpacing: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});
