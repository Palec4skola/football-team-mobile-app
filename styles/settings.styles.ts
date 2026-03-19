import { StyleSheet } from "react-native";

const settingsStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#f6f8fb",
    flexGrow: 1,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1b1f24",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 8,
  },

  backButton: {
    alignSelf: "flex-start",
    marginLeft: -8,
  },

  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1b1f24",
  },

  inputGroup: {
    marginBottom: 12,
  },

  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
  },

  helperText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});

export default settingsStyles;