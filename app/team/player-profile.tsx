// src/features/players/screens/PlayerProfileScreen.tsx
import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useSearchParams } from "expo-router/build/hooks";

import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { RoleSelectorCard } from "@/components/team/roleSelectorCard";
import { PhysicalStatsCard } from "@/components/team/player/physicalStatsCard";
import { EditStatModal } from "@/components/team/player/editStatModal";

export default function PlayerProfileScreen() {
  const params = useSearchParams();
  const playerId = params.get("playerId");
  const teamId = params.get("teamId");

  const {
    player,
    loading,
    isCoach,

    selectedRoles,
    toggleRole,
    updateRoles,

    modalVisible,
    editingStatKey,
    editingStatValue,
    setEditingStatValue,
    openEditModal,
    closeModal,
    saveStatValue,

    removeFromTeam,
  } = usePlayerProfile(teamId, playerId);

  if (loading) {
    return (
      <Card style={styles.center}>
        <ActivityIndicator size="large" />
      </Card>
    );
  }

  if (!player) {
    return (
      <Card style={styles.center}>
        <Text>Žiadne údaje o hráčovi.</Text>
      </Card>
    );
  }

  const roles = Array.isArray(player.roles) ? player.roles : player.roles ? [player.roles] : [];
  const rolesLabel =
    roles.length === 0
      ? "Žiadna rola"
      : roles.includes("coach") && roles.includes("player")
        ? "Tréner a Hráč"
        : roles.includes("coach")
          ? "Tréner"
          : roles.includes("player")
            ? "Hráč"
            : roles.join(", ");

  return (
    <Card style={styles.container}>
      <Text>Meno: {player?.firstName || "---"}</Text>
      <Text>Priezvisko: {player?.lastName || "---"}</Text>
      <Text>Email: {player?.email || "---"}</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Role: {rolesLabel}</Text>

      {isCoach && (
        <RoleSelectorCard
          selectedRoles={selectedRoles}
          toggleRole={toggleRole}
          onSave={updateRoles}
        />
      )}

      <PhysicalStatsCard player={player} isCoach={isCoach} onEdit={openEditModal} />

      <EditStatModal
        visible={modalVisible}
        statKey={editingStatKey}
        value={editingStatValue}
        onChange={setEditingStatValue}
        onCancel={closeModal}
        onSave={saveStatValue}
      />

      {isCoach && (
        <Button
          style={[styles.removeButton]}
          onPress={removeFromTeam}
        >
          <Text style={styles.removeButtonText}>Odstrániť hráča z tímu</Text>
        </Button>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  removeButton: {
    marginTop: 30,
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
