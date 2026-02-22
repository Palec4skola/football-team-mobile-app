import React from "react";
import { Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "@/styles/trainingForm.styles";

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
  const [showPicker, setShowPicker] = React.useState(false);

  const onChangeDate = (_: any, selected?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (selected) onChangeStartsAt(selected);
  };

  return (
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
          <Text style={styles.label}>Dátum</Text>
          <Button
            mode="outlined"
            onPress={() => setShowPicker(true)}
            style={styles.dateButton}
          >
            {startsAt.toLocaleDateString()}
          </Button>

          {showPicker && (
            <DateTimePicker
              value={startsAt}
              mode="date"
              display="default"
              onChange={onChangeDate}
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
  );
}
