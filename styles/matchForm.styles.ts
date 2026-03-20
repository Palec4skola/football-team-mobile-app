import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 18,
  },

  fieldWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  input: {
    backgroundColor: "#f8fafc",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  rowButton: {
    flex: 1,
  },

  rowInput: {
    flex: 1,
  },

  dateButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    paddingVertical: 8,
  },

  submitButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 6,
  },
});