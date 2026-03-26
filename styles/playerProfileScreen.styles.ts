import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: { flex: 1 },
  pageContent: { padding: 16, paddingBottom: 28 },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  profileCard: { padding: 16, borderRadius: 16 },
  profileTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileTextCol: { flex: 1 },
  nameLine: { fontWeight: "700" },
  muted: { opacity: 0.7 },

  divider: { marginVertical: 14 },

  sectionTitle: { fontWeight: "700", marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 999 },

  dangerCard: { marginTop: 14, padding: 16, borderRadius: 16 },

  emptyCard: { margin: 16, padding: 16, borderRadius: 16 },

  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  avatar: {
  width: 52,
  height: 52,
  borderRadius: 26,
  marginRight: 12,
},

avatarFallback: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

avatarFallbackText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#374151",
},
});