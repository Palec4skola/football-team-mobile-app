import React, { useMemo } from "react";
import { ScrollView, View, ActivityIndicator, Image } from "react-native";
import { Card, Text, Button, Chip, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { RoleSelectorCard } from "@/components/team/roleSelectorCard";
import { PhysicalStatsCard } from "@/components/team/player/physicalStatsCard";
import { EditStatModal } from "@/components/team/player/editStatModal";
import { styles } from "@/styles/playerProfileScreen.styles";

function labelRole(role: string) {
  if (role === "coach") return "Tréner";
  if (role === "player") return "Hráč";
  return role;
}

export default function PlayerProfileScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const playerId = params.get("playerId");
  const teamId = params.get("teamId");

  const {
    player,
    loading,
    roles,
    canEditRoles,
    canRemoveMember,
    canEditStats,

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
  const initials = useMemo(() => {
    const a = (player?.firstName ?? "").trim();
    const b = (player?.lastName ?? "").trim();
    const i1 = a ? a[0].toUpperCase() : "";
    const i2 = b ? b[0].toUpperCase() : "";
    return i1 + i2 || "?";
  }, [player?.firstName, player?.lastName]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.page}>
        <Card style={styles.emptyCard}>
          <Text variant="titleMedium">Žiadne údaje o hráčovi.</Text>
          <Button
            style={styles.mt16}
            mode="contained"
            onPress={() => router.back()}
          >
            Späť
          </Button>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      {/* Profile card */}
      <Card style={styles.profileCard} mode="elevated">
        <View style={styles.profileTopRow}>
          {player.photoURL ? (
            <Image source={{ uri: player.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}

          <View style={styles.profileTextCol}>
            <Text variant="titleLarge" style={styles.nameLine}>
              {(player.firstName || "---") + " " + (player.lastName || "")}
            </Text>
            <Text variant="bodyMedium" style={styles.muted}>
              {player.email || "—"}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Roly
        </Text>

        <View style={styles.chipsRow}>
          {roles.length === 0 ? (
            <Chip disabled style={styles.chip}>
              Žiadna rola
            </Chip>
          ) : (
            roles.map((r) => (
              <Chip
                key={r}
                style={styles.chip}
                icon={r === "coach" ? "whistle" : "account"}
              >
                {labelRole(r)}
              </Chip>
            ))
          )}
        </View>

        {canEditRoles && (
          <View style={styles.mt12}>
            <RoleSelectorCard
              selectedRoles={selectedRoles}
              toggleRole={toggleRole}
              onSave={updateRoles}
            />
          </View>
        )}
      </Card>

      {/* Stats */}
      <PhysicalStatsCard
        player={player}
        canEdit={canEditStats}
        onEdit={openEditModal}
      />

      <EditStatModal
        visible={modalVisible}
        statKey={editingStatKey}
        value={editingStatValue}
        onChange={setEditingStatValue}
        onCancel={closeModal}
        onSave={saveStatValue}
      />

      {/* Danger zone */}
      {canRemoveMember && (
        <Card style={styles.dangerCard} mode="elevated">
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Správa hráča
          </Text>
          <Text variant="bodyMedium" style={styles.muted}>
            Odstránením hráča ho odoberieš z tímu. Dáta hráča v účte môžu zostať
            zachované.
          </Text>

          <Button
            mode="outlined"
            style={styles.dangerButton}
            contentStyle={styles.dangerButtonContent}
            textColor="#d9534f"
            icon="account-remove"
            onPress={removeFromTeam}
          >
            Odstrániť hráča z tímu
          </Button>
        </Card>
      )}
    </ScrollView>
  );
}
