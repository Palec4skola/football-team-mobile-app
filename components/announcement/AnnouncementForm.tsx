import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

type Props = {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  saving?: boolean;
  submitLabel?: string;
  onSubmit: () => void;
};

export function AnnouncementForm({
  title,
  setTitle,
  content,
  setContent,
  saving = false,
  submitLabel = "Uložiť",
  onSubmit,
}: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.label}>Názov</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Zadaj názov oznámenia"
          style={styles.input}
        />

        <Text style={styles.label}>Text oznámenia</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Zadaj text oznámenia"
          style={[styles.input, styles.textarea]}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>{submitLabel}</Text>
          )}
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textarea: {
    minHeight: 140,
  },
  button: {
    marginTop: 18,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
