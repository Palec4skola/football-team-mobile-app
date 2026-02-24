import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Divider, HelperText, Text, TextInput } from "react-native-paper";
import { ScaleButtons } from "@/components/scaleButtons";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export type WellnessFormValues = {
  sleepHoursText: string;
  sleepQuality: number;
  fatigue: number;
  muscleSoreness: number;
  stress: number;
  mood: number;
  energy: number;
  injuryNote: string;
};

export function WellnessForm({
  dateKey,
  values,
  onChange,
  submitting,
  errorText,
  score,
  onSubmit,
}: {
  dateKey: string;
  values: WellnessFormValues;
  onChange: (patch: Partial<WellnessFormValues>) => void;
  submitting: boolean;
  errorText?: string | null;
  score?: number | null;
  onSubmit: () => void;
}) {
  const sleepHours = Number(values.sleepHoursText.replace(",", "."));
  const sleepHoursValid =
    Number.isFinite(sleepHours) && sleepHours >= 0 && sleepHours <= 12;

  const canSave = useMemo(() => {
    const arr = [
      values.sleepQuality,
      values.fatigue,
      values.muscleSoreness,
      values.stress,
      values.mood,
      values.energy,
    ];
    return sleepHoursValid && arr.every((x) => x >= 1 && x <= 5);
  }, [sleepHoursValid, values]);

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
            Vyplň škály 1–5.
          </Text>

          <Divider style={{ marginVertical: 12 }} />

          <TextInput
            label="Spánok (hodiny)"
            keyboardType="numeric"
            value={values.sleepHoursText}
            onChangeText={(t) => onChange({ sleepHoursText: t })}
          />
          <HelperText type={sleepHoursValid ? "info" : "error"} visible>
            Zadaj číslo 0–12 (napr. 7.5).
          </HelperText>

          <ScaleButtons
            label="Kvalita spánku"
            value={values.sleepQuality}
            onChange={(v) => onChange({ sleepQuality: v })}
            leftHint="zlá"
            rightHint="výborná"
          />
          <ScaleButtons
            label="Únava"
            value={values.fatigue}
            onChange={(v) => onChange({ fatigue: v })}
            leftHint="nízka"
            rightHint="vysoká"
          />
          <ScaleButtons
            label="Svalová bolesť"
            value={values.muscleSoreness}
            onChange={(v) => onChange({ muscleSoreness: v })}
            leftHint="žiadna"
            rightHint="silná"
          />
          <ScaleButtons
            label="Stres"
            value={values.stress}
            onChange={(v) => onChange({ stress: v })}
            leftHint="nízky"
            rightHint="vysoký"
          />
          <ScaleButtons
            label="Nálada"
            value={values.mood}
            onChange={(v) => onChange({ mood: v })}
            leftHint="zlá"
            rightHint="výborná"
          />
          <ScaleButtons
            label="Energia"
            value={values.energy}
            onChange={(v) => onChange({ energy: v })}
            leftHint="nízka"
            rightHint="vysoká"
          />

          <TextInput
            label="Poznámka (voliteľné)"
            value={values.injuryNote}
            onChangeText={(t) => onChange({ injuryNote: t })}
            multiline
            numberOfLines={3}
            style={{ marginTop: 14 }}
          />

          {errorText ? <Text style={{ marginTop: 10 }}>{errorText}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={onSubmit}
            disabled={!canSave || submitting}
            loading={submitting}
            contentStyle={{ paddingVertical: 6 }}
          >
            Uložiť
          </Button>

          {score != null ? (
            <Text style={{ marginTop: 8, textAlign: "center" }}>
              Dnešné skóre: {score}
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
    paddingBottom: 150,
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