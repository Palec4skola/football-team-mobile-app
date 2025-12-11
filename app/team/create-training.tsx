import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';
import { useSearchParams} from 'expo-router/build/hooks';

export default function CreateTraining() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const teamId = params.get('teamId');

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddTraining = async () => {
    if (!name.trim()) {
      Alert.alert('Chyba', 'Zadaj názov tréningu');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'trainings'), {
        teamId: teamId,  // ID tímu ako cudzie kľúčové pole
        name: name.trim(),
        description: description.trim(),
        date: date,
        createdAt: serverTimestamp(),
});
      
      Alert.alert('Úspech', 'Tréning bol pridaný');
      setName('');
      setDescription('');
      setDate(new Date());
    } catch (error: any) {
      Alert.alert('Chyba', error.message);
    } finally {
      setLoading(false);
    }
    router.push({
        pathname:'/team/training-list',
        params: {teamId: teamId}
      })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Názov tréningu</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Zadaj názov"
      />

      <Text style={styles.label}>Dátum tréningu</Text>
      <Button onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text>{date.toLocaleDateString()}</Text>
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Popis tréningu</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Popíš, čo sa bude robiť na tréningu"
        multiline
        numberOfLines={4}
      />

      <Button onPress={handleAddTraining} disabled={loading}>
        <Text>{loading ? 'Pridávam...' : 'Pridať tréning'}</Text>
      </Button>
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
  },
});
