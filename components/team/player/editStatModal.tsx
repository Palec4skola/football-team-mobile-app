// src/features/players/components/EditStatModal.tsx
import React from "react";
import { Modal, StyleSheet } from "react-native";
import { Card, Text, TextInput, Button } from "react-native-paper";

export function EditStatModal({
  visible,
  statKey,
  value,
  onChange,
  onCancel,
  onSave,
}: {
  visible: boolean;
  statKey: string | null;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Card style={styles.modalBackdrop}>
        <Card style={styles.modalContent}>
          <Text style={{ marginBottom: 10 }}>Zadaj novú hodnotu pre {statKey}</Text>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            autoFocus
          />

          <Card style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button onPress={onCancel}>Zrušiť</Button>
            <Button onPress={onSave}>Uložiť</Button>
          </Card>
        </Card>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
