import { View, Text, StyleSheet } from 'react-native';

export default function Matches() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Zápasy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
});
