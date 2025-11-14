import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams } from 'expo-router/build/hooks';

export default function PlayerProfile() {
  const  params  = useSearchParams();
  const playerId = params.get('playerId');
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      if (!playerId) {
        Alert.alert('Chyba', 'Nezadali ste ID hráča');
        return;
      }
      try {
        const docRef = doc(db, 'users', playerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlayer(docSnap.data());
        } else {
          Alert.alert('Chyba', 'Hráč nebol nájdený');
        }
      } catch (error: any) {
        Alert.alert('Chyba', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.center}>
        <Text>Žiadne údaje o hráčovi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil hráča</Text>
      <Text>Meno: {player.firstName || '---'}</Text>
      <Text>Priezvisko: {player.lastName || '---'}</Text>
      <Text>Email: {player.email}</Text>
      <Text>Rola: {player.roles?.includes('coach') ? 'Tréner' : 'Hráč'}</Text>
      {/* Doplníš ďalšie polia podľa potreby */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
});
