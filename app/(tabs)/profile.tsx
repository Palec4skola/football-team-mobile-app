import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  ScrollView,
} from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";

import { auth, db } from "../../firebase";
import profileStyles from "@/styles/profile.styles";
import { userRepo, UserModel } from "@/data/firebase/UserRepo";
import { ProfilePhotoCard } from "@/components/profile/profilePhotoCard";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamList, setTeamList] = useState<{ id: string; name: string }[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const { uploading, pickAndUploadPhoto, deletePhoto } = useProfilePhoto(
    user?.uid ?? "",
  );

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;
      if (!uid) {
        setUser(null);
        setTeamList([]);
        setTeamName(null);
        setActiveTeamId(null);
        return;
      }

      const userData = await userRepo.getUserById(uid);
      setUser(userData);

      const ids: string[] =
        userData?.teams || (userData?.teamId ? [userData.teamId] : []);

      setActiveTeamId(ids.length > 0 ? ids[0] : null);

      if (ids.length > 0) {
        const teamPromises = ids.map(async (id) => {
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

        const activeTeam = teams.find((t) => t.id === ids[0]);
        setTeamName(activeTeam ? activeTeam.name : null);
      } else {
        setTeamList([]);
        setTeamName(null);
      }
    } catch {
      Alert.alert("Chyba", "Nepodarilo sa načítať profil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData]),
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Úspech", "Boli ste odhlásený");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Chyba", error.message || "Nepodarilo sa odhlásiť.");
    }
  };

  return (
    <View style={profileStyles.screenBg}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={profileStyles.container}>
          <Text style={profileStyles.pageTitle}>Môj profil</Text>
          <Text style={profileStyles.pageSubtitle}>Prehľad účtu</Text>

          <Card style={profileStyles.profileCard} mode="elevated">
            <View style={profileStyles.profileCardInner}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  style={{ marginVertical: 30 }}
                />
              ) : user ? (
                <>
                  <ProfilePhotoCard
                    fullName={`${user.firstName} ${user.lastName}`}
                    photoURL={user.photoURL}
                    uploading={uploading}
                    onPickPhoto={pickAndUploadPhoto}
                    onDeletePhoto={deletePhoto}
                  />

                  <Text style={profileStyles.userEmail}>{user.email}</Text>

                  <Divider style={profileStyles.divider} />

                  {teamList.length > 1 ? (
                    <View style={profileStyles.teamBox}>
                      <Text style={profileStyles.sectionLabel}>
                        Aktívny tím
                      </Text>
                      <View style={profileStyles.pickerWrap}>
                        <Picker
                          selectedValue={activeTeamId}
                          onValueChange={(itemValue) => {
                            setActiveTeamId(itemValue);
                            const selected = teamList.find(
                              (t) => t.id === itemValue,
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
                mode="outlined"
                style={profileStyles.actionButton}
                contentStyle={profileStyles.actionButtonContent}
                icon="cog-outline"
                onPress={() => router.push("/profileSettings")}
              >
                Nastavenia
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
      </ScrollView>
    </View>
  );
}
