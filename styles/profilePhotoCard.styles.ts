import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },

  content: {
    alignItems: "center",
    padding: 16,
  },

  avatar: {
    width: 96,
  height: 96,
  borderRadius: 48,
  marginBottom: 12,
  borderWidth: 2,
  borderColor: "#2563EB",
  },

  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E5E7EB", // light gray
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  initials: {
    fontSize: 28,
    fontWeight: "600",
    color: "#374151",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },
});