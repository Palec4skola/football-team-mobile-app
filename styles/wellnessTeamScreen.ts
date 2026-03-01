import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f4f8",
  },
  loaderText: {
    marginTop: 8,
    color: "#333",
  },

  errorContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f4f8",
    justifyContent: "center",
  },
  errorTitle: {
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 18,
    color: "#222",
  },
  errorText: {
    color: "#333",
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});