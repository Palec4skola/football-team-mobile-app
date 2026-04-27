import React, { useEffect, useState } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

import { auth } from "@/firebase";
import {
  resendVerificationEmail,
  refreshEmailVerificationState,
  requestPasswordReset,
} from "@/data/firebase/AuthRepo";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import SettingsHeader from "@/components/profile/settingsHeader";
import PersonalInfoCard from "@/components/profile/personalInfoCard";
import settingsStyles from "@/styles/settings.styles";

export default function SettingsScreen() {
  const router = useRouter();

  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const {
    loadingUser,
    savingProfile,
    firstName,
    lastName,
    setFirstName,
    setLastName,
    handleSaveProfile,
  } = useProfileSettings();

  useEffect(() => {
    setIsEmailVerified(auth.currentUser?.emailVerified ?? true);
  }, []);

  const handleSaveAndGoBack = async () => {
    const success = await handleSaveProfile();
    if (success) router.back();
  };

  // 🔵 EMAIL VERIFICATION
  const handleSendVerification = async () => {
  try {
    setSendingVerification(true);
    await resendVerificationEmail();

    Alert.alert(
      "Hotovo",
      "Overovací e-mail bol odoslaný."
    );
  } catch (error: any) {
    if (error?.code === "auth/too-many-requests") {
      Alert.alert(
        "Príliš veľa pokusov",
        "Skús to znova neskôr. Firebase dočasne zablokoval odosielanie e-mailov kvôli veľkému počtu požiadaviek."
      );
      return;
    }

    Alert.alert(
      "Chyba",
      "Nepodarilo sa odoslať overovací e-mail."
    );
  } finally {
    setSendingVerification(false);
  }
};

  const handleCheckVerification = async () => {
    try {
      setCheckingVerification(true);
      const verified = await refreshEmailVerificationState();
      setIsEmailVerified(verified);

      Alert.alert(
        verified ? "Overené ✅" : "Stále neoverené",
        verified
          ? "E-mail je overený."
          : "E-mail ešte nie je overený."
      );
    } finally {
      setCheckingVerification(false);
    }
  };

  // 🔴 PASSWORD RESET
  const handlePasswordReset = async () => {
    try {
      const email = auth.currentUser?.email;

      if (!email) {
        Alert.alert("Chyba", "E-mail nie je dostupný.");
        return;
      }

      setSendingReset(true);
      await requestPasswordReset(email);

      Alert.alert(
        "Reset hesla",
        "Na váš e-mail bol odoslaný odkaz na zmenu hesla."
      );
    } catch {
      Alert.alert("Chyba", "Nepodarilo sa odoslať reset e-mail.");
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={settingsStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsHeader
          title="Nastavenia"
          subtitle="Tu si môžete upraviť osobné údaje a bezpečnosť účtu."
          onBack={() => router.back()}
        />

        <PersonalInfoCard
          firstName={firstName}
          lastName={lastName}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onSave={handleSaveAndGoBack}
          loading={loadingUser || savingProfile}
        />

        {/* 🔵 EMAIL VERIFICATION */}
        {!isEmailVerified && (
          <>
            <Text style={{ marginTop: 20 }}>
              Váš e-mail ešte nie je overený.
            </Text>

            <Button
              mode="contained"
              onPress={handleSendVerification}
              loading={sendingVerification}
              style={{ marginTop: 8 }}
            >
              Odoslať overovací e-mail
            </Button>

            <Button
              mode="outlined"
              onPress={handleCheckVerification}
              loading={checkingVerification}
              style={{ marginTop: 8 }}
            >
              Skontrolovať overenie
            </Button>
          </>
        )}

        {isEmailVerified && (
          <Text style={{ marginTop: 20 }}>
            E-mail je overený ✅
          </Text>
        )}

        {/* 🔴 PASSWORD RESET */}
        <Text style={{ marginTop: 24 }}>
          Zabudli ste heslo alebo ho chcete zmeniť?
        </Text>

        <Button
          mode="outlined"
          onPress={handlePasswordReset}
          loading={sendingReset}
          style={{ marginTop: 8 }}
        >
          Zmeniť heslo cez e-mail
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}