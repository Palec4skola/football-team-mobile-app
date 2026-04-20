import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";

import { requestPasswordReset } from "@/data/firebase/AuthRepo";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert("Chýba e-mail", "Zadajte e-mailovú adresu.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(trimmedEmail);
    } catch (error: any) {
      console.log("reset error:", error?.code, error?.message);
    } finally {
      setLoading(false);
    }

    // 🔥 UX: vždy rovnaká hláška (bez prezradenia existencie účtu)
    Alert.alert(
      "Skontrolujte e-mail",
      "Ak účet s touto e-mailovou adresou existuje, odoslali sme vám odkaz na obnovenie hesla."
    );

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ gap: 16 }}>
        <Text variant="headlineSmall">Obnovenie hesla</Text>

        <Text>
          Zadajte e-mail a pošleme vám odkaz na zmenu hesla.
        </Text>

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        >
          Odoslať e-mail
        </Button>

        <Button mode="text" onPress={() => router.back()}>
          Späť na prihlásenie
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}