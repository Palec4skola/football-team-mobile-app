import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Text, TouchableRipple, useTheme } from "react-native-paper";
import { homeStyles as s } from "@/styles/home.styles";

type props = {
  onGoTrainings: () => void;
  onGoMatches: () => void;
  onGoWellness: () => void;
  onGoAnnouncements: () => void;
};

function GridCard({
  title,
  hint,
  onPress,
}: {
  title: string;
  hint: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Card style={s.gridItem} mode="elevated">
      <TouchableRipple onPress={onPress} borderless>
        <View style={s.gridInner}>
          <Text style={s.gridTitle}>{title}</Text>
          <Text style={s.gridHint}>{hint}</Text>

          {/* malý “indikátor” dole */}
          <View
            style={{
              marginTop: 12,
              height: 4,
              borderRadius: 999,
              backgroundColor: theme.colors.primary,
              opacity: 0.25,
            }}
          />
        </View>
      </TouchableRipple>
    </Card>
  );
}

export default function HomeProfessional({
  onGoTrainings,
  onGoMatches,
  onGoWellness,
  onGoAnnouncements,
}: props) {
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Profesionálny tím</Text>
      <Text style={s.subtitle}>Vitajte v profesionálnom režime!</Text>

      <View style={s.grid}>
        <GridCard title="Tréningy" hint="Plán a dochádzka" onPress={onGoTrainings} />
        <GridCard title="Zápasy" hint="Zostava a štatistiky" onPress={onGoMatches} />
        <GridCard title="Oznámenia" hint="Info pre tím" onPress={onGoAnnouncements} />
        <GridCard title="Wellness" hint="Regenerácia a zdravie" onPress={onGoWellness} />
      </View>
    </ScrollView>
  );
}