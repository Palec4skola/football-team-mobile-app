// app/team/match-detail.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { auth } from "@/firebase";

import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { useTeamMembers } from "@/hooks/useTeamMembers";

import { useMatch } from "@/hooks/match/useMatch";
import { useAttendance } from "@/hooks/useAttendance";
import { attendanceRepo, AttendanceStatus } from "@/data/firebase/AttendanceRepo";


import { PlayersTable } from "@/components/team/playersTable";
import { AttendanceButtons } from "@/components/attendance/attendanceButtons";
export default function MatchDetailScreen() {
  const router = useRouter();
  const { teamId, matchId } = useLocalSearchParams<{ teamId: string; matchId: string }>();

  const userId = auth.currentUser?.uid;

  const { match, loading: loadingMatch } = useMatch(teamId, matchId);
  const { members, loading: loadingMembers } = useTeamMembers(teamId);
  const { byUserId, loading: loadingAtt } = useAttendance(teamId, matchId, "matches");
  const { isCoach, loading: loadingRoles } = useMyTeamRoles(teamId, userId);

  const loading = loadingMatch || loadingMembers || loadingAtt || loadingRoles;

  const formattedDate = useMemo(() => {
    if (!match?.date) return "---";
    return match.date?.toDate?.()
      ? match.date.toDate().toLocaleString()
      : String(match.date);
  }, [match?.date]);

  if (!teamId || !matchId) {
    router.back();
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Zápas nebol nájdený.</Text>
      </View>
    );
  }

  const canEdit = (rowUserId: string) => isCoach || rowUserId === userId;

  const setAttendance = async (rowUserId: string, status: AttendanceStatus) => {
    await attendanceRepo.setAttendance(teamId, matchId, "matches", rowUserId, status);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          padding: 16,
          borderRadius: 10,
          backgroundColor: "#f2f2f2",
          marginBottom: 12,
        }}
      >
        <Text variant="titleMedium">{match.opponent}</Text>
        <Text>Dátum: {formattedDate}</Text>
        {match.place ? <Text>Miesto: {match.place}</Text> : null}
      </View>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Dochádzka hráčov
      </Text>

      <PlayersTable
              members={members}
              onPressPlayer={(id) => {
                // napr. detail hráča alebo nič
                // router.push({ pathname: "/team/player-detail", params: { teamId, userId: id } });
              }}
              renderRight={(player) => {
                const current = byUserId[player.id]?.status ?? "maybe";
                return (
                  <AttendanceButtons
                    value={current}
                    disabled={!canEdit(player.id)}
                    onChange={(v) => setAttendance(player.id, v)}
                  />
                );
              }}
            />
    </View>
  );
}