import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useTeamTrainings } from "@/hooks/trainings/useTeamTrainings";
import { useUserRole } from "../../hooks/useUserRole";
import { useTrainingActions } from "@/hooks/trainings/useTrainingActions";

export default function TrainingListScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get("teamId");

  const { trainings, loading } = useTeamTrainings(teamId);
  const { isCoach, loadingRole } = useUserRole();
  const { deleteTraining } = useTrainingActions(teamId);
  
  if (loading || loadingRole) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderTrainingItem = ({ item }: { item: any }) => {
    const dateText = item.startsAt?.toDate
      ? item.startsAt.toDate().toLocaleDateString()
      : "---";

    return (
      <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Text>Dátum: {dateText}</Text>
        {item.description ? <Text>Popis: {item.description}</Text> : null}
      </Card.Content>

      <Card.Actions>
        <Button onPress={() => router.push({ pathname: "/team/training-detail", params: { teamId, trainingId: item.id } })}>
          Detail
        </Button>

        {isCoach && (
          <>
            <Button
              onPress={() =>
                router.push({ pathname: "/team/edit-training", params: { teamId, trainingId: item.id } })
              }
            >
              Upraviť
            </Button>

            <Button onPress={() => deleteTraining(item.id)} textColor="red">
              Zmazať
            </Button>
          </>
        )}
      </Card.Actions>
    </Card>
    );
  };

  return (
    <View style={styles.container}>
      {isCoach && (
        <Button
          mode="contained"
          onPress={() =>
            router.push({
              pathname: "/team/create-training",
              params: { teamId },
            })
          }
          style={styles.addButton}
        >
          Vytvoriť tréning
        </Button>
      )}

      {trainings.length === 0 ? (
        <Text>Žiadne tréningy zatiaľ.</Text>
      ) : (
        <FlatList
          data={trainings}
          keyExtractor={(item) => item.id}
          renderItem={renderTrainingItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
