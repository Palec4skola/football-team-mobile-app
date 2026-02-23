// app/team/edit-training.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { TrainingForm } from "@/components/trainings/TrainingForm";
import { useEditTrainingForm } from "@/hooks/training/useEditTrainingForm";

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
    submit,
  } = useEditTrainingForm(teamId, trainingId);

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
    </View>
  );
}
