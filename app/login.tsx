import React, { useState } from "react";
import {
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { TextInput, Text, Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Chyba", "Vyplň email aj heslo");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        Alert.alert("Chyba", "Používateľské údaje nenájdené");
        return;
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Chyba", error.message);
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
            <Text style={styles.title}>Prihlásenie</Text>
            <Text style={styles.subtitle}>
              Prihlás sa do svojho účtu a pokračuj do aplikácie.
            </Text>
          </View>

          <Card style={styles.card} mode="elevated">
            <View style={styles.cardInner}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                mode="outlined"
                placeholder="napr. test@tim.sk"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                returnKeyType="next"
              />

              <Text style={styles.label}>Heslo</Text>
              <TextInput
                mode="outlined"
                placeholder="Zadaj heslo"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                Prihlásiť sa
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Nemáš účet?</Text>
                <Button
                  mode="text"
                  onPress={() => router.push("../registration/register")}
                  compact
                >
                  Zaregistruj sa
                </Button>
                <Button
                  mode="text"
                  onPress={() => router.push("../registration/forgotPassword")}
                  compact
                >
                  Zabudli ste heslo?
                </Button>
              </View>
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
    lineHeight: 20,
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
    marginBottom: 14,
    backgroundColor: "transparent",
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: 6,
  },
  footer: {
    marginTop: 14,
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    marginBottom: 2,
  },
});