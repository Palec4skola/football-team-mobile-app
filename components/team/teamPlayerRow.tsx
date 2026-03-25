import { styles } from "@/styles/teamPlayerRow.styles";
import React from "react";
import { Button } from "react-native-paper";
import { getRoleLabel } from "../../utils/getRoleLabel";
import { View, Image, Text } from "react-native";

type Player = {
  id: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  roles?: string[] | string;
};

type Props = {
  player: Player;
  isMe: boolean;
  onPress: () => void;
  rightElement?: React.ReactNode;
};
function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}
export function TeamPlayerRow({ player, isMe, onPress, rightElement }: Props) {
  const roleText = getRoleLabel(player.roles);

  return (
    <Button style={styles.playerItem} onPress={onPress}>
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <View style={styles.row}>
          {player.photoURL ? (
            <Image source={{ uri: player.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {getInitials(player.firstName, player.lastName)}
              </Text>
            </View>
          )}

          <View style={styles.textWrap}>
            <Text style={styles.name}>
              {player.firstName} {player.lastName}
            </Text>
            <Text style={styles.role}>
              {roleText}
              {isMe ? " • Ja" : ""}
            </Text>
          </View>
        </View>

        {/* Pravá časť (attendance / čokoľvek) */}
        {rightElement}
      </View>
    </Button>
  );
}
