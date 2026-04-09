import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { TrainingForm } from "@/components/trainings/TrainingForm";
import { TrainingVideoCard } from "@/components/trainings/TrainingVideoCard";
import { useEditTrainingForm } from "@/hooks/training/useEditTrainingForm";
import { useTrainingVideo } from "@/hooks/useTrainingVideo";
import { useActiveTeam } from "@/hooks/useActiveTeam";
import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { auth } from "@/firebase";

export default function EditTrainingScreen() {
  const router = useRouter();
  const { teamId, trainingId } = useLocalSearchParams<{
    teamId: string;
    trainingId: string;
  }>();

  const {
    training,
    loadingTraining,
    saving,
    name,
    setName,
    description,
    setDescription,
    startsAt,
    setStartsAt,
    video,
    setVideo,
    submit,
  } = useEditTrainingForm(teamId, trainingId);

  const { uploading, pickAndUploadVideo, deleteVideo } = useTrainingVideo(
    teamId,
    trainingId,
    video,
  );
  const { teamLevel } = useActiveTeam();
  const isProfessional = teamLevel === "professional";
  const { isCoach } = useMyTeamRoles(teamId, auth.currentUser?.uid);
  const canManageVideo = isProfessional && isCoach;

  if (loadingTraining) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!training) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Tréning nebol nájdený.</Text>
      </View>
    );
  }

  const handleUploadVideo = async () => {
    const uploadedVideo = await pickAndUploadVideo();
    if (uploadedVideo) {
      setVideo(uploadedVideo);
    }
  };

  const handleDeleteVideo = async () => {
    const ok = await deleteVideo();
    if (ok) {
      setVideo(null);
    }
  };

  const onSubmit = async () => {
    const ok = await submit();
    if (!ok) return;

    router.replace({
      pathname: "/training/training-detail",
      params: { teamId, trainingId },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <TrainingForm
        name={name}
        onChangeName={setName}
        description={description}
        onChangeDescription={setDescription}
        startsAt={startsAt}
        onChangeStartsAt={setStartsAt}
        submitting={saving}
        onSubmit={onSubmit}
      />
      {isProfessional && (
        <TrainingVideoCard
          video={video}
          uploading={uploading}
          onUpload={handleUploadVideo}
          onDelete={handleDeleteVideo}
          canManage={canManageVideo}
        />
      )}
    </View>
  );
}
