import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";
import {
  refreshEmailVerificationState,
  resendVerificationEmail,
} from "@/data/firebase/AuthRepo";

export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheck = async () => {
    try {
      setLoading(true);
      setMessage("");

      const isVerified = await refreshEmailVerificationState();

      if (isVerified) {
        setMessage("E-mail bol úspešne overený.");
        router.replace("/registration/choose-join-or-create");
      } else {
        setMessage("E-mail zatiaľ nie je overený.");
      }
    } catch {
      setMessage("Nepodarilo sa skontrolovať stav overenia.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage("");
      await resendVerificationEmail();
      setMessage("Verifikačný e-mail bol znovu odoslaný.");
    } catch {
      setMessage("Nepodarilo sa znovu odoslať verifikačný e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text variant="headlineSmall">Overenie e-mailu</Text>
      <Text>
        Na tvoju e-mailovú adresu sme poslali odkaz na overenie účtu.
      </Text>

      {!!message && <Text>{message}</Text>}

      <Button mode="contained" onPress={handleCheck} loading={loading}>
        Skontrolovať overenie
      </Button>

      <Button mode="outlined" onPress={handleResend} disabled={loading}>
        Znovu poslať e-mail
      </Button>

      <Button onPress={() => router.replace("/login")}>
        Späť na prihlásenie
      </Button>
    </View>
  );
}