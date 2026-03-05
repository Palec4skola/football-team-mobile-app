import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

type ReceivedSub = ReturnType<typeof Notifications.addNotificationReceivedListener>;
type ResponseSub = ReturnType<typeof Notifications.addNotificationResponseReceivedListener>;

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] = useState<Notifications.Notification>();

  const receivedSub = useRef<ReceivedSub | null>(null);
  const responseSub = useRef<ResponseSub | null>(null);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert("Must be using a physical device for Push notifications");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification");
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: false,
      }),
    });

    registerForPushNotificationsAsync().then((t) => {
      if (t) setExpoPushToken(t);
    });

    receivedSub.current = Notifications.addNotificationReceivedListener((n) => {
      setNotification(n);
    });

    responseSub.current = Notifications.addNotificationResponseReceivedListener((r) => {
      console.log("Notification response:", r);
    });

    return () => {
      receivedSub.current?.remove();
      responseSub.current?.remove();
    };
  }, []);

  return { expoPushToken, notification };
};