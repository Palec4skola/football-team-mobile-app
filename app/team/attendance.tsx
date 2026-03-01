import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlayersTable } from "@/components/team/playersTable";
import { useLastMonthTrainingAttendance } from "@/hooks/useLastMonthTrainingAttendance";
import { AttendanceHeader } from "@/components/attendance/attendanceHeader";
import { AttendanceBadge } from "@/components/attendance/attendanceBadge";
import { useTeamMembers } from "@/hooks/useTeamMembers";

export default function AttendanceScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const { loading, error, totalTrainings, presentCountByUser } =
    useLastMonthTrainingAttendance(teamId);

  const { members } = useTeamMembers(teamId);

  const onPressPlayer = (playerId: string) => {
    router.push({
      pathname: "/team/attendance-player",
      params: { teamId, playerId },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Načítavam dochádzku…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Chyba</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AttendanceHeader totalTrainings={totalTrainings} />

      <PlayersTable
        members={members}
        onPressPlayer={onPressPlayer}
        renderRight={(player) => (
          <AttendanceBadge
            present={presentCountByUser[player.id] ?? 0}
            total={totalTrainings}
            onPress={() => onPressPlayer(player.id)}
          />
        )}
      />
    </View>
  );
}
