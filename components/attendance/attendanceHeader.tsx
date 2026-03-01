import React from "react";
import { View, Text } from "react-native";

export function AttendanceHeader({ totalTrainings }: { totalTrainings: number }) {
  return (
    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Dochádzka – posledných 30 dní
      </Text>
      <Text style={{ marginTop: 4 }}>
        Tréningov v období: <Text style={{ fontWeight: "700" }}>{totalTrainings}</Text>
      </Text>
    </View>
  );
}