import React, { useMemo } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import { userRepo } from "@/data/firebase/UserRepo";
import { useActiveTeam } from "@/hooks/useActiveTeam"; // uprav na tvoj hook
import { AlertsList } from "@/components/alerts/AlertsList";
import { alertsStyles } from "@/styles/alerts.styles";
import { useLastAlertsReadAt } from "@/hooks/alerts/useLastAlertsReadAt";
import { useUnreadTeamAlerts } from "@/hooks/alerts/useUnreadTeamAlerts";

type AlertTargetKind = "training" | "match";

type RouteInput = {
  targetKind: AlertTargetKind;
  teamId: string;
  targetId: string;
};

// typ je “any” aby si sa netrápil s expo-router typmi
export function getAlertRoute(input: RouteInput): any {
  if (input.targetKind === "training") {
    return {
      pathname: "/training/training-detail",
      params: { teamId: input.teamId, trainingId: input.targetId },
    };
  }

  return {
    pathname: "/match/match-detail",
    params: { teamId: input.teamId, matchId: input.targetId },
  };
}
export default function AlertsScreen() {
  const uid = auth.currentUser?.uid;
  const router = useRouter();
  const { teamId } = useActiveTeam(); // alebo odkiaľ berieš aktívny tím
  const { lastReadAt } = useLastAlertsReadAt();
  const { alerts, loading } = useUnreadTeamAlerts(teamId, lastReadAt);
  const unreadCount = alerts.filter(
    (a) =>
      a.createdAt &&
      (!lastReadAt || a.createdAt.toMillis() > lastReadAt.toMillis()),
  ).length;
  const items = useMemo(() => {
    if (!teamId) return [];
    return alerts.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      onPress: async () => {
        const route = getAlertRoute({
          targetKind: a.targetKind,
          teamId: a.teamId ?? teamId,
          targetId: a.targetId,
        });
        router.push(route);
      },
    }));
  }, [alerts, router, teamId]);

  if (!teamId || !uid) {
    return (
      <View style={alertsStyles.emptyWrap}>
        <Text>Najprv si vyber tím alebo sa prihláste.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[
          alertsStyles.screen,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={alertsStyles.screen}>
      <AlertsList items={items} />
      <Button
        onPress={() => userRepo.markAlertsRead(uid)}
        disabled={unreadCount === 0}
      >
        Označiť všetko ako videné
      </Button>
    </View>
  );
}
