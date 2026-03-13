import React from "react";
import { ScrollView, View } from "react-native";
import {
  Card,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { homeStyles as s } from "@/styles/homeAmater.styles"

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
    <Text style={s.subtitle}>Prehľad tímových aktivít</Text>

    {/* TRÉNINGY */}
    <Card style={[s.card, { borderLeftColor: "#3B82F6" }]} mode="elevated">
      <TouchableRipple onPress={onGoTrainings} borderless>
        <View style={s.cardInner}>
          <View style={s.cardHeader}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#3B82F6" />
            <Text style={s.cardTitle}>Tréningy</Text>
          </View>

          <Text style={s.strongLine}>
            {nextActivity.type} • {nextActivity.date} o {nextActivity.time}
          </Text>

          <Text style={s.line}>Miesto: {nextActivity.place}</Text>
        </View>
      </TouchableRipple>
    </Card>

    {/* ZÁPASY */}
    <Card style={[s.card, { borderLeftColor: "#F97316" }]} mode="elevated">
      <TouchableRipple onPress={onGoMatches} borderless>
        <View style={s.cardInner}>
          <View style={s.cardHeader}>
            <MaterialCommunityIcons name="soccer" size={24} color="#F97316" />
            <Text style={s.cardTitle}>Posledný zápas</Text>
          </View>

          <Text style={s.line}>Súper: {lastResult.opponent}</Text>
          <Text style={s.line}>Dátum: {lastResult.date}</Text>
          <Text style={s.strongLine}>Skóre: {lastResult.score}</Text>
        </View>
      </TouchableRipple>
    </Card>

    {/* OZNÁMENIA */}
    <Card style={[s.card, { borderLeftColor: "#7C3AED" }]} mode="elevated">
      <TouchableRipple onPress={onGoAnnouncements} borderless>
        <View style={s.cardInner}>
          <View style={s.cardHeader}>
            <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#7C3AED" />
            <Text style={s.cardTitle}>Tímové oznámenia</Text>
          </View>

          {announcements.slice(0, 3).map((msg, idx) => (
            <Text key={idx} style={s.line}>
              • {msg}
            </Text>
          ))}
        </View>
      </TouchableRipple>
    </Card>

    {/* DOCHÁDZKA */}
    <Card style={[s.card, { borderLeftColor: "#10B981" }]} mode="elevated">
      <TouchableRipple onPress={onGoAttendance} borderless>
        <View style={s.cardInner}>
          <View style={s.cardHeader}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={24}
              color="#10B981"
            />
            <Text style={s.cardTitle}>Dochádzka</Text>
          </View>

          <Text style={s.line}>
            Prehľad dochádzky hráčov na tréningoch
          </Text>
        </View>
      </TouchableRipple>
    </Card>
  </ScrollView>
);
}
