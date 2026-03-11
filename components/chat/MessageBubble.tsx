import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TeamChatMessage } from "@/data/firebase/ChatRepo";

type Props = {
  message: TeamChatMessage;
  isMine: boolean;
};

function formatTime(date: TeamChatMessage["createdAt"]) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("sk-SK", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date.toDate());
  } catch {
    return "";
  }
}

export function MessageBubble({ message, isMine }: Props) {
  return (
    <View
      style={[
        styles.row,
        isMine ? styles.rowMine : styles.rowOther,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleOther,
        ]}
      >
        {!isMine && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        <Text style={styles.messageText}>{message.text}</Text>

        <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginBottom: 10,
  },
  rowMine: {
    alignItems: "flex-end",
  },
  rowOther: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMine: {
    backgroundColor: "#dbeafe",
  },
  bubbleOther: {
    backgroundColor: "#f3f4f6",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.6,
    alignSelf: "flex-end",
  },
});