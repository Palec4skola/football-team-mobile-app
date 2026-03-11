// src/components/chat/MessageInput.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, IconButton, TextInput } from "react-native-paper";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending?: boolean;
};

export function MessageInput({
  value,
  onChangeText,
  onSend,
  sending = false,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Napíš správu..."
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        multiline
      />

      {sending ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <IconButton
          icon="send"
          mode="contained"
          onPress={onSend}
          disabled={!value.trim()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  loaderWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});