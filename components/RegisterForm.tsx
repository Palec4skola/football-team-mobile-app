import React from "react";
import { View, TextInput } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { styles } from "@/styles/register.styles";

type Props = {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmit: () => void;
};

export function RegisterForm({
  values,
  loading,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
}: Props) {
  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.cardInner}>
        <Text style={styles.label}>Meno</Text>
        <TextInput
          style={styles.input}
          value={values.firstName}
          onChangeText={onChangeFirstName}
          placeholder="Zadaj meno"
          returnKeyType="next"
        />

        <Text style={styles.label}>Priezvisko</Text>
        <TextInput
          style={styles.input}
          value={values.lastName}
          onChangeText={onChangeLastName}
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
          value={values.email}
          onChangeText={onChangeEmail}
          returnKeyType="next"
        />

        <Text style={styles.label}>Heslo</Text>
        <TextInput
          style={styles.input}
          placeholder="Zadaj heslo"
          secureTextEntry
          value={values.password}
          onChangeText={onChangePassword}
          returnKeyType="next"
        />

        <Text style={styles.label}>Potvrď heslo</Text>
        <TextInput
          style={styles.input}
          placeholder="Zadaj heslo znova"
          secureTextEntry
          value={values.confirmPassword}
          onChangeText={onChangeConfirmPassword}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Registrovať sa
        </Button>
      </View>
    </Card>
  );
}