import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from './firebase'; // uprav podľa cesty
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Chyba', 'Vyplň email aj heslo');
      return;
    }

    try {
      // 1️⃣ Prihlásenie pomocou Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Načítanie používateľských dát (napr. role) z Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        Alert.alert('Chyba', 'Používateľské údaje nenájdené');
        return;
      }

      const userData = userDoc.data();
      const role = userData?.role || 'player';

      Alert.alert('Úspech', `Prihlásenie úspešné.`);
      
      // 3️⃣ Presmerovanie do hlavnej sekcie aplikácie
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Prihlásenie
      </Text>

      <Text>Email</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
        placeholder="napr. test@tim.sk"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Heslo</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
        placeholder="Zadaj heslo"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Prihlásiť sa" onPress={handleLogin} />

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text>Nemáš účet?</Text>
        <Text style={{ color: 'blue', marginTop: 8 }} onPress={() => router.push('../registration/register')}>
          Zaregistruj sa
        </Text>
      </View>
    </View>
  );
}
