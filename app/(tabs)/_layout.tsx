import { Tabs, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Menu, Text } from "react-native-paper";
import React, { useMemo, useState, useCallback } from "react";
import { auth } from "@/firebase";
import { useMyTeams } from "@/hooks/useMyTeams";
import { userRepo } from "@/data/firebase/UserRepo";
import { useActiveTeam } from "@/hooks/useActiveTeam";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const openMenu = useCallback(() => setTeamMenuOpen(true), []);
  const closeMenu = useCallback(() => setTeamMenuOpen(false), []);

  const { teamId } = useActiveTeam();

  const uid = auth.currentUser?.uid ?? null;
  const { teams } = useMyTeams(uid);
  const activeTeamId = teamId;

  const activeTeamName = useMemo(() => {
    if (!activeTeamId) return "Vybrať tím";
    return teams?.find((t) => t.teamId === activeTeamId)?.teamName ?? "Vybrať tím";
  }, [teams, activeTeamId]);

  const switchTeam = useCallback(
    async (newTeamId: string) => {
      if (!uid) {
        closeMenu();
        return;
      }

      // ✅ zavri menu hneď, nečakaj na await
      closeMenu();

      // ak klikol na ten istý tím, nerob nič
      if (newTeamId === activeTeamId) return;

      await userRepo.setActiveTeamId(uid, newTeamId);

    },
    [uid, activeTeamId, closeMenu],
  );

  const handleOpenChat = () => router.push("../chat/chat-list");

  const canGoBack = router.canGoBack();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Menu
            visible={teamMenuOpen}
            onDismiss={closeMenu}
            anchor={
              <Button onPress={openMenu}>
                <Text>{activeTeamName}</Text>
                <Ionicons name="chevron-down" size={18} color="#007AFF" />
              </Button>
            }
          >
            {(teams ?? []).map((t) => (
              <Menu.Item
                key={t.teamId}
                title={t.teamName}
                onPress={() => switchTeam(t.teamId)}
              />
            ))}
          </Menu>
        ),
        headerLeft: () =>
          canGoBack ? (
    <Button
      onPress={() => router.back()}
      style={{ marginLeft: 8 }}
      compact
    >
      <Ionicons name="arrow-back-outline" size={24} color="#007AFF" />
    </Button>
  ) : null,
        headerRight: () => (
          <Button onPress={handleOpenChat} style={{ marginRight: 16 }}>
            <Ionicons name="chatbubbles-outline" size={26} color="#007AFF" />
          </Button>
        ),
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60, paddingBottom: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Domov",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Kalendár",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Tím",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}