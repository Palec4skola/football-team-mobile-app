import { PlayersTable } from "@/components/team/playersTable";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View, ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTeamManagementAccess } from "../../hooks/useTeamManagementAccess";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { useTeamStats } from "@/hooks/useTeamStats";
import { useActiveTeam } from "@/hooks/useActiveTeam";
import { TeamStatsCard } from "@/components/team/teamStatsCard";
import { styles } from "@/styles/team.styles";

export default function TeamManagement() {
  const router = useRouter();
  const { isLoading, isCoach, teamId, errorText } = useTeamManagementAccess();
  const { members, loading, error } = useTeamMembers(teamId);
  const { teamLevel } = useActiveTeam();
  const isProfessional = teamLevel === "professional";
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useTeamStats(teamId);

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      
      {isCoach && (
        <Card style={styles.infoCard} mode="elevated">
          <View style={styles.infoCardContent}>
            <View style={styles.infoLeft}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Pozvi nového hráča</Text>
                <Text style={styles.infoText}>
                  Vygeneruj kód a pridaj ďalších členov do tímu.
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleAddPlayer}
              style={styles.addButton}
              contentStyle={{ paddingVertical: 4 }}
              icon="plus"
            >
              Pridať hráča
            </Button>
          </View>
        </Card>
      )}
      {isProfessional && (
        <View style={styles.statsSection}>
          

          {statsLoading ? (
            <Card style={styles.statsCard} mode="elevated">
              <View style={styles.statsLoadingWrap}>
                <ActivityIndicator size="small" />
                <Text style={styles.statsLoadingText}>
                  Načítavam štatistiky tímu...
                </Text>
              </View>
            </Card>
          ) : statsError ? (
            <Card style={styles.statsCard} mode="elevated">
              <View style={styles.statsErrorWrap}>
                <Text style={styles.statsErrorText}>{statsError}</Text>
              </View>
            </Card>
          ) : (
            <View style={styles.statsCardWrap}>
              <TeamStatsCard stats={stats} />
            </View>
          )}
        </View>
      )}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Členovia tímu</Text>
          <Text style={styles.memberCount}>{members.length}</Text>
        </View>

        <PlayersTable members={members} onPressPlayer={handlePressPlayer} />
      </View>
    </ScrollView>
  );
}
