import React from "react";
import { View, Image } from "react-native";
import { Button, Card, Text, ActivityIndicator } from "react-native-paper";
import { styles } from "@/styles/profilePhotoCard.styles";

type Props = {
  fullName: string;
  photoURL?: string | null;
  uploading?: boolean;
  onPickPhoto: () => void;
  onDeletePhoto: () => void;
};

export function ProfilePhotoCard({
  fullName,
  photoURL,
  uploading = false,
  onPickPhoto,
  onDeletePhoto,
}: Props) {
  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.content}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>
              {fullName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{fullName}</Text>

        {uploading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.actions}>
            <Button mode="contained" onPress={onPickPhoto}>
              Zmeniť fotku
            </Button>

            {photoURL ? (
              <Button mode="text" onPress={onDeletePhoto}>
                Odstrániť
              </Button>
            ) : null}
          </View>
        )}
      </View>
    </Card>
  );
}