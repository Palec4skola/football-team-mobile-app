import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button, Text } from "react-native-paper";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase"; // uprav podľa cesty
import { useRouter } from "expo-router";
import { userRepo } from "@/data/firebase/UserRepo";
import { teamRepo } from "@/data/firebase/TeamRepo";

export default function JoinTeam() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode.length !== 4) {
      Alert.alert("Chyba", "Kód musí mať presne 4 znaky");
      return;
    }

    if (!auth.currentUser?.uid) {
      Alert.alert("Chyba", "Nie si prihlásený");
      return;
    }

    setIsLoading(true);
    try {
      const teamsRef = collection(db, "teams");
      const q = query(teamsRef, where("code", "==", trimmedCode));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("Chyba", "Tím s týmto kódom neexistuje");
        return;
      }

      // Ak kód nie je unikátny, je to problém - aspoň to odhalíš
      if (snapshot.docs.length > 1) {
        Alert.alert("Chyba", "Kód tímu nie je unikátny. Kontaktuj správcu.");
        return;
      }

      const teamDoc = snapshot.docs[0];
      const teamId = teamDoc.id;
      const teamName = teamDoc.data().name;
      const uid = auth.currentUser.uid;

      // 1) Zápis členstva do tímu
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      const firstName = userData.firstName ?? "";
      const lastName = userData.lastName ?? "";
      const photoURL = userData.photoURL ?? "";
    
      teamRepo.addMember(teamId, uid, ["player"], firstName, lastName, photoURL);
      // 2) Zápis členstva do užívateľa
      userRepo.addMembership(uid,teamId,teamName, ["player"]);
      
      Alert.alert("Úspech", "Úspešne si sa pridal do tímu");
      router.replace("/(tabs)/team");
    } catch (error: any) {
      Alert.alert("Chyba", error?.message ?? "Niečo sa pokazilo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pridaj sa do tímu</Text>

      <TextInput
        style={styles.input}
        placeholder="Zadaj 4-miestny kód tímu"
        maxLength={4}
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <Button style={styles.button} onPress={handleJoin}>
          <Text style={styles.buttonText}>Pripojiť sa</Text>
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    letterSpacing: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
