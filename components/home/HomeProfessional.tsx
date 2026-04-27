import React from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { homeStyles as s } from "@/styles/homeProfesional.style";
import { useNextTraining } from "@/hooks/training/useNextTraining";
import { useNextMatch } from "@/hooks/match/useNextMatch";
import { useLatestAnnouncements } from "@/hooks/announcement/useLatestAnnouncement";

type Props = {
  teamId: string;
  onGoTrainings: () => void;
  onGoMatches: () => void;
  onGoWellness: () => void;
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

function GridCard({
  title,
  hint,
  icon,
  onPress,
  accent,
}: {
  title: string;
  hint: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  accent: string;
}) {
  return (
    <Card style={s.gridItem} mode="elevated">
  <View style={{ overflow: "hidden", borderRadius: 22 }}>
    <TouchableRipple onPress={onPress} borderless style={s.gridRipple}>
      <View style={s.gridInner}>
          <View style={[s.iconWrap, { backgroundColor: accent + "22" }]}>
            <MaterialCommunityIcons name={icon} size={24} color={accent} />
          </View>

          <Text style={s.gridTitle}>{title}</Text>
          <Text style={s.gridHint}>{hint}</Text>

          <View style={s.gridFooter}>
            <View style={[s.miniBar, { backgroundColor: accent }]} />
            <MaterialCommunityIcons
              name="arrow-top-right"
              size={18}
              color={accent}
            />
          </View>
        </View>
      </TouchableRipple>
    </View>
    </Card>
  );
}

export default function HomeProfessional({
  teamId,
  onGoTrainings,
  onGoMatches,
  onGoWellness,
  onGoAnnouncements,
  onGoAttendance,
}: Props) {
  const { training, loading: trainingLoading } = useNextTraining(teamId);
  const { match, loading: matchLoading } = useNextMatch(teamId);
  const { announcements, loading: announcementsLoading } =
    useLatestAnnouncements(teamId, 3);

  const isLoading =
    trainingLoading || matchLoading || announcementsLoading;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card style={s.upcomingCard} mode="elevated">
        <View style={{ overflow: "hidden", borderRadius: 24 }}>
          <View style={s.upcomingInner}>
          <Text style={s.upcomingTitle}>Najbližšie udalosti</Text>

          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : (
            <View style={s.upcomingGrid}>
              <TouchableRipple
                onPress={onGoTrainings}
                borderless
                style={s.upcomingItem}
              >
                <View>
                  <View style={s.upcomingHeader}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={22}
                      color="#2563EB"
                    />
                    <Text style={s.upcomingLabel}>Najbližší tréning</Text>
                  </View>

                  {training ? (
                    <>
                      <Text style={s.upcomingMain} numberOfLines={1}>
                        {training.name}
                      </Text>
                      <Text style={s.upcomingText}>
                        {formatDateTime(training.startsAt?.toDate())}
                      </Text>
                    </>
                  ) : (
                    <Text style={s.upcomingText}>Žiadny budúci tréning</Text>
                  )}
                </View>
              </TouchableRipple>

              <TouchableRipple
                onPress={onGoMatches}
                borderless
                style={s.upcomingItem}
              >
                <View>
                  <View style={s.upcomingHeader}>
                    <MaterialCommunityIcons
                      name="soccer"
                      size={22}
                      color="#EA580C"
                    />
                    <Text style={s.upcomingLabel}>Najbližší zápas</Text>
                  </View>

                  {match ? (
                    <>
                      <Text style={s.upcomingMain} numberOfLines={1}>
                        vs. {match.opponent}
                      </Text>
                      <Text style={s.upcomingText}>
                        {formatDateTime(match.date?.toDate())}
                      </Text>
                      <Text style={s.upcomingText} numberOfLines={1}>
                        {match.place ?? "Miesto nie je zadané"}
                      </Text>
                    </>
                  ) : (
                    <Text style={s.upcomingText}>Žiadny budúci zápas</Text>
                  )}
                </View>
              </TouchableRipple>

              <TouchableRipple
                onPress={onGoAnnouncements}
                borderless
                style={s.upcomingItem}
              >
                <View>
                  <View style={s.upcomingHeader}>
                    <MaterialCommunityIcons
                      name="bullhorn-outline"
                      size={22}
                      color="#7C3AED"
                    />
                    <Text style={s.upcomingLabel}>Oznámenia</Text>
                  </View>

                  {announcements.length > 0 ? (
                    announcements.map((item) => (
                      <View key={item.id} style={{ marginBottom: 8 }}>
                        <Text style={s.upcomingMain} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={s.upcomingText} numberOfLines={2}>
                          {item.content}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={s.upcomingText}>
                      Žiadne nové oznámenia
                    </Text>
                  )}
                </View>
              </TouchableRipple>
            </View>
          )}
        </View>
        </View>
      </Card>

      <View style={s.grid}>

        <GridCard
          title="Wellness"
          hint="Regenerácia a zdravotný stav"
          icon="heart-pulse"
          onPress={onGoWellness}
          accent="#DC2626"
        />

        <GridCard
          title="Dochádzka"
          hint="Účasť hráčov na tréningoch"
          icon="clipboard-check-outline"
          onPress={onGoAttendance}
          accent="#059669"
        />
      </View>
      
    </ScrollView>
  );
}