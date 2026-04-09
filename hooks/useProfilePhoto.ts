import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadUserProfilePhoto, removeUserProfilePhoto } from "@/data/firebase/MediaRepo";

export function useProfilePhoto(uid: string) {
  const [uploading, setUploading] = useState(false);

  async function pickAndUploadPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Povolenie zamietnuté", "Na výber fotky je potrebný prístup ku galérii.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    try {
      setUploading(true);
      await uploadUserProfilePhoto(uid, asset.uri);
      Alert.alert("Hotovo", "Profilová fotka bola aktualizovaná.");
    } catch (error) {
      console.error("upload profile photo error", error);
      Alert.alert("Chyba", "Nepodarilo sa nahrať profilovú fotku.");
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto() {
    try {
      setUploading(true);
      await removeUserProfilePhoto(uid);
      Alert.alert("Hotovo", "Profilová fotka bola odstránená.");
    } catch (error) {
      console.error("remove profile photo error", error);
      Alert.alert("Chyba", "Nepodarilo sa odstrániť profilovú fotku.");
    } finally {
      setUploading(false);
    }
  }

  return {
    uploading,
    pickAndUploadPhoto,
    deletePhoto,
  };
}