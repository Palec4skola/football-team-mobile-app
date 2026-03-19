import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import settingsStyles from "@/styles/settings.styles";

type SettingsHeaderProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
};

export default function SettingsHeader({
  title,
  subtitle,
  onBack,
}: SettingsHeaderProps) {
  return (
    <View style={settingsStyles.header}>
      <Text style={settingsStyles.title}>{title}</Text>
      <Text style={settingsStyles.subtitle}>{subtitle}</Text>

      <Button
        mode="text"
        icon="arrow-left"
        onPress={onBack}
        style={settingsStyles.backButton}
      >
        Späť
      </Button>
    </View>
  );
}