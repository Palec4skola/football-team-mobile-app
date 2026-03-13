import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },

  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  heroEyebrow: {
    color: "#DCE7FF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#EAF1FF",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: "95%",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    borderRadius: 22,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  gridRipple: {
    borderRadius: 22,
  },
  gridInner: {
    minHeight: 150,
    padding: 16,
    justifyContent: "space-between",
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  gridTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  gridHint: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    flexShrink: 1,
  },

  gridFooter: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  miniBar: {
    width: 34,
    height: 6,
    borderRadius: 999,
  },
});