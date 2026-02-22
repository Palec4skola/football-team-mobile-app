// app/team/create-training.tsx
import { TrainingForm } from "@/components/trainings/TrainingForm";
import { useCreateTraining } from "@/hooks/training/useCreateTraining";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function CreateTrainingScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  const {
    name,
    setName,
    description,
    setDescription,
    startsAt,
    setStartsAt,
    submitting,
    submit,
  } = useCreateTraining(teamId);

  const onSubmit = async () => {
    const newId = await submit();
    if (!newId) return;

    // po vytvorení choď na list alebo detail
    router.replace({
      pathname: "/training/training-list",
      params: { teamId },
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TrainingForm
        name={name}
        onChangeName={setName}
        description={description}
        onChangeDescription={setDescription}
        startsAt={startsAt}
        onChangeStartsAt={setStartsAt}
        submitting={submitting}
        onSubmit={onSubmit}
      />
    </View>
  );
}
