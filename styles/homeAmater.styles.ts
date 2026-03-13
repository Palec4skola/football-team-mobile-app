import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  card: {
    marginBottom: 14,
    borderRadius: 18,
    borderLeftWidth: 6,
    overflow: "hidden",
  },

  cardInner: {
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  strongLine: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },

  line: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
});