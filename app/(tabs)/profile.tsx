import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, View } from 'react-native';
import profileStyles from '../../components/profileStyles';
import { auth, db } from '../../firebase';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import {Text, Button} from 'react-native-paper';

  export default function Profile() {
    const router = useRouter();
    // odstránené, používame useCurrentUser
    const [teamName, setTeamName] = useState<string | null>(null);
    const [teamList, setTeamList] = useState<{ id: string; name: string }[]>([]);
    const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

    const { user, loading } = useCurrentUser();
    const teamIds: string[] = user?.teams || (user?.teamId ? [user.teamId] : []);
    useEffect(() => {
      if (user) {
        // Inicializácia activeTeamId len raz po načítaní user
        setActiveTeamId(teamIds.length > 0 ? teamIds[0] : null);
        const fetchTeams = async () => {
          if (teamIds.length > 0) {
            const teamPromises = teamIds.map(async (id) => {
              const teamRef = doc(db, 'teams', id);
              const teamSnap = await getDoc(teamRef);
              if (teamSnap.exists()) {
                const teamData = teamSnap.data();
                return { id, name: teamData.name || id };
              }
              return { id, name: id };
            });
            const teams = await Promise.all(teamPromises);
            setTeamList(teams);
            const activeTeam = teams.find(t => t.id === teamIds[0]);
            setTeamName(activeTeam ? activeTeam.name : null);
          } else {
            setTeamList([]);
            setTeamName(null);
          }
        };
        fetchTeams();
      }
    }, [user]);

    const handleLogout = async () => {
      try {
        await signOut(auth);
        Alert.alert('Úspech', 'Boli ste odhlásený');
        router.replace('/login');
      } catch (error: any) {
        Alert.alert('Chyba', error.message);
      }
    };

    return (
      <View style={profileStyles.screenBg}>
        <View style={profileStyles.card}>
          <Text style={profileStyles.title}>Profil</Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginVertical: 24 }} />
          ) : user ? (
            <>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={profileStyles.avatar} />
              ) : (
                <View style={profileStyles.avatarPlaceholder} />
              )}
              <Text style={profileStyles.userName}>{user.firstName} {user.lastName}</Text>
              <Text style={profileStyles.userEmail}>{user.email}</Text>
              {teamList.length > 1 ? (
                <View style={{ marginBottom: 12, width: '100%' }}>
                  <Text style={[profileStyles.userTeam, { marginBottom: 4 }]}>Vyber tím:</Text>
                  <Picker
                    selectedValue={activeTeamId}
                    style={{ backgroundColor: '#f2f2f2', borderRadius: 8, width: '100%' }}
                    onValueChange={(itemValue) => {
                      setActiveTeamId(itemValue);
                      const selected = teamList.find(t => t.id === itemValue);
                      setTeamName(selected ? selected.name : null);
                    }}
                  >
                    {teamList.map(team => (
                      <Picker.Item key={team.id} label={team.name} value={team.id} />
                    ))}
                  </Picker>
                </View>
              ) : teamName ? (
                <Text style={profileStyles.userTeam}>Tím: {teamName}</Text>
              ) : null}
            </>
          ) : (
            <Text style={{ marginBottom: 16 }}>Používateľské údaje sa nenačítali.</Text>
          )}
          <Button style={profileStyles.button} onPress={() => router.push('/team/CreateTeamScreen')}>
            <Text style={profileStyles.buttonText}>Vytvoriť tím</Text>
          </Button>
          <Button style={profileStyles.button} onPress={() => router.push('/registration/join-team')}>
            <Text style={profileStyles.buttonText}>Pridať sa do tímu</Text>
          </Button>
          <Button style={[profileStyles.button, profileStyles.logoutButton]} onPress={handleLogout}>
            <Text style={[profileStyles.buttonText, profileStyles.logoutButtonText]}>Odhlásiť sa</Text>
          </Button>
        </View>
      </View>
    );
  }
