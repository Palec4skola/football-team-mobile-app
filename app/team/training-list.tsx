import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useTeamCollection } from '../../hooks/useTeamCollection';
import { useUserRole } from '../../hooks/useUserRole';

export default function TrainingListScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const teamId = params.get('teamId');

  const { items: trainings, loadingItems } = useTeamCollection('trainings', teamId);
  const { isCoach, loadingRole } = useUserRole();

  if (loadingItems || loadingRole) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderTrainingItem = ({ item }: { item: any }) => {
    const dateText =
      item.date?.toDate ? item.date.toDate().toLocaleDateString() : item.date ?? '---';

    return (
      <Card
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/team/training-detail',
            params: { teamId, trainingId: item.id },
          })
        }
      >
        <Card.Title title={item.name} />
        <Card.Content>
          <Text>Dátum: {dateText}</Text>
          {item.description ? <Text>Popis: {item.description}</Text> : null}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {isCoach && (
        <Button
          mode="contained"
          onPress={() =>
            router.push({ pathname: '/team/create-training', params: { teamId } })
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
  container: { flex: 1, paddingTop: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
