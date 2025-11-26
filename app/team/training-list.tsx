import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    FlatList,   
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db, auth } from '../firebase';
import { useSearchParams } from 'expo-router/build/hooks';

export default function TrainingListScreen() {
    const router = useRouter();
    const params = useSearchParams();
    const teamId = params.get('teamId');

    const [trainings, setTrainings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCoach, setIsCoach] = useState(false);

    useEffect(() => {
        if (!teamId) return;

        const load = async () => {
            await fetchRoles();
            await fetchTrainings(teamId);
            setLoading(false);
        };

        load();
    }, [teamId]);

    const fetchTrainings = async (teamId: string) => {
        try {
            const q = query(collection(db, 'trainings'), where('teamId', '==', teamId));
            const snapshot = await getDocs(q);
            const trainingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrainings(trainingsData);
        } catch (error) {
            Alert.alert('Chyba', 'Nepodarilo sa načítať tréningy');
        }
    };

    const fetchRoles = async () => {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const roles = userSnap.data().roles || [];
            setIsCoach(Array.isArray(roles) ? roles.includes('coach') : roles === 'coach');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isCoach && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push({ pathname: '/team/create-training', params: { teamId } })}
                >
                    <Text style={styles.addButtonText}>Vytvoriť tréning</Text>
                </TouchableOpacity>
            )}

            {trainings.length === 0 ? (
                <Text>Žiadne tréningy zatiaľ.</Text>
            ) : (
                <FlatList
                    data={trainings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.trainingItem}>
                            <Text style={styles.trainingName}>{item.name}</Text>
                            <Text>Dátum: {item.date?.toDate ? item.date.toDate().toLocaleDateString() : item.date}</Text>
                            <Text>Popis: {item.description}</Text>
                        </View>
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
    trainingItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    trainingName: { fontSize: 18, fontWeight: 'bold' },
});
