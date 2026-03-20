import React from "react";
import { View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { TeamStats } from "@/data/firebase/MatchRepo";

type TeamStatsCardProps = {
  stats: TeamStats;
};

type StatItemProps = {
  label: string;
  value: number;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{value}</Text>
      <Text style={{ fontSize: 13, opacity: 0.7 }}>{label}</Text>
    </View>
  );
}

export function TeamStatsCard({ stats }: TeamStatsCardProps) {
  const goalDifference = stats.goalsFor - stats.goalsAgainst;

  return (
    <Card mode="elevated" style={{ borderRadius: 16 }}>
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
          Štatistika tímu
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <StatItem label="Výhry" value={stats.wins} />
          <StatItem label="Remízy" value={stats.draws} />
          <StatItem label="Prehry" value={stats.losses} />
        </View>

        <Divider style={{ marginBottom: 16 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <StatItem label="Zápasy" value={stats.played} />
          <StatItem label="Body" value={stats.points} />
          <StatItem label="Skóre" value={goalDifference} />
        </View>

        <Divider style={{ marginBottom: 16 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <StatItem label="Strelené góly" value={stats.goalsFor} />
          <StatItem label="Inkasované góly" value={stats.goalsAgainst} />
        </View>
      </Card.Content>
    </Card>
  );
}