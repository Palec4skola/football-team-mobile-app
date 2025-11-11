import React from 'react';
import { Tabs, useRouter, useNavigation, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();

  const handleGoHome = () => {
    router.push('/(tabs)');
  };

  const handleOpenChat = () => {
    router.push('../chat/chat-list');
  };

  const showBackArrow = pathname !== '/(tabs)';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () =>
          showBackArrow ? (
            <TouchableOpacity onPress={handleGoHome} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back-outline" size={26} color="#007AFF" />
            </TouchableOpacity>
          ) : null,
        headerRight: () => (
          <TouchableOpacity onPress={handleOpenChat} style={{ marginRight: 16 }}>
            <Ionicons name="chatbubbles-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Domov',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Zápasy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trainings"
        options={{
          title: 'Tréningy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
