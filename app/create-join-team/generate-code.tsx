import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';  // uprav podľa cesty
import { useSearchParams } from 'expo-router/build/hooks';

// Funkcia na generovanie unikátneho 4-miestneho kódu (A-Z, 0-9)
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Predpoklad: receive teamId ako prop alebo načítaj inak
export default function GenerateCode() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get('teamId');
  const [code, setCode] = useState('');
  

  useEffect(() => {
    if (!teamId) {
      Alert.alert('Chyba', 'Nebol zadaný identifikátor tímu');
      return;
    }

    const newCode = generateCode();
    setCode(newCode);

    const updateTeamCode = async () => {
      try {
        const teamRef = doc(db, 'teams', teamId);
        await updateDoc(teamRef, { code: newCode });
      } catch (error: any) {
        Alert.alert('Chyba', error.message);
      }
    };

    updateTeamCode();
  }, [teamId]);

  const handleSaveCode = () => {
    Alert.alert('Kód uložený', `Pošli tento kód hráčovi: ${code}`);
    router.replace('/(tabs)/team');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vygeneruj pozývací kód tímu</Text>
      <Text style={styles.code}>{code}</Text>
      <Button title="Uložiť a hotovo" onPress={handleSaveCode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 12,
    marginBottom: 40,
    color: '#007AFF',
  },
});
