import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  // Mock data - replace with real data fetching later
  const nextActivity = {
    type: 'Tréning',
    date: '2025-11-07',
    time: '18:00',
    place: 'Športová hala',
  };
  const lastResult = {
    opponent: 'FC Príklad',
    date: '2025-10-30',
    score: '3:2',
    result: 'Výhra',
  };
  const announcements = [
    'Pripomíname platbu členského do 10.11.',
    'V sobotu spoločný obed po zápase.',
    'Tréningy budú od budúceho týždňa v novej hale.',
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/chat-list')} style={{ marginRight: 12 }}>
          <Ionicons name="chatbubbles-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Domov</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Najbližšia aktivita</Text>
        <Text>{nextActivity.type} - {nextActivity.date} o {nextActivity.time}</Text>
        <Text>Miesto: {nextActivity.place}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posledný výsledok</Text>
        <Text>Zápas proti: {lastResult.opponent}</Text>
        <Text>Dátum: {lastResult.date}</Text>
        <Text>Výsledok: {lastResult.score} ({lastResult.result})</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tímové oznámenia</Text>
        {announcements.map((msg, idx) => (
          <Text key={idx}>• {msg}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});
