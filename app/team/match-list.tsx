import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,   
    ActivityIndicator,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { useTeamCollection } from "../../hooks/useTeamCollection";
import { useUserRole } from "../../hooks/useUserRole";

export default function MatchesScreen() {
  const params = useSearchParams();
  const teamId = params.get("teamId");
  const router = useRouter();
  

  const { items: matches, loadingItems } = useTeamCollection("matches", teamId);
  const { isCoach, loadingRole } = useUserRole();

  if (loadingItems || loadingRole) {
    return <ActivityIndicator />;
  }

    return (
        <View style={styles.container}>
            {isCoach && (
                <Button
                    style={styles.addButton}
                    onPress={() => router.push({ pathname: '/team/create-match', params: { teamId } })}
                >
                    <Text style={styles.addButtonText}>Pridať zápas</Text>
                </Button>
            )}

            {matches.length === 0 ? (
                <Text>Žiadne zápasy zatiaľ.</Text>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Button style={styles.matchItem}
                        onPress={()=> router.push({pathname: '/team/match-detail', params: { teamId, matchId: item.id }})}>
                            <Text style={styles.matchName}>{item.opponent}</Text>
                            <Text>Dátum: {item.date?.toDate ? item.date.toDate().toLocaleDateString() : item.date}</Text>
                            <Text>Miesto: {item.place}</Text>
                        </Button>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    addButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
    matchItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    matchName: { fontSize: 18, fontWeight: 'bold' },
});
