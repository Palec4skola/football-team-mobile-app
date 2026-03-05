import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { alertsStyles } from "@/styles/alerts.styles";

export function AlertsEmptyState() {
  return (
    <View style={alertsStyles.emptyWrap}>
      <Text>Zatiaľ žiadne novinky.</Text>
    </View>
  );
}