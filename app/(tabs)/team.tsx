import { PlayersTable } from "@/components/team/playersTable";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTeamManagementAccess } from "../../hooks/useTeamManagementAccess";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { styles } from "../../styles/team.styles";

export default function TeamManagement() {
  const router = useRouter();
  const { isLoading, isCoach, teamId, errorText } = useTeamManagementAccess();

  const {
    members,
    loading,
    error,
  } = useTeamMembers(teamId);

  const handleAddPlayer = () => {
    router.push({
      pathname: "/team/generate-code",
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
        <Text style={{ marginTop: 12, color: "#6B7280" }}>
          Načítavam správu tímu...
        </Text>
      </View>
    );
  }

  if (errorText) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#B00020", textAlign: "center" }}>
          {errorText}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#B00020", textAlign: "center" }}>
          Chyba načítania členov tímu: {error}
        </Text>
      </View>
    );
  }

  if (!teamId) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center" }}>Nepodarilo sa načítať tím.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={localStyles.header}>
        <Text style={styles.title}>Správa tímu</Text>
        <Text style={localStyles.subtitle}>
          Prehľad členov tímu a ich správa na jednom mieste.
        </Text>
      </View>

      {isCoach && (
        <Card style={localStyles.infoCard} mode="elevated">
          <View style={localStyles.infoCardContent}>
            <View style={localStyles.infoLeft}>
              <View style={localStyles.iconWrap}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={localStyles.infoTitle}>Pozvi nového hráča</Text>
                <Text style={localStyles.infoText}>
                  Vygeneruj kód a pridaj ďalších členov do tímu.
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleAddPlayer}
              style={localStyles.addButton}
              contentStyle={{ paddingVertical: 4 }}
              icon="plus"
            >
              Pridať hráča
            </Button>
          </View>
        </Card>
      )}

      <View style={localStyles.listHeader}>
        <Text style={localStyles.listTitle}>Členovia tímu</Text>
        <Text style={localStyles.memberCount}>{members.length}</Text>
      </View>

      <PlayersTable members={members} onPressPlayer={handlePressPlayer} />
    </View>
  );
}

const localStyles = {
  header: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  infoCardContent: {
    padding: 16,
    gap: 14,
  },
  infoLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
  addButton: {
    borderRadius: 14,
    alignSelf: "flex-start" as const,
  },
  listHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
  },
  memberCount: {
    minWidth: 30,
    textAlign: "center" as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    fontWeight: "700" as const,
  },
};