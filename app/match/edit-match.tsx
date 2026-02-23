// src/app/match/edit-match.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
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
    submit,
  } = useEditMatchForm(teamId, matchId);
  console.log("match", match);
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

  return (
    <View style={{ flex: 1 }}>
      <MatchForm
        opponent={opponent}
        setOpponent={setOpponent}
        place={place}
        setPlace={setPlace}
        date={date}
        setDate={setDate}
        loading={saving}
        canSubmit={
          !saving && opponent.trim().length > 0 && place.trim().length > 0
        }
        onSubmit={onSubmit}
      />
    </View>
  );
}
