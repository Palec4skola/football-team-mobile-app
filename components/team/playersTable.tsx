import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { TeamPlayerRow } from "./teamPlayerRow";
import { auth } from "@/firebase";

type TeamMember = {
  id: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[];
  joinedAt?: any;
};

type Props = {
  members: TeamMember[];
  onPressPlayer: (playerId: string) => void;
  renderRight?: (player: TeamMember) => React.ReactNode;
};

export function PlayersTable({ members, onPressPlayer, renderRight }: Props) {
  return (
    <FlatList
    scrollEnabled={false}
      data={members}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
        flexGrow: members.length === 0 ? 1 : undefined,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => (
        <TeamPlayerRow
          player={item}
          isMe={item.id === auth.currentUser?.uid}
          onPress={() => onPressPlayer(item.id)}
          rightElement={renderRight?.(item)}
        />
      )}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 40,
          }}
        >
          <Text
            variant="titleMedium"
            style={{ marginBottom: 8, fontWeight: "700", color: "#111827" }}
          >
            Žiadni členovia tímu
          </Text>
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center", color: "#6B7280" }}
          >
            Zatiaľ sa v tomto tíme nenachádzajú žiadni hráči.
          </Text>
        </View>
      }
    />
  );
}