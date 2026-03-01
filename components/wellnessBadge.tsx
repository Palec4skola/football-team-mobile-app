// components/wellness/WellnessBadge.tsx
import React from "react";
import { View, Text } from "react-native";

function color(score: number) {
  if (score >= 8) return "#4CAF50";
  if (score >= 6) return "#FFC107";
  return "#F44336";
}

export function WellnessBadge({ score }: { score: number | null }) {
  const bg = score == null ? "#999" : color(score);

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        minWidth: 60,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>
        {score == null ? "--" : `${score}/10`}
      </Text>
    </View>
  );
}