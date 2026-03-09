// src/components/announcements/AnnouncementListItem.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TeamAnnouncementModel } from "@/data/firebase/AnnouncementRepo";

type Props = {
  item: TeamAnnouncementModel;
  onPress: () => void;
};

function formatDate(value: any) {
  const date = value?.toDate?.();
  if (!date) return "";

  return new Intl.DateTimeFormat("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AnnouncementListItem({ item, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>

      {!!item.content && (
        <Text style={styles.preview} numberOfLines={2}>
          {item.content}
        </Text>
      )}

      <View style={styles.metaRow}>
        {!!item.createdByName && (
          <Text style={styles.metaText}>{item.createdByName}</Text>
        )}

        {!!item.createdAt && (
          <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  preview: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#888",
  },
});