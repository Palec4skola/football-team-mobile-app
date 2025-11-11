import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChatListScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chaty</Text>
      <TouchableOpacity style={styles.chatItem} onPress={() => router.push('/chat/chat')}>
        <Ionicons name="person-circle-outline" size={28} color="#333" />
        <Text style={styles.chatText}>Osobný chat s hráčom</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatItem} onPress={() => router.push('/chat/chat')}>
        <Ionicons name="people-circle-outline" size={28} color="#333" />
        <Text style={styles.chatText}>Tímový chat</Text>
      </TouchableOpacity>
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
