import React from "react";
import { View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import settingsStyles from "@/styles/settings.styles";

type PersonalInfoCardProps = {
  firstName: string;
  lastName: string;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onSave: () => void;
  loading: boolean;
};

export default function PersonalInfoCard({
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
  onSave,
  loading,
}: PersonalInfoCardProps) {
  return (
    <Card style={settingsStyles.card} mode="elevated">
      <Card.Content>
        <Text style={settingsStyles.cardTitle}>Osobné údaje</Text>

        <View style={settingsStyles.inputGroup}>
          <TextInput
            label="Meno"
            value={firstName}
            onChangeText={onChangeFirstName}
            mode="outlined"
          />
        </View>

        <View style={settingsStyles.inputGroup}>
          <TextInput
            label="Priezvisko"
            value={lastName}
            onChangeText={onChangeLastName}
            mode="outlined"
          />
        </View>

        <Button
          mode="contained"
          icon="content-save-outline"
          onPress={onSave}
          loading={loading}
          disabled={loading}
          style={settingsStyles.primaryButton}
        >
          Uložiť zmeny
        </Button>
      </Card.Content>
    </Card>
  );
}