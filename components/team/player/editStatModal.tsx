import React, { useMemo } from "react";
import { Modal, View } from "react-native";
import { Card, Text, TextInput, Button, IconButton } from "react-native-paper";
import { styles } from "@/styles/editStatModal.styles";

export function EditStatModal({
  visible,
  statKey,
  value,
  onChange,
  onCancel,
  onSave,
}: {
  visible: boolean;
  statKey: string | null;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const canSave = useMemo(() => {
    if (!statKey) return false;
    return value.trim().length > 0;
  }, [statKey, value]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Card style={styles.sheet} mode="elevated">
          <View style={styles.sheetHeader}>
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.title}>
                Upraviť hodnotu
              </Text>
              <Text variant="bodySmall" style={styles.muted}>
                {statKey ? `Pole: ${statKey}` : "—"}
              </Text>
            </View>
            <IconButton icon="close" onPress={onCancel} />
          </View>

          <TextInput
            mode="outlined"
            label="Nová hodnota"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            autoFocus
          />

          <View style={styles.actions}>
            <Button mode="text" onPress={onCancel}>
              Zrušiť
            </Button>
            <Button mode="contained" onPress={onSave} disabled={!canSave}>
              Uložiť
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
}
