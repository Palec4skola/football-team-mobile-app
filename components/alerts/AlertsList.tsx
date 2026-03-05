import React from "react";
import { FlatList, View } from "react-native";
import { AlertListItem } from "./AlertListItem";
import { AlertsEmptyState } from "./AlertsEmptyState";
import { alertsStyles } from "@/styles/alerts.styles";

export type AlertsListItemModel = {
  id: string;
  title: string;
  body: string;
  onPress?: () => void;
};

type Props = {
  items: AlertsListItemModel[];
};

export function AlertsList({ items }: Props) {
  return (
    <FlatList
      contentContainerStyle={alertsStyles.listContent}
      data={items}
      keyExtractor={(i) => i.id}
      ItemSeparatorComponent={() => <View style={alertsStyles.separator} />}
      renderItem={({ item }) => (
        <AlertListItem title={item.title} body={item.body} onPress={item.onPress} />
      )}
      ListEmptyComponent={<AlertsEmptyState />}
    />
  );
}