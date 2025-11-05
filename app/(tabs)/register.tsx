import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Chyba', 'Vyplň všetky polia');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Chyba', 'Heslá sa nezhodujú');
      return;
    }
    // Tu by bola logika registrácie
    Alert.alert('Úspech', 'Registrácia prebehla úspešne!');
    router.replace('/(tabs)/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Registrácia
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
          marginBottom: 15,
        }}
        placeholder="Zadaj heslo"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text>Potvrď heslo</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
        placeholder="Zadaj heslo znova"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Registrovať sa" onPress={handleRegister} />
    </View>
  );
}
