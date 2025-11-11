import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string | null>(null); // 👈 pridáme stav pre rolu

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !role) {
      Alert.alert('Chyba', 'Vyplň všetky polia a vyber rolu');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Chyba', 'Heslá sa nezhodujú');
      return;
    }

    // Tu bude logika registrácie (API call, uloženie používateľa...)
    Alert.alert('Úspech', `Registrácia prebehla úspešne ako ${role === 'coach' ? 'Tréner' : 'Hráč'}!`);
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Registrácia
      </Text>

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

      <Text>Rola</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'player' && styles.roleButtonSelected,
          ]}
          onPress={() => setRole('player')}
        >
          <Text style={[styles.roleText, role === 'player' && styles.roleTextSelected]}>Hráč</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'coach' && styles.roleButtonSelected,
          ]}
          onPress={() => setRole('coach')}
        >
          <Text style={[styles.roleText, role === 'coach' && styles.roleTextSelected]}>Tréner</Text>
        </TouchableOpacity>
      </View>

      <Button title="Registrovať sa" onPress={handleRegister} />
    </View>
  );
}

const styles = {
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
};
