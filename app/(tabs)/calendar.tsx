import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarList } from "react-native-calendars";
import { useCalendarEventsRange } from "@/hooks/useCalendarEventRange";
import { styles } from "@/styles/teamCalendar.styles";
import { useActiveTeam } from "@/hooks/useActiveTeam";

function monthBoundsFromVisible(visibleMonths: Array<{ year: number; month: number }>) {
  const min = visibleMonths.reduce((a, b) => (a.year * 12 + a.month < b.year * 12 + b.month ? a : b));
  const max = visibleMonths.reduce((a, b) => (a.year * 12 + a.month > b.year * 12 + b.month ? a : b));

  const from = new Date(min.year, min.month - 2, 1, 0, 0, 0, 0); // buffer -1 mesiac
  const to = new Date(max.year, max.month + 1, 1, 0, 0, 0, 0);   // buffer +1 mesiac
  return { from, to };
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TeamCalendarScreen() {
  const router = useRouter();
  const { teamId } = useActiveTeam();
  
  console.log(teamId);
  const { loading, eventsByDay, loadRange } = useCalendarEventsRange(teamId);
  
  const [selectedDay, setSelectedDay] = useState<string>(todayKey());
  const dayEvents = eventsByDay[selectedDay] ?? [];

  const markedDates = useMemo(() => {
    const md: Record<string, any> = {};

    for (const [dayKey, items] of Object.entries(eventsByDay)) {
      const hasTraining = items.some((e) => e.kind === "training");
      const hasMatch = items.some((e) => e.kind === "match");

      const dots = [];
      if (hasTraining) dots.push({ key: "training", color: "#007AFF" });
      if (hasMatch) dots.push({ key: "match", color: "#F97316" });

      if (dots.length) md[dayKey] = { dots };
    }

    md[selectedDay] = {
      ...(md[selectedDay] ?? {}),
      selected: true,
      selectedColor: "#111827",
      selectedTextColor: "#fff",
    };

    return md;
  }, [eventsByDay, selectedDay]);

  const openEvent = (e: { kind: "training" | "match"; id: string }) => {
    if (e.kind === "training") {
      router.push({
        pathname: "/training/training-detail",
        params: { teamId, trainingId: e.id },
      });
    } else {
      router.push({
        pathname: "/match/match-detail",
        params: { teamId, matchId: e.id },
      });
    }
  };

  return (
    <View style={styles.container}>
      <CalendarList
        pastScrollRange={24}
        futureScrollRange={24}
        scrollEnabled
        showScrollIndicator={false}
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={(d) => setSelectedDay(d.dateString)}
        onVisibleMonthsChange={(months) => {
          if (!months?.length) return;
          const { from, to } = monthBoundsFromVisible(months);
          loadRange(from, to);
        }}
      />

      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>Udalosti: {selectedDay}</Text>
        {loading ? <ActivityIndicator /> : null}
      </View>

      <FlatList
        data={dayEvents}
        keyExtractor={(i) => `${i.kind}:${i.id}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<Text style={styles.empty}>V tento deň nič nie je.</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => openEvent(item)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>
                {item.kind === "training" ? "Tréning" : "Zápas"} •{" "}
                {item.startsAt.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Text style={styles.cardSubtitle}>
                {item.title}
                {item.subtitle ? ` — ${item.subtitle}` : ""}
              </Text>
            </View>

            <View style={[styles.badge, item.kind === "training" ? styles.badgeTraining : styles.badgeMatch]}>
              <Text style={styles.badgeText}>{item.kind === "training" ? "TR" : "ZÁ"}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}