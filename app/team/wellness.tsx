import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { PlayersTable } from "@/components/team/playersTable";
import { WellnessBadge } from "@/components/wellnessBadge";

import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamWellnessForDay } from "@/hooks/useTeamWellnessForDay";
import { localDateKey } from "@/utils/dateUtils";

import { styles } from "@/styles/wellnessTeamScreen";

export default function WellnessTeamScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const dateKey = useMemo(() => localDateKey(), []);

  const { members, loading: loadingMembers, error: membersError } = useTeamMembers(teamId);
  const { loading, error, scoreByUser } = useTeamWellnessForDay(teamId, dateKey);

  const goToForm = () => {
    router.push({
      pathname: "/team/wellnessFormScreen",
      params: { teamId },
    });
  };

  const goToPlayerDetail = (playerId: string) => {
    router.push({
      pathname: "/team/wellness-player",
      params: { teamId, playerId },
    });
  };

  if (loading || loadingMembers) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Načítavam wellness…</Text>
      </View>
    );
  }

  const anyError = error || membersError;
  if (anyError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Chyba</Text>
        <Text style={styles.errorText}>{anyError}</Text>

        <View style={styles.footer}>
          <Pressable style={styles.button} onPress={goToForm}>
            <Text style={styles.buttonText}>Zadať nové wellness hodnoty</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wellness hráčov</Text>
        <Text style={styles.subtitle}>Dnes ({dateKey})</Text>
      </View>

      <PlayersTable
        members={members}
        onPressPlayer={goToPlayerDetail}
        renderRight={(player) => <WellnessBadge score={scoreByUser[player.id] ?? null} />}
      />

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={goToForm}>
          <Text style={styles.buttonText}>Zadať nové wellness hodnoty</Text>
        </Pressable>
      </View>
    </View>
  );
}