import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },

  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#222", textAlign: "center" },
  subtitle: { marginTop: 6, fontSize: 14, color: "#555", textAlign: "center" },
  subtitleStrong: { fontWeight: "800", color: "#222" },

  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  sep: { height: 10 },

  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  rowMeta: { marginTop: 4, fontSize: 13, color: "#666" },

  statusPill: {
    minWidth: 72,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: { color: "#fff", fontWeight: "800" },

  statusYes: { backgroundColor: "#4CAF50" },
  statusNo: { backgroundColor: "#F44336" },
  statusUnknown: { backgroundColor: "#999" },

  empty: { textAlign: "center", marginTop: 20, color: "#666" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 8, color: "#333" },

  error: { flex: 1, padding: 16, justifyContent: "center" },
  errorTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8, color: "#222" },
  errorText: { color: "#333" },
});