// app/team/create-announcement.tsx
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AnnouncementForm } from "@/components/announcement/AnnouncementForm";
import { useAnnouncementForm } from "@/hooks/announcement/useAnnouncementFrom";

export default function CreateAnnouncementScreen() {
  const params = useLocalSearchParams<{ teamId?: string }>();
  const teamId = typeof params.teamId === "string" ? params.teamId : null;

  const {
    title,
    setTitle,
    content,
    setContent,
    loadingInitial,
    saving,
    submit,
  } = useAnnouncementForm({
    mode: "create",
    teamId,
  });

  if (loadingInitial) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <AnnouncementForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        saving={saving}
        submitLabel="Pridať oznámenie"
        onSubmit={submit}
      />
    </View>
  );
}