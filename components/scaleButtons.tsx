// components/ScaleButtons.tsx
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export function ScaleButtons({
  label,
  value,
  onChange,
  leftHint = "nízke",
  rightHint = "vysoké",
}: {
  label: string;
  value: number; // 1..5
  onChange: (v: number) => void;
  leftHint?: string;
  rightHint?: string;
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text>{label}</Text>
        <Text>{value}/5</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button
            key={n}
            mode={value === n ? "contained" : "outlined"}
            onPress={() => onChange(n)}
            style={{ flex: 1 }}
            compact
          >
            {n}
          </Button>
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
        <Text variant="bodySmall">{leftHint}</Text>
        <Text variant="bodySmall">{rightHint}</Text>
      </View>
    </View>
  );
}