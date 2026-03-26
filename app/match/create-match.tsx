import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { ScrollView } from "react-native-gesture-handler";

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
        {!teamId ? (
          <View>
            <Text>Chýba ID tímu (teamId)</Text>
            <Button mode="outlined" onPress={() => router.back()}>
              Späť
            </Button>
          </View>
        ) : (
          <MatchForm
            opponent={vm.opponent}
            setOpponent={vm.setOpponent}
            place={vm.place}
            setPlace={vm.setPlace}
            date={vm.date}
            setDate={vm.setDate}
            status={vm.status}
            matchLink={vm.matchLink}
            setMatchLink={vm.setMatchLink}
            setStatus={vm.setStatus}
            teamScore={vm.teamScore}
            setTeamScore={vm.setTeamScore}
            opponentScore={vm.opponentScore}
            setOpponentScore={vm.setOpponentScore}
            loading={vm.loading}
            canSubmit={vm.canSubmit}
            onSubmit={() => vm.submit({ onSuccess: goToList })}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}