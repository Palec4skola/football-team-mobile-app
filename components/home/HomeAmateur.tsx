import React from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { homeStyles as s } from "@/styles/homeAmater.styles";
import { useNextTraining } from "@/hooks/training/useNextTraining";
import { useNextMatch } from "@/hooks/match/useNextMatch";
import { useLatestAnnouncements } from "@/hooks/announcement/useLatestAnnouncement";

type Props = {
  teamId: string;
  onGoTrainings: () => void;
  onGoMatches: () => void;
  onGoAnnouncements: () => void;
  onGoAttendance: () => void;
};

function formatDateTime(date?: Date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const announcements = [
  "Pripomíname platbu členského do 10.11.",
  "V sobotu spoločný obed po zápase.",
  "Tréningy budú od budúceho týždňa v novej hale.",
];

export default function HomeAmateur({
  teamId,
  onGoTrainings,
  onGoMatches,
  onGoAnnouncements,
  onGoAttendance,
}: Props) {
  const { training, loading: trainingLoading } = useNextTraining(teamId);
  const { match, loading: matchLoading } = useNextMatch(teamId);
const { announcements, loading: announcementsLoading } =
  useLatestAnnouncements(teamId, 3);
  const isLoading = trainingLoading || matchLoading;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Domov</Text>
      <Text style={s.subtitle}>Prehľad tímových aktivít</Text>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <>
          {/* TRÉNINGY */}
          <Card style={[s.card, { borderLeftColor: "#3B82F6" }]} mode="elevated">
            <TouchableRipple onPress={onGoTrainings} borderless>
              <View style={s.cardInner}>
                <View style={s.cardHeader}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={24}
                    color="#3B82F6"
                  />
                  <Text style={s.cardTitle}>Tréningy</Text>
                </View>

                {training ? (
                  <>
                    <Text style={s.strongLine}>
                      {training.name} • {formatDateTime(training.startsAt?.toDate())}
                    </Text>
                  </>
                ) : (
                  <Text style={s.line}>
                    Najbližší tréning zatiaľ nie je naplánovaný.
                  </Text>
                )}
              </View>
            </TouchableRipple>
          </Card>

          {/* ZÁPASY */}
          <Card style={[s.card, { borderLeftColor: "#F97316" }]} mode="elevated">
            <TouchableRipple onPress={onGoMatches} borderless>
              <View style={s.cardInner}>
                <View style={s.cardHeader}>
                  <MaterialCommunityIcons
                    name="soccer"
                    size={24}
                    color="#F97316"
                  />
                  <Text style={s.cardTitle}>Najbližší zápas</Text>
                </View>

                {match ? (
                  <>
                    <Text style={s.line}>Súper: {match.opponent}</Text>
                    <Text style={s.line}>
                      Dátum: {formatDateTime(match.date?.toDate())}
                    </Text>
                    <Text style={s.strongLine}>
                      Miesto: {match.place ?? "Nezadané"}
                    </Text>
                  </>
                ) : (
                  <Text style={s.line}>
                    Najbližší zápas zatiaľ nie je naplánovaný.
                  </Text>
                )}
              </View>
            </TouchableRipple>
          </Card>

          {/* OZNÁMENIA */}
          <Card style={[s.card, { borderLeftColor: "#7C3AED" }]} mode="elevated">
            <TouchableRipple onPress={onGoAnnouncements} borderless>
              <View style={s.cardInner}>
                <View style={s.cardHeader}>
                  <MaterialCommunityIcons
                    name="bullhorn-outline"
                    size={24}
                    color="#7C3AED"
                  />
                  <Text style={s.cardTitle}>Tímové oznámenia</Text>
                </View>

                {announcementsLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} />
      ) : announcements.length > 0 ? (
        announcements.map((item) => (
          <View key={item.id} style={{ marginBottom: 8 }}>
            <Text style={s.strongLine}>{item.title}</Text>
            <Text style={s.line} numberOfLines={2}>
              {item.content}
            </Text>
          </View>
        ))
      ) : (
        <Text style={s.line}>Zatiaľ nie sú dostupné žiadne oznámenia.</Text>
      )}
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
        </>
      )}
    </ScrollView>
  );
}