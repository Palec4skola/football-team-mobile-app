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
  StyleSheet,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Chyba", "Vyplň všetky polia");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Chyba", "Heslá sa nezhodujú");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert("Úspech", "Registrácia prebehla úspešne!");
      router.replace("/registration/choose-join-or-create");
    } catch (error: any) {
      Alert.alert("Chyba", error.message ?? "Niečo sa pokazilo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Registrácia</Text>
            <Text style={styles.subtitle}>
              Vytvor si účet a pokračuj do aplikácie.
            </Text>
          </View>

          <Card style={styles.card} mode="elevated">
            <View style={styles.cardInner}>
              <Text style={styles.label}>Meno</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Zadaj meno"
                returnKeyType="next"
              />

              <Text style={styles.label}>Priezvisko</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Zadaj priezvisko"
                returnKeyType="next"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="napr. test@tim.sk"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />

              <Text style={styles.label}>Heslo</Text>
              <TextInput
                style={styles.input}
                placeholder="Zadaj heslo"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
              />

              <Text style={styles.label}>Potvrď heslo</Text>
              <TextInput
                style={styles.input}
                placeholder="Zadaj heslo znova"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                Registrovať sa
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
  },
  card: {
    borderRadius: 22,
  },
  cardInner: {
    padding: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
    color: "#111827",
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: 6,
  },
});