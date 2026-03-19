import React from "react";
import { View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import settingsStyles from "@/styles/settings.styles";

type PasswordChangeCardProps = {
  newPassword: string;
  confirmPassword: string;
  onChangeNewPassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSave: () => void;
  loading: boolean;
};

export default function PasswordChangeCard({
  newPassword,
  confirmPassword,
  onChangeNewPassword,
  onChangeConfirmPassword,
  onSave,
  loading,
}: PasswordChangeCardProps) {
  return (
    <Card style={settingsStyles.card} mode="elevated">
      <Card.Content>
        <Text style={settingsStyles.cardTitle}>Zmena hesla</Text>

        <View style={settingsStyles.inputGroup}>
          <TextInput
            label="Nové heslo"
            value={newPassword}
            onChangeText={onChangeNewPassword}
            secureTextEntry
            mode="outlined"
          />
        </View>

        <View style={settingsStyles.inputGroup}>
          <TextInput
            label="Potvrďte nové heslo"
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            secureTextEntry
            mode="outlined"
          />
        </View>

        <Button
          mode="contained"
          icon="lock-reset"
          onPress={onSave}
          loading={loading}
          disabled={loading}
          style={settingsStyles.primaryButton}
        >
          Zmeniť heslo
        </Button>
      </Card.Content>
    </Card>
  );
}