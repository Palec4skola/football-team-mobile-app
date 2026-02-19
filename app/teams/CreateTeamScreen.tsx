import React, { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import { auth } from "../../firebase";
import { createTeam } from "@/services/teams/createTeams";
import { styles } from "./createTeam.styles";

export default function CreateTeamScreen() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState<"amateur" | "professional" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async () => {
    const name = teamName.trim();
    const c = country.trim();

    if (!auth.currentUser?.uid) {
      Alert.alert("Chyba", "Nie si prihlásený");
      return;
    }
    if (!name || !c || !level) {
      Alert.alert("Chyba", "Vyplň všetky polia a vyber úroveň");
      return;
    }

    setLoading(true);
    try {
      const teamId = await createTeam({
        name,
        country: c,
        level,
        createdBy: auth.currentUser.uid,
      });

      Alert.alert("Úspech", `Tím '${name}' bol vytvorený`);
      router.replace({ "pathname": "/(tabs)"});
    } catch (e: any) {
      Alert.alert("Chyba", e?.message ?? "Niečo sa pokazilo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vytvoriť nový tím</Text>

      <Text>Názov tímu</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj názov tímu"
        value={teamName}
        onChangeText={setTeamName}
      />

      <Text>Krajina</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj krajinu"
        value={country}
        onChangeText={setCountry}
      />

      <Text>Vyberte úroveň tímu</Text>

      <Button
        style={[styles.choiceButton, level !== "amateur" && styles.unchecked]}
        onPress={() => setLevel("amateur")}
        disabled={loading}
      >
        <Text style={[styles.choiceLabel, level !== "amateur" && styles.uncheckedLabel]}>
          Amatérsky
        </Text>
      </Button>

      <Button
        style={[styles.choiceButton, level !== "professional" && styles.unchecked]}
        onPress={() => setLevel("professional")}
        disabled={loading}
      >
        <Text style={[styles.choiceLabel, level !== "professional" && styles.uncheckedLabel]}>
          Profesionálny
        </Text>
      </Button>

      <Button onPress={handleCreateTeam} disabled={loading} loading={loading}>
        <Text>Vytvoriť tím</Text>
      </Button>
    </View>
  );
}
