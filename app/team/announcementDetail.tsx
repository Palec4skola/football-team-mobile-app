// app/team/announcement-detail.tsx
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { announcementRepo } from "@/data/firebase/AnnouncementRepo";
import { useAnnouncementDetail } from "@/hooks/announcement/useAnnouncementDetail";
import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { auth } from "@/firebase";

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

export default function AnnouncementDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    teamId?: string;
    announcementId?: string;
  }>();

  const teamId = typeof params.teamId === "string" ? params.teamId : null;
  const announcementId =
    typeof params.announcementId === "string" ? params.announcementId : null;
  const {isCoach} = useMyTeamRoles(teamId!,auth.currentUser?.uid);

  const { announcement, loading } = useAnnouncementDetail(teamId, announcementId);

  async function handleDelete() {
    if (!teamId || !announcementId) return;

    Alert.alert("Zmazať oznámenie", "Naozaj chceš zmazať toto oznámenie?", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Zmazať",
        style: "destructive",
        onPress: async () => {
          try {
            await announcementRepo.remove(teamId, announcementId);
            router.replace("/team/announcement");
          } catch (error) {
            console.error("delete announcement error:", error);
            Alert.alert("Chyba", "Nepodarilo sa zmazať oznámenie.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  if (!announcement) {
    return (
      <View style={styles.center}>
        <Text>Oznámenie sa nenašlo.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{announcement.title}</Text>

      <View style={styles.metaBox}>
        {!!announcement.createdByName && (
          <Text style={styles.metaText}>Autor: {announcement.createdByName}</Text>
        )}
        {!!announcement.createdAt && (
          <Text style={styles.metaText}>
            Vytvorené: {formatDate(announcement.createdAt)}
          </Text>
        )}
        {!!announcement.updatedAt && (
          <Text style={styles.metaText}>
            Upravené: {formatDate(announcement.updatedAt)}
          </Text>
        )}
      </View>

      <Text style={styles.contentText}>{announcement.content}</Text>

      {isCoach && (
        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                {pathname:"/team/editAnnouncement",params}
              )
            }
          >
            <Text style={styles.editButtonText}>Upraviť</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Zmazať</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  metaBox: {
    marginBottom: 18,
    gap: 4,
  },
  metaText: {
    color: "#666",
    fontSize: 13,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#222",
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#d33",
    borderWidth: 1,
  },
  deleteButtonText: {
    color: "#d33",
    fontWeight: "700",
  },
});