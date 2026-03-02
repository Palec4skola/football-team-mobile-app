import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 12,
  },

  sheet: {
    borderRadius: 18,
    padding: 14,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerText: { flex: 1, paddingRight: 8 },
  title: { fontWeight: "700" },
  muted: { opacity: 0.7, marginTop: 2 },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
  },
});