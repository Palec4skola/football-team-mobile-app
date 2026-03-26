// src/app/match/edit-match.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { MatchForm } from "@/components/match/MatchForm";
import { useEditMatchForm } from "@/hooks/match/useEditMatchForm";

export default function EditMatchScreen() {
  const router = useRouter();
  const { teamId, matchId } = useLocalSearchParams<{
    teamId: string;
    matchId: string;
  }>();

  const {
    match,
    loadingMatch,
    saving,
    opponent,
    setOpponent,
    place,
    setPlace,
    date,
    setDate,
    status,
    setStatus,
    matchLink,
    setMatchLink,
    teamScore,
    setTeamScore,
    opponentScore,
    setOpponentScore,
    submit,
  } = useEditMatchForm(teamId, matchId);
  if (loadingMatch) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Zápas nebol nájdený.</Text>
      </View>
    );
  }

  const onSubmit = async () => {
    const ok = await submit();
    if (!ok) return;

    router.replace({
      pathname: "/match/match-detail",
      params: { teamId, matchId },
    });
  };

  const canSubmit =
    !saving &&
    opponent.trim().length > 0 &&
    place.trim().length > 0 &&
    (status !== "finished" ||
      (teamScore.trim() !== "" &&
        opponentScore.trim() !== "" &&
        !Number.isNaN(Number(teamScore)) &&
        !Number.isNaN(Number(opponentScore))));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MatchForm
          opponent={opponent}
          setOpponent={setOpponent}
          place={place}
          setPlace={setPlace}
          date={date}
          setDate={setDate}
          status={status}
          setStatus={setStatus}
          matchLink={matchLink}
          setMatchLink={setMatchLink}
          teamScore={teamScore}
          setTeamScore={setTeamScore}
          opponentScore={opponentScore}
          setOpponentScore={setOpponentScore}
          loading={saving}
          canSubmit={canSubmit}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
