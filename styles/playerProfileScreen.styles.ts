import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
  pageContent: { padding: 16, paddingBottom: 28 },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileCard: { padding: 16, borderRadius: 16 },
  profileTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileTextCol: { flex: 1 },
  nameLine: { fontWeight: "700" },
  muted: { opacity: 0.65 },

  divider: { marginVertical: 14, opacity: 0.15 },

  sectionTitle: { fontWeight: "700", marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 999 },

  dangerCard: { marginTop: 14, padding: 16, borderRadius: 16 },

  emptyCard: { margin: 16, padding: 16, borderRadius: 16 },

  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
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

  dangerButton: {
    marginTop: 16,
    borderRadius: 12,
    borderColor: "#d9534f",
  },

  dangerButtonContent: {
    minHeight: 48,
  },
});
