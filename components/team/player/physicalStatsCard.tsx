// src/features/players/components/PhysicalStatsCard.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const STATS = [
  { key: "height", label: "Výška (cm)" },
  { key: "weight", label: "Hmotnosť (kg)" },
  { key: "BMI", label: "BMI" },
  { key: "VO2max", label: "VO2 max" },
  { key: "maxSpeed", label: "Najvyššia rýchlosť" },
] as const;

export function PhysicalStatsCard({
  player,
  isCoach,
  onEdit,
}: {
  player: Record<string, any>;
  isCoach: boolean;
  onEdit: (statKey: string) => void;
}) {
  return (
    <Card style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Fyzické a kondičné štatistiky
      </Text>

      {STATS.map(({ key, label }) => (
        <Card key={key} style={styles.statRow}>
          <Text style={styles.statLabel}>
            {label}: {player?.[key] != null ? player[key] : "---"}
          </Text>

          {isCoach && (
            <Button onPress={() => onEdit(key)}>
              <Ionicons name="pencil" size={22} color="#007AFF" />
            </Button>
          )}
        </Card>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: { fontSize: 16 },
});
    