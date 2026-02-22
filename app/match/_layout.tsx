import React from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoHome = () => {
    router.push("..");
  };

  const handleOpenChat = () => {
    router.push("../chat/chat-list");
  };

  const showBackArrow = pathname !== "..";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: () =>
            showBackArrow ? (
              <Button onPress={handleGoHome} style={{ marginLeft: 16 }}>
                <Ionicons name="arrow-back-outline" size={26} color="#007AFF" />
              </Button>
            ) : null,
          headerRight: () => (
            <Button onPress={handleOpenChat} style={{ marginRight: 16 }}>
              <Ionicons name="chatbubbles-outline" size={26} color="#007AFF" />
            </Button>
          ),
        }}
      >
        <Stack.Screen
          name="player-profile"
          options={{
            title: "Player",
          }}
        />
      </Stack>{" "}
    </GestureHandlerRootView>
  );
}
