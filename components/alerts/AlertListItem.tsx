import React from "react";
import { List } from "react-native-paper";

type Props = {
  title: string;
  body: string;
  onPress?: () => void;
};

export function AlertListItem({ title, body, onPress }: Props) {
  return (
    <List.Item
      title={title}
      description={body}
      onPress={onPress}
      left={(props) => <List.Icon {...props} icon="bell-outline" />}
    />
  );
}