// src/features/players/components/RoleSelectorCard.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Button, Text } from "react-native-paper";

export function RoleSelectorCard({
  selectedRoles,
  toggleRole,
  onSave,
}: {
  selectedRoles: string[];
  toggleRole: (role: string) => void;
  onSave: () => void;
}) {
  return (
    <>
      <Card style={styles.roleButtonsContainer}>
        <Button
          style={[styles.roleButton, selectedRoles.includes("player") && styles.roleButtonSelected]}
          onPress={() => toggleRole("player")}
        >
          <Text style={[styles.roleText, selectedRoles.includes("player") && styles.roleTextSelected]}>
            Hráč
          </Text>
        </Button>

        <Button
          style={[styles.roleButton, selectedRoles.includes("coach") && styles.roleButtonSelected]}
          onPress={() => toggleRole("coach")}
        >
          <Text style={[styles.roleText, selectedRoles.includes("coach") && styles.roleTextSelected]}>
            Tréner
          </Text>
        </Button>
      </Card>

      <Button style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Uložiť roly</Text>
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  roleButtonsContainer: { flexDirection: "row", marginTop: 10 },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  roleButtonSelected: { backgroundColor: "#007AFF" },
  roleText: { color: "#007AFF", fontWeight: "500" },
  roleTextSelected: { color: "white" },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
