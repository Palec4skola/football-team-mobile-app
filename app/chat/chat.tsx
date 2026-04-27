import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";

import { useTeamChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { useActiveTeam } from "@/hooks/useActiveTeam";

export default function TeamChatScreen() {
  const { teamId } = useActiveTeam();
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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMine={item.senderId === currentUserId}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.listContentEmpty,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Zatiaľ tu nie sú žiadne správy.
              </Text>
            </View>
          }
        />

        <View style={styles.inputWrap}>
          <MessageInput
            value={text}
            onChangeText={setText}
            onSend={send}
            sending={sending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },

  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },

  inputWrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyText: {
    opacity: 0.65,
    textAlign: "center",
  },
});