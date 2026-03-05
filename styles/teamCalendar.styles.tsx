import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },

  dayHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dayHeaderText: { fontWeight: "800", color: "#111" },

  listContent: { padding: 16, paddingTop: 8, paddingBottom: 16 },
  sep: { height: 10 },
  empty: { color: "#666", marginTop: 8 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },

  cardLeft: { flex: 1, paddingRight: 12 },
  cardTitle: { fontWeight: "800", color: "#111" },
  cardSubtitle: { marginTop: 4, color: "#666" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeTraining: { backgroundColor: "#E3F2FD" },
  badgeMatch: { backgroundColor: "#FFF3E0" },
  badgeText: { fontWeight: "800" },
});