import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

// Ukážkové dáta hráčov a wellness indexu
const players = [
  { id: '1', name: 'Ján Novák', wellness: 8 },
  { id: '2', name: 'Peter Horváth', wellness: 6 },
  { id: '3', name: 'Marek Kováč', wellness: 9 },
  { id: '4', name: 'Tomáš Urban', wellness: 5 },
  { id: '5', name: 'Martin Šimek', wellness: 7 },
];

export default function WellnessScreen() {
  const router = useRouter();
  // Funkcia na zobrazenie farby podľa wellness indexu
  const getWellnessColor = (value: number) => {
    if (value >= 8) return '#4CAF50'; // zelená
    if (value >= 6) return '#FFC107'; // žltá
    return '#F44336'; // červená
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Wellness hráčov</Text>
      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <Text style={styles.playerName}>{item.name}</Text>
            <View style={[styles.wellnessBox, { backgroundColor: getWellnessColor(item.wellness) }]}> 
              <Text style={styles.wellnessText}>{item.wellness}/10</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.button} onPress={()=> router.push('./wellnessFormScreen')}>
        <Text style={styles.buttonText}>Zadať nové wellness hodnoty</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 0,
    elevation: 1,
  },
  playerName: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  wellnessBox: {
    minWidth: 60,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
