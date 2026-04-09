import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import {
  uploadTrainingVideo,
  removeTrainingVideo,
} from "@/data/firebase/MediaRepo";
import type { TrainingVideo } from "@/data/firebase/TrainingRepo";

export function useTrainingVideo(teamId: string, trainingId: string, currentVideo?: TrainingVideo | null) {
  const [uploading, setUploading] = useState(false);

  async function pickAndUploadVideo() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Povolenie zamietnuté", "Na výber videa je potrebný prístup ku galérii.");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 0.7,
    });

    if (result.canceled) return null;

    const asset = result.assets?.[0];
    if (!asset?.uri) return null;

    try {
      setUploading(true);

      const uploadedVideo = await uploadTrainingVideo({
        teamId,
        trainingId,
        uri: asset.uri,
        fileName: asset.fileName ?? "training-video.mp4",
        contentType: asset.mimeType ?? "video/mp4",
      });

      Alert.alert("Hotovo", "Video bolo úspešne nahrané.");
      return uploadedVideo;
    } catch (error) {
      console.error("upload training video error", error);
      Alert.alert("Chyba", "Nepodarilo sa nahrať video.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function deleteVideo() {
    try {
      setUploading(true);

      await removeTrainingVideo(teamId, trainingId, currentVideo?.path ?? null);

      Alert.alert("Hotovo", "Video bolo odstránené.");
      return true;
    } catch (error) {
      console.error("remove training video error", error);
      Alert.alert("Chyba", "Nepodarilo sa odstrániť video.");
      return false;
    } finally {
      setUploading(false);
    }
  }

  return {
    uploading,
    pickAndUploadVideo,
    deleteVideo,
  };
}