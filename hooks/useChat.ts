import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { auth } from "@/firebase";
import {
  TeamChatMessage,
  teamChatRepo,
} from "@/data/firebase/ChatRepo";
import { useUserProfile, UserProfile } from "./useUserProfile";

function getFallbackSenderName(profile: UserProfile | null) {
  const user = auth.currentUser;

  if (!profile) {
    return user?.email || "Používateľ";
  }

  return `${profile.firstName} ${profile.lastName}`;
}

export function useTeamChat(teamId: string | null) {
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const {profile} = useUserProfile(auth.currentUser!.uid);

  useEffect(() => {
    if (!teamId) {
      setMessages([]);
      setLoading(false);
      return;   
    }

    setLoading(true);

    const unsubscribe = teamChatRepo.subscribeToMessages(
      teamId,
      (items) => {
        setMessages(items);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
        Alert.alert("Chyba", "Nepodarilo sa načítať chat.");
      }
    );

    return unsubscribe;
  }, [teamId]);

  const send = useCallback(async () => {
    if (!teamId) return;
    if (!text.trim()) return;

    try {
      setSending(true);

      await teamChatRepo.sendMessage({
        teamId,
        senderName: getFallbackSenderName(profile),
        text,
      });

      setText("");
    } catch (error) {
      console.error(error);
      Alert.alert("Chyba", "Správu sa nepodarilo odoslať.");
    } finally {
      setSending(false);
    }
  }, [teamId, text]);

  const currentUserId = auth.currentUser?.uid ?? null;

  const messagesSorted = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aMs = a.createdAt?.toMillis?.() ?? 0;
      const bMs = b.createdAt?.toMillis?.() ?? 0;
      return aMs - bMs;
    });
  }, [messages]);

  return {
    messages: messagesSorted,
    loading,
    sending,
    text,
    setText,
    send,
    currentUserId,
  };
}