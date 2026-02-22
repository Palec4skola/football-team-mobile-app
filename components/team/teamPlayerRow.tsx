import { styles } from "@/styles/teamPlayerRow.styles";
import React from "react";
import { Button, Text } from "react-native-paper";
import { getRoleLabel } from "../../utils/getRoleLabel";
import { View } from "react-native";

type Player = {
  id: string;
  firstName?: string;
  lastName?: string;
  roles?: string[] | string;
};

type Props = {
  player: Player;
  isMe: boolean;
  onPress: () => void;
  rightElement?: React.ReactNode;
};

export function TeamPlayerRow({ player, isMe, onPress, rightElement }: Props) {
  const roleText = getRoleLabel(player.roles);

  return (
    <Button style={styles.playerItem} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
        
        {/* Ľavá časť */}
        <View style={{ flex: 1 }}>
          <Text style={styles.playerText}>
            {player.firstName} {player.lastName} — {roleText}
            {isMe ? " (Ty)" : ""}
          </Text>
        </View>

        {/* Pravá časť (attendance / čokoľvek) */}
        {rightElement}
        
      </View>
    </Button>
  );
}
