import React from "react";
import { View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { styles } from "@/styles/physicalStatsCard.styles";

const STATS = [
  { key: "height", label: "Výška", unit: "cm" },
  { key: "weight", label: "Hmotnosť", unit: "kg" },
  { key: "BMI", label: "BMI", unit: "" },
  { key: "VO2max", label: "VO₂ max", unit: "" },
  { key: "maxSpeed", label: "Najvyššia rýchlosť", unit: "" },
] as const;

function formatValue(v: any, unit?: string) {
  if (v === null || v === undefined || v === "") return "—";
  return unit ? `${v} ${unit}` : String(v);
}

export function PhysicalStatsCard({
  player,
  canEdit,
  onEdit,
}: {
  player: Record<string, any>;
  canEdit: boolean;
  onEdit: (statKey: string) => void;
}) {
  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.headerRow}>
        <Text variant="titleMedium" style={styles.title}>
          Fyzické a kondičné štatistiky
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {canEdit ? "Klikni na ceruzku pre úpravu" : "Iba na čítanie"}
        </Text>
      </View>

      <View style={styles.list}>
        {STATS.map(({ key, label, unit }) => (
          <View key={key} style={styles.row}>
            <View style={styles.left}>
              <Text variant="bodyMedium" style={styles.label}>
                {label}
              </Text>
              <Text variant="titleMedium" style={styles.value}>
                {formatValue(player?.[key], unit)}
              </Text>
            </View>

            {canEdit ? (
              <IconButton icon="pencil" onPress={() => onEdit(key)} />
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>
        ))}
      </View>
    </Card>
  );
}