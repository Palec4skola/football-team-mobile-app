import React from "react";
import { ScrollView, View } from "react-native";
import {
  Card,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { homeStyles as s } from "@/styles/homeProfesional.style";

type Props = {
  onGoTrainings: () => void;
  onGoMatches: () => void;
  onGoWellness: () => void;
  onGoAnnouncements: () => void;
  onGoAttendance: () => void;
};

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
    </Card>
  );
}

export default function HomeProfessional({
  onGoTrainings,
  onGoMatches,
  onGoWellness,
  onGoAnnouncements,
  onGoAttendance,
}: Props) {
  const theme = useTheme();

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View
        style={[
          s.heroCard,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text style={s.heroEyebrow}>PRO MODE</Text>
        <Text style={s.heroTitle}>Profesionálny tím</Text>
        <Text style={s.heroSubtitle}>
          Centrálne miesto pre tréningy, zápasy, wellness a tímové riadenie.
        </Text>
      </View>

      <View style={s.grid}>
        <GridCard
          title="Tréningy"
          hint="Plán tréningov a účasť"
          icon="calendar-clock"
          onPress={onGoTrainings}
          accent="#2563EB"
        />

        <GridCard
          title="Zápasy"
          hint="Prehľad zápasov a detailov"
          icon="soccer"
          onPress={onGoMatches}
          accent="#EA580C"
        />

        <GridCard
          title="Oznámenia"
          hint="Správy a dôležité info"
          icon="bullhorn-outline"
          onPress={onGoAnnouncements}
          accent="#7C3AED"
        />

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