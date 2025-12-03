import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// Uprav cestu podľa tvojho projektu, napr. '@/firebase' alebo './firebase'
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Chyba', 'Vyplň všetky polia');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Chyba', 'Heslá sa nezhodujú');
      return;
    }

    try {
      // 1️⃣ Vytvorenie používateľa v Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Uloženie údajov do Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert('Úspech', `Registrácia prebehla úspešne!`);
      router.replace('/registration/choose-join-or-create');
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Registrácia
      </Text>
      <Text>Meno</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text>Priezvisko</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="napr. test@tim.sk"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Heslo</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj heslo"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text>Potvrď heslo</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj heslo znova"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Registrovať sa" onPress={handleRegister} />
    </View>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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
});
