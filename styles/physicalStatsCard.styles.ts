import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
  },

  headerRow: {
    marginBottom: 10,
  },

  title: {
    fontWeight: "700",
  },

  subtitle: {
    opacity: 0.6,
    marginTop: 2,
    marginBottom: 8,
  },

  list: {
    gap: 6, // menej medzier = kompaktnejšie
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)", // jemnejší border
    backgroundColor: "#fff", // čistejší look
  },

  left: {
    flex: 1,
  },

  label: {
    opacity: 0.6,
    marginBottom: 2,
  },

  value: {
    marginTop: 2,
    fontWeight: "700",
  },

  editButton: {
    margin: 0,
  },

  iconPlaceholder: {
    width: 40,
  },

  divider: {
    marginVertical: 2,
    opacity: 0.15,
  },
});