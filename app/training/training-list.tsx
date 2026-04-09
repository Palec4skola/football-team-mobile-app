import { useTeamTrainings } from "@/hooks/training/useTeamTrainings";
import { useTrainingActions } from "@/hooks/training/useTrainingActions";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text, SegmentedButtons } from "react-native-paper";
import { useMyTeamRoles } from "@/hooks/useMyTeamRoles";
import { auth } from "@/firebase";

export default function TrainingListScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get("teamId") ?? undefined;
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const { trainings, loading } = useTeamTrainings(teamId, filter);
  const { isCoach, loadingRoles } = useMyTeamRoles(
    teamId,
    auth.currentUser?.uid,
  );
  const { deleteTraining } = useTrainingActions(teamId);
  if (loading || loadingRoles) {
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
          <Button
            onPress={() =>
              router.push({
                pathname: "/training/training-detail",
                params: { teamId, trainingId: item.id },
              })
            }
          >
            Detail
          </Button>

          {isCoach ? (
            <Button
              onPress={() =>
                router.push({
                  pathname: "/training/edit-training",
                  params: { teamId, trainingId: item.id },
                })
              }
            >
              Upraviť
            </Button>
          ) : null}

          {isCoach ? (
            <Button onPress={() => deleteTraining(item.id)} textColor="red">
              Zmazať
            </Button>
          ) : null}
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
              pathname: "/training/create-training",
              params: { teamId },
            })
          }
          style={styles.addButton}
        >
          Vytvoriť tréning
        </Button>
      )}
      <SegmentedButtons
        value={filter}
        onValueChange={(value) =>
          setFilter(value as "upcoming" | "past" | "all")
        }
        buttons={[
          { value: "upcoming", label: "Nadchádzajúce" },
          { value: "past", label: "Minulé" },
          { value: "all", label: "Všetky" },
        ]}
        style={styles.filter}
      />

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
  filter: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyText: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});
