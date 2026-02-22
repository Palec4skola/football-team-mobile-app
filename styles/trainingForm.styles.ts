import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  fieldWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  input: {
    backgroundColor: "#f1f3f5",
  },

  dateButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    paddingVertical: 10,
  },

  submitButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 6,
  },
});