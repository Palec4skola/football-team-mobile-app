import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { PaperProvider, Text } from "react-native-paper";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function RootLayout() {
  // const { expoPushToken, notification } = usePushNotifications();

  // const notificationText = useMemo(() => {
  //   if (!notification) return "";
  //   try {
  //     return JSON.stringify(notification, null, 2);
  //   } catch {
  //     return String(notification);
  //   }
  // }, [notification]);

  // 🔧 prepni na false keď už nechceš vidieť token na obrazovke
  const SHOW_PUSH_DEBUG = true;

  return (
    <PaperProvider>
      {/* {SHOW_PUSH_DEBUG && (
        <View style={styles.debugBox}>
          <Text variant="labelSmall" selectable>
            Token: {expoPushToken?.data ?? "(loading...)"}{" "}
          </Text>
          <Text variant="labelSmall" selectable>
            Notification: {notificationText || "(none yet)"}
          </Text>
        </View>
      )} */}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false, title: "Prihlásenie" }} />
        <Stack.Screen name="registration/register" options={{ headerShown: true, title: "Registrácia" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/chat" options={{ headerShown: true, title: "Tímový chat" }} />
      </Stack>

      <StatusBar style="auto" />
      
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  debugBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
});