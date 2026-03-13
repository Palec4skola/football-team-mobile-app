import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { auth, db } from "../../firebase";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import profileStyles from "@/styles/profile.styles";

export default function Profile() {
  const router = useRouter();

  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamList, setTeamList] = useState<{ id: string; name: string }[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

  const { user, loading } = useCurrentUser();
  const teamIds: string[] = user?.teams || (user?.teamId ? [user.teamId] : []);

  useEffect(() => {
    if (!user) return;

    setActiveTeamId(teamIds.length > 0 ? teamIds[0] : null);

    const fetchTeams = async () => {
      if (teamIds.length > 0) {
        const teamPromises = teamIds.map(async (id) => {
          const teamRef = doc(db, "teams", id);
          const teamSnap = await getDoc(teamRef);

          if (teamSnap.exists()) {
            const teamData = teamSnap.data();
            return { id, name: teamData.name || id };
          }

          return { id, name: id };
        });

        const teams = await Promise.all(teamPromises);
        setTeamList(teams);

        const activeTeam = teams.find((t) => t.id === teamIds[0]);
        setTeamName(activeTeam ? activeTeam.name : null);
      } else {
        setTeamList([]);
        setTeamName(null);
      }
    };

    fetchTeams();
  }, [user]);

  const initials = useMemo(() => {
    const first = user?.firstName?.[0] ?? "";
    const last = user?.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Úspech", "Boli ste odhlásený");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Chyba", error.message);
    }
  };

  return (
    <View style={profileStyles.screenBg}>
      <View style={profileStyles.container}>
        <Text style={profileStyles.pageTitle}>Môj profil</Text>
        <Text style={profileStyles.pageSubtitle}>
          Prehľad účtu, tímov a rýchlych akcií.
        </Text>

        <Card style={profileStyles.profileCard} mode="elevated">
          <View style={profileStyles.profileCardInner}>
            {loading ? (
              <ActivityIndicator size="large" style={{ marginVertical: 30 }} />
            ) : user ? (
              <>
                {user.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={profileStyles.avatar}
                  />
                ) : (
                  <View style={profileStyles.avatarFallback}>
                    <Text style={profileStyles.avatarFallbackText}>
                      {initials}
                    </Text>
                  </View>
                )}

                <Text style={profileStyles.userName}>
                  {user.firstName} {user.lastName}
                </Text>

                <Text style={profileStyles.userEmail}>{user.email}</Text>

                <Divider style={profileStyles.divider} />

                {teamList.length > 1 ? (
                  <View style={profileStyles.teamBox}>
                    <Text style={profileStyles.sectionLabel}>Aktívny tím</Text>
                    <View style={profileStyles.pickerWrap}>
                      <Picker
                        selectedValue={activeTeamId}
                        onValueChange={(itemValue) => {
                          setActiveTeamId(itemValue);
                          const selected = teamList.find(
                            (t) => t.id === itemValue
                          );
                          setTeamName(selected ? selected.name : null);
                        }}
                      >
                        {teamList.map((team) => (
                          <Picker.Item
                            key={team.id}
                            label={team.name}
                            value={team.id}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                ) : teamName ? (
                  <View style={profileStyles.teamSingleBox}>
                    <Text style={profileStyles.sectionLabel}>Tím</Text>
                    <Text style={profileStyles.teamName}>{teamName}</Text>
                  </View>
                ) : (
                  <View style={profileStyles.teamSingleBox}>
                    <Text style={profileStyles.sectionLabel}>Tím</Text>
                    <Text style={profileStyles.teamNameMuted}>
                      Zatiaľ nie ste v žiadnom tíme
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={profileStyles.errorText}>
                Používateľské údaje sa nepodarilo načítať.
              </Text>
            )}
          </View>
        </Card>

        <Card style={profileStyles.actionsCard} mode="elevated">
          <View style={profileStyles.actionsInner}>
            <Text style={profileStyles.actionsTitle}>Akcie</Text>

            <Button
              mode="contained"
              style={profileStyles.actionButton}
              contentStyle={profileStyles.actionButtonContent}
              icon="account-group-outline"
              onPress={() => router.push("/team/CreateTeamScreen")}
            >
              Vytvoriť tím
            </Button>

            <Button
              mode="outlined"
              style={profileStyles.actionButton}
              contentStyle={profileStyles.actionButtonContent}
              icon="account-plus-outline"
              onPress={() => router.push("/registration/join-team")}
            >
              Pridať sa do tímu
            </Button>

            <Button
              mode="contained"
              buttonColor="#d9534f"
              style={profileStyles.logoutButton}
              contentStyle={profileStyles.actionButtonContent}
              icon="logout"
              onPress={handleLogout}
            >
              Odhlásiť sa
            </Button>
          </View>
        </Card>
      </View>
    </View>
  );
}