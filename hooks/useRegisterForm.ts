import { useState } from "react";
import { registerUser } from "@/data/firebase/AuthRepo";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useRegisterForm(onSuccess?: () => void) {
  const [values, setValues] = useState<RegisterFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: keyof RegisterFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (
      !values.firstName.trim() ||
      !values.lastName.trim() ||
      !values.email.trim() ||
      !values.password ||
      !values.confirmPassword
    ) {
      return "Vyplň všetky polia";
    }

    if (values.password !== values.confirmPassword) {
      return "Heslá sa nezhodujú";
    }

    if (values.password.length < 6) {
      return "Heslo musí mať aspoň 6 znakov";
    }

    return null;
  };

  const submit = async () => {
    const error = validate();
    if (error) {
      throw new Error(error);
    }

    try {
      setLoading(true);

      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    loading,
    setField,
    submit,
  };
}