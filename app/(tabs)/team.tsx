import { PlayersTable } from "@/components/team/playersTable";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTeamManagementAccess } from "../../hooks/useTeamManagementAccess";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { styles } from "../../styles/team.styles";

export default function TeamManagement() {
  const router = useRouter();
  const { isLoading, isCoach, teamId, errorText } = useTeamManagementAccess();

  const {
    members,
    loading: loading,
    error: error,
  } = useTeamMembers(teamId);

  const handleAddPlayer = () => {
    router.push({
      pathname: "/create-join-team/generate-code",
      params: { teamId },
    });
  };
  const handlePressPlayer = (playerId: string) => {
    router.push({
      pathname: "../team/player-profile",
      params: { playerId, teamId },
    });
  };

  if (isLoading || (teamId && loading)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorText) {
    return (
      <View style={styles.center}>
        <Text>{errorText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Chyba načítania členov tímu: {error}</Text>
      </View>
    );
  }

  if (!teamId) {
    return (
      <View style={styles.center}>
        <Text>Zle teamId.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Správa tímu</Text>

      {isCoach && (
        <Button style={styles.addButton} onPress={handleAddPlayer}>
          <Text style={styles.addButtonText}>Pridať hráča</Text>
        </Button>
      )}
      <PlayersTable members={members} onPressPlayer={handlePressPlayer} />
    </View>
  );
}
