import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { auth } from "../../firebase";
import { createTeam } from "@/services/teams/createTeams";
import { styles } from "@/styles/createTeam.styles";

const countries = [
  { label: "Slovensko", value: "Slovakia" },
  { label: "Česko", value: "Czech Republic" },
  { label: "Poľsko", value: "Poland" },
  { label: "Rakúsko", value: "Austria" },
  { label: "Maďarsko", value: "Hungary" },
];

export default function CreateTeamScreen() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState<"amateur" | "professional" | null>(null);
  const [loading, setLoading] = useState(false);

  const [showCountryDropDown, setShowCountryDropDown] = useState(false);

  const handleCreateTeam = async () => {
    const name = teamName.trim();
    const c = country.trim();

    if (!auth.currentUser?.uid) {
      Alert.alert("Chyba", "Nie si prihlásený");
      return;
    }

    if (!name || !c || !level) {
      Alert.alert("Chyba", "Vyplň všetky polia a vyber úroveň tímu.");
      return;
    }

    setLoading(true);
    try {
      await createTeam({
        name,
        country: c,
        level,
        createdBy: auth.currentUser.uid,
      });

      Alert.alert("Úspech", `Tím "${name}" bol vytvorený.`);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Niečo sa pokazilo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Vytvoriť nový tím</Text>
            <Text style={styles.subtitle}>
              Vyplň základné údaje a vyber typ tímu.
            </Text>
          </View>

          <Card style={styles.card} mode="elevated">
            <View style={styles.cardClip}>
              <View style={styles.cardContent}>
                <Text style={styles.label}>Názov tímu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Zadaj názov tímu"
                  value={teamName}
                  onChangeText={setTeamName}
                  editable={!loading}
                />

                <Text style={styles.label}>Krajina</Text>

                <Dropdown
                  label="Vyber krajinu"
                  placeholder="Vyber krajinu"
                  options={countries}
                  value={country}
                  onSelect={(value) => setCountry(value ?? "")}
                  mode="outlined"
                  disabled={loading}
                />

                <Text style={styles.label}>Úroveň tímu</Text>

                <View style={styles.levelRow}>
                  <Button
                    mode={level === "amateur" ? "contained" : "outlined"}
                    style={styles.levelButton}
                    contentStyle={styles.levelButtonContent}
                    onPress={() => setLevel("amateur")}
                    disabled={loading}
                  >
                    Amatérsky
                  </Button>

                  <Button
                    mode={level === "professional" ? "contained" : "outlined"}
                    style={styles.levelButton}
                    contentStyle={styles.levelButtonContent}
                    onPress={() => setLevel("professional")}
                    disabled={loading}
                  >
                    Profesionálny
                  </Button>
                </View>

                <Button
                  mode="contained"
                  onPress={handleCreateTeam}
                  disabled={loading}
                  loading={loading}
                  style={styles.submitButton}
                  contentStyle={styles.submitButtonContent}
                >
                  Vytvoriť tím
                </Button>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
