import React from "react";
import { View, Linking } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import type { TrainingVideo } from "@/data/firebase/TrainingRepo";

type Props = {
  video?: TrainingVideo | null;
  uploading: boolean;
  onUpload: () => void;
  onDelete: () => void;
  canManage: boolean;
};

export function TrainingVideoCard({
  video,
  uploading,
  onUpload,
  onDelete,
  canManage,
}: Props) {
  const handleOpenVideo = async () => {
    if (!video?.url) return;
    await Linking.openURL(video.url);
    console.log(canManage);
  };

  return (
    <Card style={{ margin: 16, marginTop: 0 }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Video k tréningu
        </Text>

        {video ? (
          <View style={{ gap: 8 }}>
            <Text>Názov súboru: {video.name}</Text>

            <Button
              mode="outlined"
              onPress={handleOpenVideo}
              disabled={uploading}
            >
              Otvoriť video
            </Button>
 {canManage && (
              <>
                <Button
                  mode="contained-tonal"
                  onPress={onUpload}
                  loading={uploading}
                  disabled={uploading}
                >
                  Zmeniť video
                </Button>

                <Button
                  mode="text"
                  onPress={onDelete}
                  disabled={uploading}
                  textColor="red"
                >
                  Odstrániť video
                </Button>
              </>
            )}
          </View>
        ) : canManage ? (
          <View style={{ gap: 8 }}>
            <Text>K tréningu zatiaľ nie je pridané žiadne video.</Text>

            <Button
              mode="contained"
              onPress={onUpload}
              loading={uploading}
              disabled={uploading}
            >
              Pridať video
            </Button>
          </View>
        ) : (
          <Text>K tréningu zatiaľ nie je pridané žiadne video.</Text>
        )}
      </Card.Content>
    </Card>
  );
}