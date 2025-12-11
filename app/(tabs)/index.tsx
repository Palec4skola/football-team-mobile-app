import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamLevel, setTeamLevel] = useState<string | null>(null); // 'professional' | 'amateur'

  
useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setTeamId(null); // ak nie je prihlásený, clear teamId
      }
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    async function fetchTeamIdAndLevel() {
      if (!userId) return;
      try {
        const id = await getTeamIdForUser(userId);
        setTeamId(id);
        if (id) {
          // Získaj level tímu z Firestore
          const teamDocRef = doc(db, 'teams', id);
          const teamDocSnap = await getDoc(teamDocRef);
          if (teamDocSnap.exists()) {
            const teamData = teamDocSnap.data();
            // Oprava: zabezpečiť, že level je string
            let level = teamData.level;
            if (typeof level !== 'string' || !level) {
              level = 'amateur';
            }
            setTeamLevel(level);
          } else {
            setTeamLevel('amateur');
          }
        } else {
          setTeamLevel(null);
        }
      } catch (error) {
        console.error('Chyba načítania teamId/level:', error);
        setTeamId(null);
        setTeamLevel(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamIdAndLevel();
  }, [userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => router.push('/chat/chat-list')} style={{ marginRight: 12 }}>
          <Ionicons name="chatbubbles-outline" size={28} color="#007AFF" />
        </Button>
      ),
    });
  }, [navigation, router]);
  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }
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

  
  
  async function getTeamIdForUser(userId: string): Promise<string | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      return data.teamId || null;
    }
    return null;
  }

  // Ak je tím profesionálny, zobraz špeciálne menu
  if (teamLevel === 'professional') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profesionálny tím</Text>
        <Text style={{marginBottom: 16}}>Vitajte v profesionálnom režime!</Text>
        <Button style={styles.section} onPress={() => router.push({
        pathname:'/team/training-list',
        params: { teamId: teamId}
      })}>
          <Text style={styles.sectionTitle}>Tréningy</Text>
        </Button>
        <Button style={styles.section} onPress={() => router.push({
        pathname: '/team/match-list',
        params: { teamId: teamId}
        })}>
          <Text style={styles.sectionTitle}>Zápasy</Text>
        </Button>
        <Button style={styles.section} onPress={() => router.push({
          pathname: '/team/announcement',
        })}>
          <Text style={styles.sectionTitle}>Oznámenia</Text>
        </Button>
        <Button style={styles.section} onPress={() => router.push({
          pathname: '/team/wellness',
          params: { teamId: teamId }
        })}>
          <Text style={styles.sectionTitle}>Wellness</Text>
        </Button>
        {/* Pridaj ďalšie tlačidlá podľa potreby */}
      </ScrollView>
    );
  }
  // Amatérsky tím - pôvodné GUI
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Domov</Text>
      <Button 
      style={styles.section}
      onPress={() => router.push({
        pathname:'/team/training-list',
        params: { teamId: teamId}
      })}>
        <Text style={styles.sectionTitle}>Tréningy</Text>
        <Text>{nextActivity.type} - {nextActivity.date} o {nextActivity.time}</Text>
        <Text>Miesto: {nextActivity.place}</Text>
      </Button>
      <Button 
      style={styles.section} 
      onPress={()=>router.push({
        pathname: '/team/match-list',
        params: { teamId: teamId}
        })}>
          
        <Text style={styles.sectionTitle}>Posledný výsledok</Text>
        <Text>Zápas proti: {lastResult.opponent}</Text>
        <Text>Dátum: {lastResult.date}</Text>
        <Text>Výsledok: {lastResult.score} ({lastResult.result})</Text>
      </Button  >
      <Button style={styles.section} onPress={()=>router.push({
          pathname: '/team/announcement',
        })}>
        <Text 
        style={styles.sectionTitle}>Tímové oznámenia</Text>
        {announcements.map((msg, idx) => (
          <Text key={idx}>• {msg}</Text>
        ))}
      </Button>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
