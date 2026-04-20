import React from "react";
import {
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { RegisterForm } from "@/components/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { styles } from "@/styles/register.styles";

export default function RegisterScreen() {
  const router = useRouter();

  const { values, loading, setField, submit } = useRegisterForm(() => {
    Alert.alert("Úspech", "Registrácia prebehla úspešne!");
    router.replace("/registration/mailVerify");
  });

  const handleSubmit = async () => {
    try {
      await submit();
    } catch (error: any) {
      Alert.alert("Chyba", error.message ?? "Niečo sa pokazilo");
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

          <RegisterForm
            values={values}
            loading={loading}
            onChangeFirstName={(v) => setField("firstName", v)}
            onChangeLastName={(v) => setField("lastName", v)}
            onChangeEmail={(v) => setField("email", v)}
            onChangePassword={(v) => setField("password", v)}
            onChangeConfirmPassword={(v) => setField("confirmPassword", v)}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}