// src/features/announcements/hooks/useAnnouncementForm.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import { announcementRepo } from "@/data/firebase/AnnouncementRepo";

type Mode = "create" | "edit";

export function useAnnouncementForm(params: {
  mode: Mode;
  teamId: string | null;
  announcementId?: string | null;
}) {
  const { mode, teamId, announcementId = null } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit") {
      setLoadingInitial(false);
      return;
    }

    if (!teamId || !announcementId) {
      setLoadingInitial(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        if (!teamId || !announcementId) {
          return;
        }
        setLoadingInitial(true);
        const item = await announcementRepo.getById(teamId, announcementId);

        if (!mounted) return;

        if (!item) {
          Alert.alert("Chyba", "Oznámenie sa nenašlo.");
          router.back();
          return;
        }

        setTitle(item.title ?? "");
        setContent(item.content ?? "");
      } catch (error) {
        console.error("useAnnouncementForm load error:", error);
        Alert.alert("Chyba", "Nepodarilo sa načítať oznámenie.");
      } finally {
        if (mounted) setLoadingInitial(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [mode, teamId, announcementId, router]);

  async function submit() {
    if (!teamId) {
      Alert.alert("Chyba", "Chýba tím.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Upozornenie", "Zadaj názov oznámenia.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Upozornenie", "Zadaj text oznámenia.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Chyba", "Používateľ nie je prihlásený.");
      return;
    }

    try {
      setSaving(true);

      if (mode === "create") {
        const newId = await announcementRepo.create(teamId, {
          title,
          content,
          createdBy: user.uid,
          createdByName: user.displayName ?? "",
        });

        router.replace({
          pathname: "/team/announcementDetail",
          params: { teamId, announcementId },
        });
        return;
      }

      if (!announcementId) {
        Alert.alert("Chyba", "Chýba ID oznámenia.");
        return;
      }

      await announcementRepo.update(teamId, announcementId, {
        title,
        content,
      });

      router.replace({
        pathname: "/team/announcementDetail",
        params: { teamId, announcementId },
      });
    } catch (error) {
      console.error("useAnnouncementForm submit error:", error);
      Alert.alert("Chyba", "Nepodarilo sa uložiť oznámenie.");
    } finally {
      setSaving(false);
    }
  }

  return {
    title,
    setTitle,
    content,
    setContent,
    loadingInitial,
    saving,
    submit,
  };
}
