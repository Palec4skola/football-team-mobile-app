import React from "react";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { styles } from "@/styles/matchForm.styles";

type Props = {
  teamScore: string;
  setTeamScore: (v: string) => void;
  opponentScore: string;
  setOpponentScore: (v: string) => void;
};

export function MatchResultFields({
  teamScore,
  setTeamScore,
  opponentScore,
  setOpponentScore,
}: Props) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>Výsledok</Text>

      <View style={styles.row}>
        <TextInput
          mode="outlined"
          value={teamScore}
          onChangeText={setTeamScore}
          placeholder="Naše góly"
          keyboardType="number-pad"
          style={[styles.input, styles.rowInput]}
        />

        <TextInput
          mode="outlined"
          value={opponentScore}
          onChangeText={setOpponentScore}
          placeholder="Góly súpera"
          keyboardType="number-pad"
          style={[styles.input, styles.rowInput]}
        />
      </View>
    </View>
  );
}