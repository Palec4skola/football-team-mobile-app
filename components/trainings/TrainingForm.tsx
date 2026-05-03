import React, { useState } from "react";
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "@/styles/trainingForm.styles";

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

export function TrainingForm({
  name,
  onChangeName,
  description,
  onChangeDescription,
  startsAt,
  onChangeStartsAt,
  submitting,
  onSubmit,
}: {
  name: string;
  onChangeName: (v: string) => void;
  description: string;
  onChangeDescription: (v: string) => void;
  startsAt: Date;
  onChangeStartsAt: (d: Date) => void;
  submitting: boolean;
  onSubmit: () => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (!selected) return;

    const next = new Date(startsAt);
    next.setFullYear(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate()
    );

    onChangeStartsAt(next);
  };

  const onChangeTime = (_: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (!selected) return;

    const next = new Date(startsAt);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

    onChangeStartsAt(next);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Nový tréning</Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Názov tréningu</Text>
            <TextInput
              value={name}
              onChangeText={onChangeName}
              mode="outlined"
              style={styles.input}
              placeholder="Napr. Kondičný tréning"
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
                {formatDate(startsAt)}
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={[styles.dateButton, styles.rowButton]}
              >
                {formatTime(startsAt)}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={startsAt}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={startsAt}
                mode="time"
                is24Hour
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Popis</Text>
            <TextInput
              value={description}
              onChangeText={onChangeDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Čo sa bude robiť?"
            />
          </View>

          <Button
            mode="contained"
            loading={submitting}
            disabled={submitting}
            onPress={onSubmit}
            style={styles.submitButton}
          >
            {submitting ? "Pridávam..." : "Pridať tréning"}
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}