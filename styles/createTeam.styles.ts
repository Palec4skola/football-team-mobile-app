import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    borderRadius: 20,
  },

  cardClip: {
    borderRadius: 20,
    overflow: "hidden",
  },

  cardContent: {
    padding: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    color: "#111827",
  },
  levelRow: {
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },
  levelButton: {
    borderRadius: 14,
  },
  levelButtonContent: {
    paddingVertical: 6,
  },
  submitButton: {
    borderRadius: 14,
    marginTop: 6,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },

  choiceButton: {
    marginBottom: 10,
  },
  unchecked: {},
  choiceLabel: {},
  uncheckedLabel: {},
});
