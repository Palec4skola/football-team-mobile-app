import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePlayerAttendanceLastMonth } from "@/hooks/usePlayerAttendanceLastMonth";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { styles } from "@/styles/playersAttendance.styles";

function fmtDate(ts: any) {
  try {
    const d: Date = ts?.toDate?.() ?? new Date(ts);
    return d.toLocaleDateString("sk-SK", { weekday: "short", day: "2-digit", month: "2-digit" });
  } catch {
    return "-";
  }
}

function fmtTime(ts: any) {
  try {
    const d: Date = ts?.toDate?.() ?? new Date(ts);
    return d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function statusLabel(status: "yes" | "no" | "unknown" | "maybe") {
  if (status === "yes") return "Bol";
  if (status === "no") return "Nebol";
  if (status === "maybe") return "Možno";
  return "—";
}

function statusStyle(status: "yes" | "no" | "unknown"|"maybe") {
  if (status === "yes") return styles.statusYes;
  if (status === "no") return styles.statusNo;
  if (status === "maybe") return styles.statusUnknown;
  return styles.statusUnknown;
}

export default function PlayerAttendance() {
  const { teamId, playerId } = useLocalSearchParams<{ teamId: string; playerId: string }>();
  const router = useRouter();
  // meno hráča pre header (ak ho vieš z members)
  const { members } = useTeamMembers(teamId);
  const playerName = useMemo(() => {
    const p = (members ?? []).find((m: any) => m.id === playerId);
    if (!p) return "Hráč";
    return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Hráč";
  }, [members, playerId]);

  const { loading, error, rows, present, total, pct } =
    usePlayerAttendanceLastMonth(teamId, playerId);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Načítavam dochádzku…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Chyba</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{playerName}</Text>
        <Text style={styles.subtitle}>
          Dochádzka za 30 dní: <Text style={styles.subtitleStrong}>{present}/{total}</Text> ({pct}%)
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={rows}
        keyExtractor={(i) => i.trainingId}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<Text style={styles.empty}>Žiadne tréningy v období</Text>}
        renderItem={({ item }) => (
  <Pressable
    onPress={() =>
      router.push({
        pathname: "/training/training-detail",
        params: { teamId, trainingId: item.trainingId },
      })
    }
    style={({ pressed }) => [
      styles.row,
      pressed && { opacity: 0.7 },
    ]}
  >
    <View style={styles.rowLeft}>
      <Text style={styles.rowTitle}>{item.title}</Text>
      <Text style={styles.rowMeta}>
        {fmtDate(item.startsAt)} • {fmtTime(item.startsAt)}
      </Text>
    </View>

    <View style={[styles.statusPill, statusStyle(item.status)]}>
      <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
    </View>
  </Pressable>
)}
      />
    </View>
  );
}