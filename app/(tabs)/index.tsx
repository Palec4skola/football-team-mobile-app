import React, { useLayoutEffect } from "react";
import { ActivityIndicator, ScrollView, View, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { useActiveTeam } from "@/hooks/useActiveTeam";
import HomeAmateur from "@/components/home/HomeAmateur";
import HomeProfessional from "@/components/home/HomeProfessional";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { loading, teamId, teamLevel } = useActiveTeam();
  // header button (chat)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => router.push("/chat/chat-list")}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="chatbubbles-outline" size={28} color="#007AFF" />
        </Button>
      ),
    });
  }, [navigation, router]);

  // Guard 1: loading
  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <ActivityIndicator size="large" />
      </ScrollView>
    );
  }

  // Guard 2: user nemá aktívny tím
  if (!teamId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Domov</Text>
        <Text style={{ marginBottom: 16 }}>Nemáš vybraný tím.</Text>

        <Button
          onPress={() => router.push("/registration/join-team")}
          style={{ marginBottom: 12 }}
        >
          <Text>Pridať sa do tímu</Text>
        </Button>

        <Button onPress={() => router.push("/create-join-team/create-team")}>
          <Text>Vytvoriť tím</Text>
        </Button>
      </View>
    );
  }

  // Navigačné callbacky (už vieme, že teamId existuje)
  const onGoTrainings = () =>
    router.push({ pathname: "/team/training-list", params: { teamId } });
  const onGoMatches = () =>
    router.push({ pathname: "/team/match-list", params: { teamId } });
  const onGoAnnouncements = () =>
    router.push({ pathname: "/team/announcement", params: { teamId } });
  const onGoWellness = () =>
    router.push({ pathname: "/team/wellness", params: { teamId } });

  // Professional vs Amateur
  if (teamLevel === "professional") {
    return (
      <HomeProfessional
        onGoTrainings={onGoTrainings}
        onGoMatches={onGoMatches}
        onGoAnnouncements={onGoAnnouncements}
        onGoWellness={onGoWellness}
      />
    );
  }

  return (
    <HomeAmateur
      onGoTrainings={onGoTrainings}
      onGoMatches={onGoMatches}
      onGoAnnouncements={onGoAnnouncements}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
