// src/features/players/hooks/usePlayerProfile.ts
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { auth } from "@/firebase";
import { userRepo, UserModel } from "@/data/firebase/UserRepo";
import { teamRepo } from "@/data/firebase/TeamRepo";
import { useRouter } from "expo-router";
const ROLE_PLAYER = "player";
const ROLE_COACH = "coach";

export function usePlayerProfile(teamId: string | null, playerId: string | null) {
    const router = useRouter();
  const [player, setPlayer] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string | null>(null);
  const [editingStatValue, setEditingStatValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!playerId) {
        Alert.alert("Chyba", "Nezadali ste ID hráča");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // current user roles
        if (auth.currentUser?.uid) {
          const me = await userRepo.getById(auth.currentUser.uid);
          if (!cancelled) {
            setCurrentUserRoles(userRepo.normalizeRoles(me?.roles));
          }
        }

        // player
        const p = await userRepo.getById(playerId);
        if (!p) {
          Alert.alert("Chyba", "Hráč nebol nájdený");
          if (!cancelled) setPlayer(null);
          return;
        }

        if (!cancelled) {
          setPlayer(p);
          setSelectedRoles(userRepo.normalizeRoles(p.roles));
        }
      } catch (e: any) {
        Alert.alert("Chyba", e?.message ?? "Nepodarilo sa načítať údaje");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  const isCoach = useMemo(
    () => currentUserRoles.includes(ROLE_COACH),
    [currentUserRoles]
  );

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const updateRoles = async () => {
    if (!playerId) return;
    try {
      await userRepo.updateRoles(playerId, selectedRoles);
      setPlayer((prev) =>
        prev ? { ...prev, roles: selectedRoles.length ? selectedRoles : [ROLE_PLAYER] } : prev
      );
      Alert.alert("Úspech", "Roly boli aktualizované");
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa uložiť roly");
    }
  };

  const openEditModal = (statKey: string) => {
    if (!isCoach) return;
    setEditingStatKey(statKey);
    setEditingStatValue(player?.[statKey]?.toString?.() ?? "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingStatKey(null);
    setEditingStatValue("");
  };

  const saveStatValue = async () => {
    if (!editingStatKey || !playerId) {
      closeModal();
      return;
    }
    const trimmed = editingStatValue.trim();
    if (!trimmed) return;

    try {
      await userRepo.updateStat(playerId, editingStatKey, trimmed);
      setPlayer((prev) => (prev ? { ...prev, [editingStatKey]: trimmed } : prev));
      Alert.alert("Úspech", `Štatistika ${editingStatKey} bola aktualizovaná`);
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa uložiť štatistiku");
    } finally {
      closeModal();
    }
  };

  const removeFromTeam = async () => {
    if (!playerId) return;

    Alert.alert("Odstrániť hráča", "Naozaj chceš odstrániť hráča z tímu?", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Odstrániť",
        style: "destructive",
        onPress: async () => {
          try {
            await teamRepo.removeMember(teamId, playerId);
            userRepo.removeMembership(playerId, teamId);
            Alert.alert("Úspech", "Hráč bol odstránený z tímu");
            router.back();
          } catch (e: any) {
            Alert.alert("Chyba", e?.message ?? "Nepodarilo sa odstrániť hráča");
          }
        },
      },
    ]);
  };

  return {
    playerId,
    player,
    loading,

    isCoach,
    selectedRoles,
    toggleRole,
    updateRoles,

    // modal edit stat
    modalVisible,
    editingStatKey,
    editingStatValue,
    setEditingStatValue,
    openEditModal,
    closeModal,
    saveStatValue,

    removeFromTeam,
  };
}
