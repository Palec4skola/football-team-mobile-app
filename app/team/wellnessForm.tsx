// screens/WellnessFormScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  Button,
  Divider,
  Text,
  TextInput,
  HelperText,
} from "react-native-paper";
import { ScaleButtons } from "@/components/scaleButtons";
import { useTodayWellness } from "@/hooks/useTodayWellness";
import { localDateKey } from "@/utils/dateUtils";
import { useRouter } from "expo-router";
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function WellnessFormScreen({
  teamId,
  userId,
  onDone,
}: {
  teamId: string;
  userId: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const dateKey = useMemo(() => localDateKey(), []);
  const { entry, loading, error, save } = useTodayWellness(
    teamId,
    userId,
    dateKey,
  );

  const [sleepHoursText, setSleepHoursText] = useState("8");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [muscleSoreness, setMuscleSoreness] = useState(3);
  const [stress, setStress] = useState(3);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [injuryNote, setInjuryNote] = useState("");

  useEffect(() => {
    if (!entry) return;
    setSleepHoursText(String(entry.sleepHours ?? 8));
    setSleepQuality(entry.sleepQuality ?? 3);
    setFatigue(entry.fatigue ?? 3);
    setMuscleSoreness(entry.muscleSoreness ?? 3);
    setStress(entry.stress ?? 3);
    setMood(entry.mood ?? 3);
    setEnergy(entry.energy ?? 3);
    setInjuryNote(entry.injuryNote ?? "");
  }, [entry]);

  const sleepHours = Number(sleepHoursText.replace(",", "."));
  const sleepHoursValid =
    Number.isFinite(sleepHours) && sleepHours >= 0 && sleepHours <= 12;

  const canSave = useMemo(() => {
    const arr = [sleepQuality, fatigue, muscleSoreness, stress, mood, energy];
    return sleepHoursValid && arr.every((x) => x >= 1 && x <= 5);
  }, [
    sleepHoursValid,
    sleepQuality,
    fatigue,
    muscleSoreness,
    stress,
    mood,
    energy,
  ]);

  const onSave = async () => {
    const payload = {
      sleepHours: clamp(sleepHours, 0, 12),
      sleepQuality,
      fatigue,
      muscleSoreness,
      stress,
      mood,
      energy,
      injuryNote: injuryNote.trim() ? injuryNote.trim() : undefined,
    };

    await save(payload);
    router.push("/team/wellness");
    onDone?.();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="titleLarge">Wellness – {dateKey}</Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            Vyplň škály 1–5. 1 = najlepšie pri “bolesti/únave/stres”, 5 =
            najhoršie.
          </Text>

          <Divider style={{ marginVertical: 12 }} />

          <TextInput
            label="Spánok (hodiny)"
            keyboardType="numeric"
            value={sleepHoursText}
            onChangeText={setSleepHoursText}
          />
          <HelperText type={sleepHoursValid ? "info" : "error"} visible>
            Zadaj číslo 0–12 (napr. 7.5).
          </HelperText>

          <ScaleButtons
            label="Kvalita spánku"
            value={sleepQuality}
            onChange={setSleepQuality}
            leftHint="zlá"
            rightHint="výborná"
          />
          <ScaleButtons
            label="Únava"
            value={fatigue}
            onChange={setFatigue}
            leftHint="nízka"
            rightHint="vysoká"
          />
          <ScaleButtons
            label="Svalová bolesť"
            value={muscleSoreness}
            onChange={setMuscleSoreness}
            leftHint="žiadna"
            rightHint="silná"
          />
          <ScaleButtons
            label="Stres"
            value={stress}
            onChange={setStress}
            leftHint="nízky"
            rightHint="vysoký"
          />
          <ScaleButtons
            label="Nálada"
            value={mood}
            onChange={setMood}
            leftHint="zlá"
            rightHint="výborná"
          />
          <ScaleButtons
            label="Energia"
            value={energy}
            onChange={setEnergy}
            leftHint="nízka"
            rightHint="vysoká"
          />

          <TextInput
            label="Poznámka (voliteľné)"
            value={injuryNote}
            onChangeText={setInjuryNote}
            multiline
            numberOfLines={3}
            style={{ marginTop: 14 }}
          />

          {error ? <Text style={{ marginTop: 10 }}>{error}</Text> : null}
        </ScrollView>

        {/* Sticky footer */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={onSave}
            disabled={!canSave || loading}
            loading={loading}
            contentStyle={{ paddingVertical: 6 }}
          >
            Uložiť
          </Button>

          {entry?.score != null ? (
            <Text style={{ marginTop: 8, textAlign: "center" }}>
              Dnešné skóre: {entry.score}
            </Text>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 150, // dôležité: aby posledné polia nešli pod footer
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
