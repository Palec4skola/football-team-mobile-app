import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { Expo } from "expo-server-sdk";

admin.initializeApp();
const expo = new Expo();

export const onTrainingCreated = onDocumentCreated(
  "teams/{teamId}/trainings/{trainingId}",
  async (event) => {
    const training = event.data?.data();
    const teamId = event.params.teamId;

    console.log("New training:", training?.name);

    const membersSnap = await admin
      .firestore()
      .collection(`teams/${teamId}/members`)
      .get();

    const tokens: string[] = [];

    for (const doc of membersSnap.docs) {
      const data = doc.data();

      const userId = data.userId || data.uid;
      if (!userId) continue;

      const userDoc = await admin.firestore().doc(`users/${userId}`).get();
      const token = userDoc.data()?.pushToken;

      if (token && Expo.isExpoPushToken(token)) {
        tokens.push(token);
      }
    }

    console.log("Tokens:", tokens.length);

    if (tokens.length === 0) return;

    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: "Nový tréning ⚽",
      body: training?.name ?? "Bol pridaný nový tréning",
    }));

    await expo.sendPushNotificationsAsync(messages);
  }
);