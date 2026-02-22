// src/features/matches/components/MatchForm.tsx
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, HelperText } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "@/styles/trainingForm.styles";

function formatDate(d: Date) {
  return d.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function MatchForm({
  opponent,
  setOpponent,
  place,
  setPlace,
  date,
  setDate,
  loading,
  canSubmit,
  onSubmit,
}: {
  opponent: string;
  setOpponent: (v: string) => void;
  place: string;
  setPlace: (v: string) => void;
  date: Date;
  setDate: (d: Date) => void;
  loading: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setDate(selected);
  };

  const oppOk = opponent.trim().length > 0;
  const placeOk = place.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pridať zápas</Text>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Súper</Text>
          <TextInput
            mode="outlined"
            value={opponent}
            onChangeText={setOpponent}
            placeholder="napr. FC Example"
            style={styles.input}
            autoCapitalize="sentences"
          />
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Dátum zápasu</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {formatDate(date)}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Miesto</Text>
          <TextInput
            mode="outlined"
            value={place}
            onChangeText={setPlace}
            placeholder="ihrisko, hala..."
            style={styles.input}
            autoCapitalize="sentences"
          />
        </View>

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={loading}
          disabled={!canSubmit}
          style={styles.submitButton}
        >
          {loading ? "Pridávam..." : "Pridať zápas"}
        </Button>
      </View>
    </View>
  );
}
