import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Text, Button} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChatListScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chaty</Text>
      <Button style={styles.chatItem} onPress={() => router.push('/chat/chat')}>
        <Ionicons name="person-circle-outline" size={28} color="#333" />
        <Text style={styles.chatText}>Osobný chat s hráčom</Text>
      </Button>
      <Button style={styles.chatItem} onPress={() => router.push('/chat/chat')}>
        <Ionicons name="people-circle-outline" size={28} color="#333" />
        <Text style={styles.chatText}>Tímový chat</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatText: {
    fontSize: 18,
    marginLeft: 16,
  },
});
