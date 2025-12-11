import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoHome = () => {
    router.push('..');
  };

  const handleOpenChat = () => {
    router.push('../chat/chat-list');
  };

  const showBackArrow = pathname !== '..)';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () =>
          showBackArrow ? (
            <Button onPress={handleGoHome} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back-outline" size={26} color="#007AFF" />
            </Button>
          ) : null,
        headerRight: () => (
          <Button onPress={handleOpenChat} style={{ marginRight: 16 }}>
            <Ionicons name="chatbubbles-outline" size={26} color="#007AFF" />
          </Button>
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
        name="calendar"
        options={{
          title: 'Kalendár',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: 'Tím',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
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
