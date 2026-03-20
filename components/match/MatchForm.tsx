import React, { useState } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "@/styles/matchForm.styles";
import type { MatchStatus } from "@/data/firebase/MatchRepo";
import { MatchResultFields } from "./MatchResultFields";

function formatDate(d: Date) {
  return d.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  opponent: string;
  setOpponent: (v: string) => void;
  place: string;
  setPlace: (v: string) => void;
  date: Date;
  setDate: (d: Date) => void;
  status: MatchStatus;
  setStatus: (v: MatchStatus) => void;
  teamScore: string;
  setTeamScore: (v: string) => void;
  opponentScore: string;
  setOpponentScore: (v: string) => void;
  loading: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
};

export function MatchForm({
  opponent,
  setOpponent,
  place,
  setPlace,
  date,
  setDate,
  status,
  setStatus,
  teamScore,
  setTeamScore,
  opponentScore,
  setOpponentScore,
  loading,
  canSubmit,
  onSubmit,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (!selected) return;

    const next = new Date(date);
    next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    setDate(next);
  };

  const onChangeTime = (_: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (!selected) return;

    const next = new Date(date);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setDate(next);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Pridať zápas</Text>
          <Text style={styles.subtitle}>
            Vyplň základné informácie o zápase.
          </Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Súper</Text>
            <TextInput
              mode="outlined"
              value={opponent}
              onChangeText={setOpponent}
              placeholder="napr. FC Nitra"
              style={styles.input}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Dátum a čas</Text>

            <View style={styles.row}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={[styles.dateButton, styles.rowButton]}
              >
                {formatDate(date)}
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={[styles.dateButton, styles.rowButton]}
              >
                {formatTime(date)}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour
                display="default"
                onChange={onChangeTime}
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

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Status zápasu</Text>
            <SegmentedButtons
              value={status}
              onValueChange={(value) => setStatus(value as MatchStatus)}
              buttons={[
                { value: "scheduled", label: "Plánovaný" },
                { value: "finished", label: "Odohraný" },
                { value: "cancelled", label: "Zrušený" },
              ]}
            />
          </View>

          {status === "finished" && (
            <MatchResultFields
              teamScore={teamScore}
              setTeamScore={setTeamScore}
              opponentScore={opponentScore}
              setOpponentScore={setOpponentScore}
            />
          )}

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
    </TouchableWithoutFeedback>
  );
}