import { useEffect, useMemo, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";

import { userRepo, UserModel } from "@/data/firebase/UserRepo";
import { teamRepo } from "@/data/firebase/TeamRepo";

export type TeamMemberModel = {
  roles?: string[] | string;
  [key: string]: any;
};

const ROLE_COACH = "coach";

function normalizeRoles(v: unknown): string[] {
  if (Array.isArray(v)) return (v as unknown[]).filter(Boolean).map(String);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

function hasRole(roles: string[], role: string) {
  return roles.includes(role);
}

export function usePlayerProfile(teamId: string | null, playerId: string | null) {
  const router = useRouter();

  const viewerId = auth.currentUser?.uid ?? null; // ✅ kto používa appku
  const isSelf = !!viewerId && !!playerId && viewerId === playerId;

  const [loading, setLoading] = useState(true);

  // target (profil ktorý pozeráš)
  const [player, setPlayer] = useState<UserModel | null>(null);
  const [member, setMember] = useState<TeamMemberModel | null>(null);

  // viewer (kto používa appku)
  const [viewerMember, setViewerMember] = useState<TeamMemberModel | null>(null);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string | null>(null);
  const [editingStatValue, setEditingStatValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!teamId || !playerId || !viewerId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [u, targetMember, vMember] = await Promise.all([
          userRepo.getUserById(playerId),
          teamRepo.getMemberById(teamId, playerId),
          teamRepo.getMemberById(teamId, viewerId),
        ]);

        if (cancelled) return;
        setPlayer(u);
        setMember(targetMember);
        setViewerMember(vMember);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamId, playerId, viewerId]);

  // ✅ roly
  const viewerRoles = useMemo(() => normalizeRoles(viewerMember?.roles), [viewerMember?.roles]);
  const targetRoles = useMemo(() => normalizeRoles(member?.roles), [member?.roles]);

  // ✅ permissions (podľa viewer-a, nie targeta)
  const canEditRoles = useMemo(() => hasRole(viewerRoles, ROLE_COACH), [viewerRoles]);

  // ak chceš, aby hráč mohol editovať svoje vlastné štatistiky, nechaj to takto:
  // (ak nechceš, tak daj len hasRole(viewerRoles, ROLE_COACH))
  const canEditStats = useMemo(() => {
    return hasRole(viewerRoles, ROLE_COACH) || isSelf;
  }, [viewerRoles, isSelf]);

  const canRemoveMember = useMemo(() => hasRole(viewerRoles, ROLE_COACH), [viewerRoles]);

  // --- RoleSelector state (z targetRoles)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  useEffect(() => {
    setSelectedRoles(targetRoles);
  }, [targetRoles]);

  const toggleRole = useCallback((role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }, []);

  const updateRoles = useCallback(async () => {
    if (!teamId || !playerId) return;
    if (!canEditRoles) return; // ✅ guard
    if (selectedRoles.length === 0) {
      Alert.alert("Chyba", "Hráč musí mať aspoň jednu rolu.");
      return;
    }

    try {
      await teamRepo.updateMemberRoles(teamId, playerId, selectedRoles); // ✅ do teams/members
      setMember((prev) => ({ ...(prev ?? {}), roles: selectedRoles }));
      Alert.alert("Úspech", "Roly boli uložené.");
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa uložiť roly");
    }
  }, [teamId, playerId, canEditRoles, selectedRoles]);

  // --- Stats modal
  const openEditModal = useCallback(
    (statKey: string) => {
      if (!canEditStats) return; // ✅ guard
      setEditingStatKey(statKey);
      setEditingStatValue(player?.[statKey]?.toString?.() ?? "");
      setModalVisible(true);
    },
    [canEditStats, player],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingStatKey(null);
    setEditingStatValue("");
  }, []);

  const saveStatValue = useCallback(async () => {
    if (!canEditStats) {
      closeModal();
      return;
    }
    if (!editingStatKey || !playerId) {
      closeModal();
      return;
    }

    const trimmed = editingStatValue.trim();
    if (!trimmed) return;

    try {
      await userRepo.updateStat(playerId, editingStatKey, trimmed); // ✅ do users (štatistiky)
      setPlayer((prev) => (prev ? { ...prev, [editingStatKey]: trimmed } : prev));
      Alert.alert("Úspech", "Štatistika bola aktualizovaná.");
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Nepodarilo sa uložiť štatistiku");
    } finally {
      closeModal();
    }
  }, [canEditStats, editingStatKey, playerId, editingStatValue, closeModal]);

  const removeFromTeam = useCallback(() => {
    if (!teamId || !playerId) return;
    if (!canRemoveMember) return; // ✅ guard

    Alert.alert("Odstrániť hráča", "Naozaj chceš odstrániť hráča z tímu?", [
      { text: "Zrušiť", style: "cancel" },
      {
        text: "Odstrániť",
        style: "destructive",
        onPress: async () => {
          try {
            await teamRepo.removeMember(teamId, playerId);
            await userRepo.removeMembership(playerId, teamId);
            Alert.alert("Úspech", "Hráč bol odstránený z tímu");
            router.back();
          } catch (e: any) {
            Alert.alert("Chyba", e?.message ?? "Nepodarilo sa odstrániť hráča");
          }
        },
      },
    ]);
  }, [teamId, playerId, canRemoveMember, router]);

  return {
    // data
    playerId,
    viewerId,
    isSelf,
    player,
    loading,
    roles: targetRoles,

    // permissions
    canEditRoles,
    canEditStats,
    canRemoveMember,

    // roles editing
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

    // member actions
    removeFromTeam,
  };
}