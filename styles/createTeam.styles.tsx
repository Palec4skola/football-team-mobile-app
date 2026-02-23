import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  unchecked: { backgroundColor: "white" },
  choiceLabel: { fontSize: 18, color: "white" },
  uncheckedLabel: { color: "#007AFF" },
});
