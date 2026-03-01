import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Text, TouchableRipple, useTheme } from "react-native-paper";
import { homeStyles as s } from "@/styles/home.styles";

type props = {
  onGoTrainings: () => void;
  onGoMatches: () => void;
  onGoAnnouncements: () => void;
  onGoAttendance: () => void;
};

const nextActivity = {
  type: "Tréning",
  date: "2025-11-07",
  time: "18:00",
  place: "Športová hala",
};

const lastResult = {
  opponent: "FC Príklad",
  date: "2025-10-30",
  score: "3:2",
  result: "Výhra",
};

const announcements = [
  "Pripomíname platbu členského do 10.11.",
  "V sobotu spoločný obed po zápase.",
  "Tréningy budú od budúceho týždňa v novej hale.",
];

export default function HomeAmateur({
  onGoTrainings,
  onGoMatches,
  onGoAnnouncements,
  onGoAttendance,
}: props) {
  const theme = useTheme();

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Domov</Text>

      {/* Tréning */}
      <Card style={s.card} mode="elevated">
        <TouchableRipple onPress={onGoTrainings} borderless>
          <View style={s.cardInner}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>Tréningy</Text>
              <View
                style={[
                  s.badge,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text style={[s.badgeText, { color: theme.colors.onPrimaryContainer }]}>
                  Najbližšie
                </Text>
              </View>
            </View>

            <Text style={s.strongLine}>
              {nextActivity.type} • {nextActivity.date} o {nextActivity.time}
            </Text>
            <Text style={s.line}>Miesto: {nextActivity.place}</Text>
          </View>
        </TouchableRipple>
      </Card>

      {/* Zápas */}
      <Card style={s.card} mode="elevated">
        <TouchableRipple onPress={onGoMatches} borderless>
          <View style={s.cardInner}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>Posledný výsledok</Text>
              <View
                style={[
                  s.badge,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <Text style={[s.badgeText, { color: theme.colors.onSecondaryContainer }]}>
                  {lastResult.result}
                </Text>
              </View>
            </View>

            <Text style={s.line}>Zápas proti: {lastResult.opponent}</Text>
            <Text style={s.line}>Dátum: {lastResult.date}</Text>
            <Text style={s.strongLine}>Skóre: {lastResult.score}</Text>
          </View>
        </TouchableRipple>
      </Card>

      {/* Oznámenia */}
      <Card style={s.card} mode="elevated">
        <TouchableRipple onPress={onGoAnnouncements} borderless>
          <View style={s.cardInner}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>Tímové oznámenia</Text>
              <View
                style={[
                  s.badge,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}
              >
                <Text style={[s.badgeText, { color: theme.colors.onTertiaryContainer }]}>
                  {announcements.length}
                </Text>
              </View>
            </View>

            {announcements.slice(0, 3).map((msg, idx) => (
              <View key={idx} style={s.bulletRow}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{msg}</Text>
              </View>
            ))}
          </View>
        </TouchableRipple>
      </Card>
      
      <Card style={s.card} mode="elevated">
        <TouchableRipple onPress={onGoAttendance} borderless>
          <View style={s.cardInner}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>Dochádzka hráčov na tréningoch</Text>
              <View
                style={[
                  s.badge,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}
              >
                <Text style={[s.badgeText, { color: theme.colors.onTertiaryContainer }]}>
                  {announcements.length}
                </Text>
              </View>
            </View>
            <Text style={s.line}>•Táto sekcia zobrazuje dochádzku hráčov na tréningoch.</Text>
          </View>
        </TouchableRipple>
      </Card>
    </ScrollView>
  );
}