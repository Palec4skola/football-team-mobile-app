import { styles } from "@/styles/teamPlayerRow.styles";
import React from "react";
import { Button, Text } from "react-native-paper";
import { getRoleLabel } from "../../utils/getRoleLabel";

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
};

export function TeamPlayerRow({ player, isMe, onPress }: Props) {
  const roleText = getRoleLabel(player.roles);

  return (
    <Button style={styles.playerItem} onPress={onPress}>
      <Text style={styles.playerText}>
        {player.firstName} {player.lastName} — {roleText}
        {isMe ? " (Ty)" : ""}
      </Text>
    </Button>
  );
}
