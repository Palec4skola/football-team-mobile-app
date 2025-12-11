import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {Button , Text} from 'react-native-paper';

export default function ChooseTeamAction() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Čo chceš urobiť?</Text>
      
      <Button
        style={styles.button}
        onPress={() => router.push('./join-team')}
      >
        <Text style={styles.buttonText}>Pridať sa do tímu</Text>
      </Button>

      <Button
        style={styles.button}
        onPress={() => router.push('../create-join-team/create-team')}
      >
        <Text style={styles.buttonText}>Vytvoriť nový tím</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
