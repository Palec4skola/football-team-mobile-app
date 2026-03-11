// app/team/team-chat.tsx
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";

import { useTeamChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { useActiveTeam } from "@/hooks/useActiveTeam";

export default function TeamChatScreen() {
    const {teamId} = useActiveTeam();
    const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    loading,
    sending,
    text,
    setText,
    send,
    currentUserId,
  } = useTeamChat(teamId ?? null);

  useEffect(() => {
    if (!messages.length) return;

    const t = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(t);
  }, [messages.length]);

  if (!teamId) {
    return (
      <View style={styles.center}>
        <Text>Chýba teamId.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMine={item.senderId === currentUserId}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text>Zatiaľ tu nie sú žiadne správy.</Text>
          </View>
        }
      />

      <MessageInput
        value={text}
        onChangeText={setText}
        onSend={send}
        sending={sending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    marginTop: 24,
    alignItems: "center",
  },
});