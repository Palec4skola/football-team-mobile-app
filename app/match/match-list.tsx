// src/app/match/match-list.tsx
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

import { useTeamMatches } from "@/hooks/match/useTeamMatches";
import { useMatchActions } from "@/hooks/match/useMatchActions";
import { useUserRole } from "@/hooks/useUserRole";

export default function MatchListScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get("teamId");

  const { matches, loading } = useTeamMatches(teamId);
  const { isCoach, loadingRole } = useUserRole();
  const { deleteMatch } = useMatchActions(teamId);

  if (loading || loadingRole) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderMatchItem = ({ item }: { item: any }) => {
    const dateText = item.date?.toDate ? item.date.toDate().toLocaleDateString() : "---";

    return (
      <Card style={styles.card}>
        <Card.Title title={item.opponent ?? "Zápas"} />

        <Card.Content>
          <Text>Dátum: {dateText}</Text>
          {item.place ? <Text>Miesto: {item.place}</Text> : null}
          {item.result ? (
            <Text>
              Výsledok: {item.result.home}:{item.result.away}
            </Text>
          ) : (
            <Text>Výsledok: —</Text>
          )}
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() =>
              router.push({
                pathname: "/match/match-detail",
                params: { teamId, matchId: item.id },
              })
            }
          >
            Detail
          </Button>

          {isCoach && (
            <>
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/match/edit-match",
                    params: { teamId, matchId: item.id },
                  })
                }
              >
                Upraviť
              </Button>

              <Button onPress={() => deleteMatch(item.id)} textColor="red">
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
              pathname: "/match/create-match",
              params: { teamId },
            })
          }
          style={styles.addButton}
        >
          Pridať zápas
        </Button>
      )}

      {matches.length === 0 ? (
        <Text style={styles.empty}>Žiadne zápasy zatiaľ.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatchItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: { marginHorizontal: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, marginVertical: 8 },
  empty: { marginHorizontal: 16, marginTop: 12 },
});