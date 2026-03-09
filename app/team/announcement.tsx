// app/team/announcements.tsx
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAnnouncements } from "@/hooks/announcement/useAnnouncement";
import { useActiveTeam } from "@/hooks/useActiveTeam";
import { AnnouncementListItem } from "@/components/announcement/AnnouncementListItem";
import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { auth } from "@/firebase";

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { teamId } = useActiveTeam();
  const { announcements, loading } = useAnnouncements(teamId);
  const { isCoach } = useMyTeamRoles(teamId!, auth.currentUser?.uid);

  return (
    <View style={styles.container}>
      {isCoach && (
        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: "/team/createAnnouncement",
              params: { teamId },
            })
          }
        >
          <Text style={styles.addButtonText}>Pridať oznámenie</Text>
        </Pressable>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AnnouncementListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/team/announcementDetail",
                  params: {
                    teamId: teamId,
                    announcementId: item.id,
                  },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Zatiaľ tu nie sú žiadne oznámenia.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  addButton: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  listContent: {
    padding: 16,
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
});
