import React from "react";
import { ScrollView, KeyboardAvoidingView,Platform } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";

import { useProfileSettings } from "@/hooks/useProfileSettings";
import SettingsHeader from "@/components/profile/settingsHeader";
import PersonalInfoCard from "@/components/profile/personalInfoCard";
import PasswordChangeCard from "@/components/profile/passwordChangeCard";
import settingsStyles from "@/styles/settings.styles";

export default function SettingsScreen() {
  const handleSaveAndGoBack = async () => {
    const success = await handleSaveProfile();

    if (success) {
      router.back();
    }
  };
  
  const handleChangePasswordAndGoBack = async () => {
    const success = await handleChangePassword();

    if (success) {
      router.back();
    }
  };

  const router = useRouter();

  const {
    loadingUser,
    savingProfile,
    savingPassword,
    firstName,
    lastName,
    newPassword,
    confirmPassword,
    setFirstName,
    setLastName,
    setNewPassword,
    setConfirmPassword,
    handleSaveProfile,
    handleChangePassword,
  } = useProfileSettings();

  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
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

      <PasswordChangeCard
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onChangeNewPassword={setNewPassword}
        onChangeConfirmPassword={setConfirmPassword}
        onSave={handleChangePasswordAndGoBack}
        loading={loadingUser || savingPassword}
      />

      <Text style={settingsStyles.helperText}>
        Pri zmene hesla môže Aplikácia vyžadovať opätovné prihlásenie
        používateľa.
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
