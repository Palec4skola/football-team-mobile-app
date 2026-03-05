import React, { useMemo } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
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
  const router = useRouter();
  const { teamId } = useActiveTeam(); // alebo odkiaľ berieš aktívny tím
const { lastReadAt } = useLastAlertsReadAt();
const { alerts, loading } = useUnreadTeamAlerts(teamId, lastReadAt);
  const items = useMemo(() => {
    if (!teamId) return [];
    return alerts.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      onPress: async () => {
        const uid = auth.currentUser?.uid;

        if (uid) {
          await userRepo.markAlertsRead(uid);
        }
        const route = getAlertRoute({
          targetKind: a.targetKind,
          teamId: a.teamId ?? teamId,
          targetId: a.targetId,
        });
        router.push(route);
      },
    }));
  }, [alerts, router, teamId]);

  if (!teamId) {
    return (
      <View style={alertsStyles.emptyWrap}>
        <Text>Najprv si vyber tím.</Text>
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
    </View>
  );
}
