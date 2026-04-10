import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Linking, View, Alert } from "react-native";
import { ActivityIndicator, Text, Button } from "react-native-paper";
import { auth } from "../../firebase";

import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTraining } from "../../hooks/training/useTraining";
import { useAttendance } from "@/hooks/useAttendance";

import { AttendanceButtons } from "@/components/attendance/attendanceButtons";
import { PlayersTable } from "@/components/team/playersTable";
import {
  attendanceRepo,
  AttendanceStatus,
} from "@/data/firebase/AttendanceRepo";
import { useActiveTeam } from "@/hooks/useActiveTeam";

export default function TrainingDetailScreen() {
  const router = useRouter();
  const { teamId, trainingId } = useLocalSearchParams<{
    teamId: string;
    trainingId: string;
  }>();

  const userId = auth.currentUser?.uid;
  const { teamLevel } = useActiveTeam();
  const isProfessional = teamLevel === "professional";

  useEffect(() => {
    if (!teamId || !trainingId) {
      router.back();
    }
  }, [teamId, trainingId, router]);

  const { training, loading: loadingTraining } = useTraining(
    teamId,
    trainingId,
  );
  const { members, loading: loadingMembers } = useTeamMembers(teamId);
  const { byUserId, loading: loadingAtt } = useAttendance(
    teamId,
    trainingId,
    "trainings",
  );
  const { isCoach, loadingRoles } = useMyTeamRoles(teamId, userId);

  const loading =
    loadingTraining || loadingMembers || loadingAtt || loadingRoles;

  const formattedDate = useMemo(() => {
    if (!training?.startsAt) return "---";
    return training.startsAt?.toDate?.()
      ? training.startsAt.toDate().toLocaleString()
      : String(training.startsAt);
  }, [training?.startsAt]);

  const handleOpenVideo = async () => {
    const url = training?.video?.url;
    if (!url) return;

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Chyba", "Video sa nepodarilo otvoriť.");
      return;
    }

    await Linking.openURL(url);
  };

  if (!teamId || !trainingId) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!training) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Tréning nebol nájdený.</Text>
      </View>
    );
  }

  const canEdit = (rowUserId: string) => isCoach || rowUserId === userId;

  const setAttendance = async (rowUserId: string, status: AttendanceStatus) => {
    await attendanceRepo.setAttendance(
      teamId,
      trainingId,
      "trainings",
      rowUserId,
      status,
    );
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
        <Text variant="titleMedium">{training.name}</Text>
        <Text>Dátum: {formattedDate}</Text>
        {training.description ? (
          <Text>Popis: {training.description}</Text>
        ) : null}
        {isProfessional && training.video?.url ? (
          <View style={{ marginTop: 12 }}>
            {training.video.name ? (
              <Text style={{ marginBottom: 8 }}>
                Video: {training.video.name}
              </Text>
            ) : null}

            <Button mode="contained" onPress={handleOpenVideo}>
              Prehrať video
            </Button>
          </View>
        ) : null}
      </View>

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Dochádzka hráčov
      </Text>

      <PlayersTable
        members={members}
        onPressPlayer={(id) => {}}
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
