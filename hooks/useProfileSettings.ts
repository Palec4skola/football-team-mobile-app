import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

import { auth, db } from "@/firebase";
import { userRepo, UserModel } from "@/data/firebase/UserRepo"; // uprav cestu

export function useProfileSettings() {
  const [user, setUser] = useState<(UserModel & { id: string }) | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // 🔥 načítanie usera z repo
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = auth.currentUser?.uid;

        if (!uid) {
          setUser(null);
          return;
        }

        const userData = await userRepo.getUserById(uid);

        if (userData) {
          setUser({ ...userData, id: uid });

          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
        }
      } catch {
        Alert.alert("Chyba", "Nepodarilo sa načítať používateľa.");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);
  //zmena mena
  const handleSaveProfile = async (): Promise<boolean> => {
    if (!user?.id) {
      Alert.alert("Chyba", "Používateľ nebol načítaný.");
      return false;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      Alert.alert("Chyba", "Meno aj priezvisko musia byť vyplnené.");
      return false;
    }

    try {
      setSavingProfile(true);

      await updateDoc(doc(db, "users", user.id), {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      });

      setUser((prev) =>
        prev
          ? { ...prev, firstName: trimmedFirstName, lastName: trimmedLastName }
          : prev,
      );

      Alert.alert("Úspech", "Údaje boli uložené.");
      return true;
    } catch (error: any) {
      Alert.alert("Chyba", error?.message || "Nepodarilo sa uložiť údaje.");
      return false;
    } finally {
      setSavingProfile(false);
    }
  };

  // zmena hesla
  const handleChangePassword = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      Alert.alert("Chyba", "Používateľ nie je prihlásený.");
      return false;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Chyba", "Vyplňte heslá.");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Chyba", "Heslo musí mať aspoň 6 znakov.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Chyba", "Heslá sa nezhodujú.");
      return false;
    }

    try {
      setSavingPassword(true);

      await updatePassword(auth.currentUser, newPassword);

      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Úspech", "Heslo bolo zmenené.");
      return true;
    } catch (error: any) {
      if (error?.code === "auth/requires-recent-login") {
        Alert.alert(
          "Opätovné prihlásenie",
          "Musíte sa znova prihlásiť pre zmenu hesla.",
        );
        return false;
      } else {
        Alert.alert("Chyba", error?.message || "Nepodarilo sa zmeniť heslo.");
        return false;
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    user,
    loadingUser,

    savingProfile,
    savingPassword,

    firstName,
    lastName,
    newPassword,
    confirmPassword,

    setFirstName,
    setLastName,
    setNewPassword,
    setConfirmPassword,

    handleSaveProfile,
    handleChangePassword,
  };
}
