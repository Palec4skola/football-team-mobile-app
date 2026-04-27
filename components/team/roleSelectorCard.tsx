import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";

export function RoleSelectorCard({
  selectedRoles,
  toggleRole,
  onSave,
}: {
  selectedRoles: string[];
  toggleRole: (role: string) => void;
  onSave: () => void;
}) {
  const isPlayerSelected = selectedRoles.includes("player");
  const isCoachSelected = selectedRoles.includes("coach");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upraviť roly</Text>

      <View style={styles.roleButtonsContainer}>
        <TouchableRipple
          onPress={() => toggleRole("player")}
          borderless={false}
          style={[
            styles.roleOption,
            isPlayerSelected && styles.roleOptionSelected,
          ]}
        >
          <Text
            style={[
              styles.roleText,
              isPlayerSelected && styles.roleTextSelected,
            ]}
          >
            Hráč
          </Text>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => toggleRole("coach")}
          borderless={false}
          style={[
            styles.roleOption,
            isCoachSelected && styles.roleOptionSelected,
          ]}
        >
          <Text
            style={[
              styles.roleText,
              isCoachSelected && styles.roleTextSelected,
            ]}
          >
            Tréner
          </Text>
        </TouchableRipple>
      </View>

      <Button
        mode="contained"
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
        onPress={onSave}
      >
        Uložiť roly
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    opacity: 0.7,
  },

  roleButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  roleOption: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderColor: "rgba(0,122,255,0.35)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  roleOptionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  roleText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },

  roleTextSelected: {
    color: "#fff",
  },

  saveButton: {
    borderRadius: 14,
  },

  saveButtonContent: {
    minHeight: 52,
  },
});
