import { useState, useEffect, useMemo} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { wellnessRepo } from "@/data/firebase/WellnessRepo";
import { styles } from "@/styles/playerWellness.style";
import { auth } from "@/firebase";
import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";

export default function WellnessPlayerScreen() {
  const { teamId, playerId } = useLocalSearchParams<{
    teamId: string;
    playerId: string;
  }>();
  const uid = auth.currentUser?.uid ?? undefined;
  const { isCoach } = useMyTeamRoles(teamId, uid);

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { members } = useTeamMembers(teamId);
  const player = members?.find((m) => m.id === playerId);

  // napr. dnešný dateKey
  const dateKey = new Date().toISOString().split("T")[0];

  const canView = useMemo(() => {
    if (!uid) return false;
    if (isCoach) return true;
    return uid === playerId;
  }, [uid, isCoach, playerId]);

  useEffect(() => {
    if (!teamId || !playerId) return;

    const unsub = wellnessRepo.onEntry(
      teamId,
      dateKey,
      playerId,
      (data) => {
        setEntry(data);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [teamId, playerId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Načítavam…</Text>
      </View>
    );
  }

  if (!canView) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 10 }}>
          Nemáš prístup k týmto údajom.
        </Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.empty}>
        <Text>Hráč dnes nevyplnil wellness dotazník.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {player?.firstName} {player?.lastName}
      </Text>

      <View style={styles.card}>
        <Row label="Spánok (hodiny)" value={entry.sleepHours} />
        <Row label="Kvalita spánku" value={entry.sleepQuality} />
        <Row label="Únava" value={entry.fatigue} />
        <Row label="Svalová bolesť" value={entry.muscleSoreness} />
        <Row label="Stres" value={entry.stress} />
        <Row label="Nálada" value={entry.mood} />
        <Row label="Energia" value={entry.energy} />
        {entry.injuryNote ? (
          <Row label="Poznámka" value={entry.injuryNote} />
        ) : null}
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}