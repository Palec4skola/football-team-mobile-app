import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Funkcia na generovanie 4-miestneho kódu (čísla a písmena)
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function GenerateCode() {
  const router = useRouter();
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode(generateCode());
  }, []);

  const handleDone = () => {
    Alert.alert(
      'Upozornenie',
      `Pošli tento kód hráčovi, aby sa mohol pridať do tímu: ${code}`
    );
    router.replace('../(tabs)/team'); // alebo iná obrazovka podľa potreby
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pridanie hráča pomocou kódu</Text>
      <Text style={styles.code}>{code}</Text>
      <Button title="Hotovo" onPress={handleDone} />
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
