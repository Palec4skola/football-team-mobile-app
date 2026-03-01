import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";

export function AttendanceBadge({
  present,
  total,
  onPress,
}: {
  present: number;
  total: number;
  onPress: () => void;
}) {
  const pct = useMemo(() => (total > 0 ? Math.round((present / total) * 100) : 0), [present, total]);

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        minWidth: 72,
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "700" }}>
        {present}/{total}
      </Text>
      <Text style={{ fontSize: 12, opacity: 0.7 }}>{pct}%</Text>
    </Pressable>
  );
}