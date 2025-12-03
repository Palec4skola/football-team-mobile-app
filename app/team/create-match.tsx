import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

export default function CreateMatch() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get('teamId');

  const [opponent, setOpponent] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddMatch = async () => {
    if (!opponent.trim()) {
      Alert.alert('Chyba', 'Zadaj názov súpera');
      return;
    }
    if (!place.trim()) {
      Alert.alert('Chyba', 'Zadaj miesto zápasu');
      return;
    }
    if (!teamId) {
      Alert.alert('Chyba', 'Chýba ID tímu');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'matches'), {
        teamId: teamId,
        opponent: opponent.trim(),
        place: place.trim(),
        date: date,
        result: null,           // môžeš neskôr doplniť po odohraní
        createdAt: serverTimestamp(),
      });

      Alert.alert('Úspech', 'Zápas bol pridaný');
      setOpponent('');
      setPlace('');
      setDate(new Date());

      router.push({
        pathname: '/team/match-list',
        params: { teamId },
      });
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    } finally {
      setLoading(false);
        router.push({
            pathname:'/team/match-list',
            params: {teamId: teamId}
        })
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Súper</Text>
      <TextInput
        style={styles.input}
        value={opponent}
        onChangeText={setOpponent}
        placeholder="Zadaj názov súpera"
      />

      <Text style={styles.label}>Dátum zápasu</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Miesto zápasu</Text>
      <TextInput
        style={styles.input}
        value={place}
        onChangeText={setPlace}
        placeholder="Zadaj miesto (ihrisko, hala...)"
      />

      <Button
        title={loading ? 'Ukladám...' : 'Pridať zápas'}
        onPress={handleAddMatch}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginVertical: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    marginBottom: 8,
  },
});
