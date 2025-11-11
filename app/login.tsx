import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // jednoduchá simulácia "loginu"
    if (email === 'test@tim.sk' && password === '1234') {
      Alert.alert('✅ Prihlásenie úspešné', `Vitaj späť, ${email}`);
      router.replace('/(tabs)');
    } else {
      Alert.alert('❌ Chyba', 'Nesprávny email alebo heslo');
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
        <Text style={{ color: 'blue', marginTop: 8 }} onPress={() => router.push('/register')}>
          Zaregistruj sa
        </Text>
      </View>
    </View>
  );
}
