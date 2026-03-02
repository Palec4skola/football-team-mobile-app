import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: { marginTop: 14, padding: 16, borderRadius: 16 },

  headerRow: { marginBottom: 10 },
  title: { fontWeight: "700" },
  subtitle: { opacity: 0.7, marginTop: 2 },

  list: { gap: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  left: { flex: 1 },
  label: { opacity: 0.75 },
  value: { marginTop: 2, fontWeight: "700" },

  iconPlaceholder: { width: 48 },
});