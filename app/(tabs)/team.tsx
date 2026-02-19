import { TeamPlayerRow } from "@/components/team/teamPlayerRow";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { auth } from "../../firebase";
import { useTeamManagementAccess } from "../../hooks/useTeamManagementAccess";
import { useTeamPlayers } from "../../hooks/useTeamPlayers";
import { styles } from "../../styles/team.styles";

export default function TeamManagement() {
  const router = useRouter();

  const { isLoading, isCoach, teamId, errorText } = useTeamManagementAccess();
  console.log("TeamManagement - team ID:", teamId);

  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useTeamPlayers(teamId);
  console.log("TeamManagement - players:", players);

  const handleAddPlayer = () => {
    router.push({
      pathname: "/create-join-team/generate-code",
      params: { teamId },
    });
  };

  if (isLoading || (teamId && playersLoading)) {
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

  if (playersError) {
    return (
      <View style={styles.center}>
        <Text>Chyba načítania členov tímu: {playersError}</Text>
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

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeamPlayerRow
            player={item}
            isMe={item.id === auth.currentUser?.uid}
            onPress={() =>
              router.push({
                pathname: "../team/player-profile",
                params: { playerId: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={<Text>Žiadni členovia tímu</Text>}
      />
    </View>
  );
}
