// app/team/match-detail.tsx
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase";
import { useTeamPlayers } from "../../hooks/useTeamMembers";

type Match = {
  id: string;
  teamId: string;
  opponent: string;
  place?: string;
  date?: any; // Firestore Timestamp alebo string
};

type Player = {
  id: string;
  firstName?: string;
  lastName?: string;
  roles?: string[] | string;
};

type Attendance = {
  id: string;
  teamId: string;
  matchId: string;
  userId: string;
  status: "yes" | "no";
};

export default function MatchDetailScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const matchId = params.get("matchId");
  const teamId = params.get("teamId");

  const [match, setMatch] = useState<Match | null>(null);
  // Use hook for players
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useTeamPlayers(teamId);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isCoach = currentUserRoles.includes("coach");

  // mapa attendance podľa userId
  const attendanceByUserId = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendances.forEach((a) => {
      map[a.userId] = a;
    });
    return map;
  }, [attendances]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
      // načítaj roly pre aktuálneho používateľa
      const loadRoles = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (Array.isArray(data.roles)) {
              setCurrentUserRoles(data.roles);
            } else if (data.roles) {
              setCurrentUserRoles([data.roles]);
            } else {
              setCurrentUserRoles([]);
            }
          }
        } catch (e: any) {
          console.log("Error loading roles:", e.message);
        }
      };
      loadRoles();
    }
  }, []);

  useEffect(() => {
    if (!matchId || !teamId) {
      Alert.alert("Chyba", "Chýba matchId alebo teamId");
      router.back();
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 1) zápas
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) {
          Alert.alert("Chyba", "Zápas nebol nájdený");
          router.back();
          return;
        }
        const matchData = matchSnap.data();
        setMatch({
          id: matchSnap.id,
          ...(matchData as any),
        });

        // 2) attendance pre daný zápas
        const attQ = query(
          collection(db, "attendances"),
          where("matchId", "==", matchId),
          where("teamId", "==", teamId),
        );
        const attSnap = await getDocs(attQ);
        const attList: Attendance[] = attSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setAttendances(attList);
      } catch (e: any) {
        Alert.alert("Chyba", "Nepodarilo sa načítať údaje o zápase");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [matchId, teamId, router]);

  const updateAttendance = async (userId: string, status: "yes" | "no") => {
    if (!teamId || !matchId) return;
    try {
      const existing = attendanceByUserId[userId];
      if (existing) {
        await updateDoc(doc(db, "attendances", existing.id), {
          status,
          updatedAt: new Date(),
        });
        setAttendances((prev) =>
          prev.map((a) => (a.id === existing.id ? { ...a, status } : a)),
        );
      } else {
        const ref = await addDoc(collection(db, "attendances"), {
          teamId,
          matchId,
          userId,
          status,
          updatedAt: new Date(),
        });
        setAttendances((prev) => [
          ...prev,
          { id: ref.id, teamId, matchId, userId, status },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Chyba", "Nepodarilo sa uložiť dochádzku");
      console.log(e);
    }
  };

  const renderStatusText = (userId: string) => {
    const att = attendanceByUserId[userId];
    if (!att) return "Neurčené";
    if (att.status === "yes") return "Príde";
    if (att.status === "no") return "Nepríde";
    return "Neurčené";
  };

  if (loading || playersLoading || !match) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (playersError) {
    return (
      <View style={styles.center}>
        <Text>Chyba načítania hráčov: {playersError}</Text>
      </View>
    );
  }

  const formattedDate =
    match.date && match.date.toDate
      ? match.date.toDate().toLocaleDateString()
      : (match.date ?? "---");

  return (
    <View style={styles.container}>
      {/* Info o tréningu */}
      <View style={styles.matchCard}>
        <Text style={styles.matchTitle}>{match.opponent}</Text>
        <Text style={styles.matchInfo}>Dátum: {formattedDate}</Text>
        <Text style={styles.matchInfo}>Miesto: {match.place}</Text>
      </View>

      {/* Dochádzka */}
      <Text style={styles.sectionTitle}>Dochádzka hráčov</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const fullName =
            `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() ||
            "Neznámy hráč";
          const statusText = renderStatusText(item.id);
          const isCurrentUser = currentUserId === item.id;

          const canEditThisRow = isCoach || isCurrentUser; // tréner všetkých, hráč len seba

          return (
            <View style={styles.playerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{fullName}</Text>
                <Text style={styles.playerStatus}>Stav: {statusText}</Text>
              </View>

              {canEditThisRow && (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      statusText === "Príde" && styles.statusYes,
                    ]}
                    onPress={() => updateAttendance(item.id, "yes")}
                  >
                    <Text style={styles.statusButtonText}>Prídem</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      statusText === "Nepríde" && styles.statusNo,
                    ]}
                    onPress={() => updateAttendance(item.id, "no")}
                  >
                    <Text style={styles.statusButtonText}>Neprídem</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text>Žiadni hráči pre tento tím.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  matchCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  matchTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  matchInfo: { fontSize: 14, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  playerName: { fontSize: 16, fontWeight: "500" },
  playerStatus: { fontSize: 14, color: "#555" },
  buttonsRow: { flexDirection: "row", gap: 8 },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft: 8,
  },
  statusYes: { backgroundColor: "#d4fcd4", borderColor: "#3bb54a" },
  statusNo: { backgroundColor: "#fcd4d4", borderColor: "#d9534f" },
  statusButtonText: { fontSize: 12 },
});
