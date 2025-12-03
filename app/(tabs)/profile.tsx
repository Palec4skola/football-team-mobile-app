import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth } from '../../firebase'; // uprav cestu podľa projektu
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Úspech', 'Boli ste odhlásený');
      router.replace('/login'); // presmerovanie na login obrazovku
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profil</Text>
      <Button title="Odhlásiť sa" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
});
