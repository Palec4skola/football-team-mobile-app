// src/app/team/create-match.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

import { useCreateMatch } from "@/hooks/match/useCreateMatch";
import { MatchForm } from "@/components/match/MatchForm";

export default function CreateMatchScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get("teamId");

  const vm = useCreateMatch(teamId);

  const goToList = () =>
    router.push({
      pathname: "/match/match-list",
      params: { teamId: teamId ?? "" },
    });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!teamId ? (
        <View >
          <Text >Chýba ID tímu (teamId)</Text>
          <Button mode="outlined" onPress={() => router.back()} >
            Späť
          </Button>
        </View>
      ) : (
        <>
          <MatchForm
            opponent={vm.opponent}
            setOpponent={vm.setOpponent}
            place={vm.place}
            setPlace={vm.setPlace}
            date={vm.date}
            setDate={vm.setDate}
            loading={vm.loading}
            canSubmit={vm.canSubmit}
            onSubmit={() => vm.submit({ onSuccess: goToList })}
          />
        </>
      )}
    </View>
  );
}
