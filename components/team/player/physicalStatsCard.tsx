import React from "react";
import { View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { styles } from "@/styles/physicalStatsCard.styles";
import { UserStatKey } from "@/data/firebase/UserRepo";

type StatItem = {
  key: UserStatKey;
  label: string;
  unit: string;
};

const STATS: StatItem[] = [
  { key: "height", label: "Výška", unit: "cm" },
  { key: "weight", label: "Hmotnosť", unit: "kg" },
  { key: "bmi", label: "BMI", unit: "" },
  { key: "vo2max", label: "VO₂ max", unit: "" },
  { key: "topSpeed", label: "Najvyššia rýchlosť", unit: "" },
];

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
  onEdit: (statKey: UserStatKey) => void;
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
  {formatValue(player?.stats?.[key], unit)}
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